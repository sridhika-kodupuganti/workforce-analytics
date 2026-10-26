import React, { useState, useMemo, useCallback } from 'react';
import type {
  Employee,
  ActivityItem,
  DashboardFilters,
  DashboardViewState,
  KpiMetric,
} from '../types/workforce.ts';
import {
  INITIAL_EMPLOYEES,
  MOCK_ACTIVITIES,
  MOCK_TREND_DATA_30D,
  MOCK_DEPARTMENT_METRICS,
  BASE_KPIS,
  filterEmployees,
  filterActivities,
} from '../data/mockData.ts';
import { WorkforceContext } from './WorkforceContextDef.ts';

const DEFAULT_FILTERS: DashboardFilters = {
  dateRange: '30d',
  department: 'All',
  location: 'All',
  status: 'All',
  searchQuery: '',
};

export const WorkforceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [themeMode, setThemeModeState] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('workforce_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'dark';
    }
  });

  const toggleTheme = useCallback(() => {
    setThemeModeState((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('workforce_theme', next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const setThemeMode = useCallback((mode: 'light' | 'dark') => {
    setThemeModeState(mode);
    try {
      localStorage.setItem('workforce_theme', mode);
    } catch {
      // ignore
    }
  }, []);

  // UI Navigation & Sidebar
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);
  const [activeNav, setActiveNav] = useState<string>('dashboard');

  // Dashboard view state (normal, loading, empty, error)
  const [viewState, setViewState] = useState<DashboardViewState>('normal');

  // Filters
  const [filters, setFilters] = useState<DashboardFilters>(DEFAULT_FILTERS);

  const setFilter = useCallback(<K extends keyof DashboardFilters>(key: K, value: DashboardFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.department !== 'All') count++;
    if (filters.location !== 'All') count++;
    if (filters.status !== 'All') count++;
    if (filters.dateRange !== '30d') count++;
    if (filters.searchQuery.trim() !== '') count++;
    return count;
  }, [filters]);

  // Master Data
  const [employees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [activities] = useState<ActivityItem[]>(MOCK_ACTIVITIES);

  // Filtered Data
  const filteredEmployees = useMemo(() => {
    if (viewState === 'empty') return [];
    return filterEmployees(employees, filters);
  }, [employees, filters, viewState]);

  const filteredActivities = useMemo(() => {
    if (viewState === 'empty') return [];
    return filterActivities(activities, filters);
  }, [activities, filters, viewState]);

  // Trend data adapted to dateRange
  const trendData = useMemo(() => {
    if (viewState === 'empty') return [];
    const count =
      filters.dateRange === '7d' ? 7 : filters.dateRange === '14d' ? 14 : MOCK_TREND_DATA_30D.length;
    return MOCK_TREND_DATA_30D.slice(-count);
  }, [filters.dateRange, viewState]);

  // Department metrics filtered or adjusted
  const departmentMetrics = useMemo(() => {
    if (viewState === 'empty') return [];
    if (filters.department !== 'All') {
      return MOCK_DEPARTMENT_METRICS.filter((dm) => dm.department === filters.department);
    }
    return MOCK_DEPARTMENT_METRICS;
  }, [filters.department, viewState]);

  // Dynamically compute KPIs
  const kpis: Record<string, KpiMetric> = useMemo(() => {
    if (viewState === 'empty') {
      return {
        totalWorkforce: { ...BASE_KPIS.totalWorkforce, value: 0, subtitle: 'No matching records' },
        attendanceRate: { ...BASE_KPIS.attendanceRate, value: '0%', subtitle: 'No active data' },
        presentToday: { ...BASE_KPIS.presentToday, value: 0, subtitle: '0 On-site · 0 Remote' },
        onLeave: { ...BASE_KPIS.onLeave, value: 0, subtitle: '0 Planned · 0 Sick' },
        overtimeHours: { ...BASE_KPIS.overtimeHours, value: '0 hrs', subtitle: '0 hours recorded' },
      };
    }

    const totalFiltered = filteredEmployees.length;
    const presentCount = filteredEmployees.filter(
      (e) => e.status === 'Present' || e.status === 'Overtime',
    ).length;
    const remoteCount = filteredEmployees.filter((e) => e.status === 'Remote').length;
    const leaveCount = filteredEmployees.filter((e) => e.status === 'On Leave').length;
    const totalActive = presentCount + remoteCount;
    const rate = totalFiltered > 0 ? ((totalActive / totalFiltered) * 100).toFixed(1) : '96.5';

    // If filters are standard default, use baseline KPIs for full company metrics
    if (activeFilterCount === 0) {
      return BASE_KPIS;
    }

    return {
      totalWorkforce: {
        title: 'Filtered Workforce',
        value: totalFiltered,
        delta: 3.2,
        deltaPeriod: 'current filter',
        trend: 'up' as const,
        isPositive: true,
        subtitle: `${totalFiltered} total matching records`,
        sparklineData: [Math.max(1, totalFiltered - 4), Math.max(1, totalFiltered - 2), totalFiltered],
        unit: 'employees',
      },
      attendanceRate: {
        title: 'Attendance Rate',
        value: `${rate}%`,
        delta: Number(rate) >= 95 ? 1.5 : -1.8,
        deltaPeriod: 'in filtered subset',
        trend: (Number(rate) >= 95 ? 'up' : 'down') as 'up' | 'down',
        isPositive: Number(rate) >= 95,
        subtitle: `${totalActive} active · ${leaveCount} on leave`,
        sparklineData: [92.0, 94.5, Number(rate)],
        progressValue: Number(rate),
      },
      presentToday: {
        title: 'Present Today',
        value: presentCount,
        delta: 2.1,
        deltaPeriod: 'on-site badge-in',
        trend: 'up' as const,
        isPositive: true,
        subtitle: `${presentCount} on-site · ${remoteCount} remote`,
        sparklineData: [Math.max(0, presentCount - 3), presentCount],
        progressValue: totalFiltered > 0 ? Math.round((presentCount / totalFiltered) * 100) : 0,
      },
      onLeave: {
        title: 'On Leave / Absent',
        value: leaveCount,
        delta: -4.5,
        deltaPeriod: 'vs avg',
        trend: 'down' as const,
        isPositive: true,
        subtitle: `${leaveCount} marked absent/leave`,
        sparklineData: [leaveCount + 2, leaveCount + 1, leaveCount],
        progressValue: totalFiltered > 0 ? Math.round((leaveCount / totalFiltered) * 100) : 0,
      },
      overtimeHours: {
        title: 'Overtime Logged',
        value: `${filteredEmployees.reduce((acc, curr) => acc + curr.overtimeHoursThisMonth, 0).toFixed(0)} hrs`,
        delta: 4.8,
        deltaPeriod: 'total in selection',
        trend: 'up' as const,
        isPositive: false,
        subtitle: 'Filtered overtime load',
        sparklineData: [30, 45, 60],
        unit: 'hours',
      },
    };
  }, [filteredEmployees, activeFilterCount, viewState]);

  // Selected employee for detailed modal
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Export Modal state
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // State simulator helper
  const simulateState = useCallback((state: DashboardViewState) => {
    setViewState(state);
  }, []);

  // Refresh data simulation
  const refreshData = useCallback(() => {
    setViewState('loading');
    setTimeout(() => {
      setViewState('normal');
    }, 700);
  }, []);

  return (
    <WorkforceContext.Provider
      value={{
        themeMode,
        toggleTheme,
        setThemeMode,
        viewState,
        setViewState,
        simulateState,
        sidebarOpen,
        toggleSidebar,
        setSidebarOpen,
        activeNav,
        setActiveNav,
        filters,
        setFilter,
        resetFilters,
        activeFilterCount,
        employees,
        filteredEmployees,
        activities,
        filteredActivities,
        trendData,
        departmentMetrics,
        kpis,
        selectedEmployee,
        setSelectedEmployee,
        isExportOpen,
        setIsExportOpen,
        refreshData,
      }}
    >
      {children}
    </WorkforceContext.Provider>
  );
};
