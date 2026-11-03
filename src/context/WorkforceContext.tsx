import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type {
  Employee,
  ActivityItem,
  DashboardFilters,
  DashboardViewState,
  KpiMetric,
  DepartmentMetric,
  AttendanceTrendPoint,
  WorkforceDistributionItem,
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
import { workforceApi } from '../services/api.ts';
import { WorkforceContext, type ColorPreset } from './WorkforceContextDef.ts';

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

  // Color preset state (Aesthetic theme options)
  const [colorPreset, setColorPresetState] = useState<ColorPreset>(() => {
    try {
      const saved = localStorage.getItem('workforce_palette') as ColorPreset;
      if (saved && ['royal', 'emerald', 'sapphire', 'rose', 'amber'].includes(saved)) {
        return saved;
      }
      return 'royal';
    } catch {
      return 'royal';
    }
  });

  const setColorPreset = useCallback((preset: ColorPreset) => {
    setColorPresetState(preset);
    try {
      localStorage.setItem('workforce_palette', preset);
    } catch {
      // ignore
    }
  }, []);

  // UI Navigation & Sidebar
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);
  const [activeNav, setActiveNav] = useState<string>('dashboard');

  // Backend connection status
  const [backendStatus, setBackendStatus] = useState<'connected' | 'offline' | 'loading'>('loading');

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

  // Master Data state (populated from SQLite REST API)
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [activities, setActivities] = useState<ActivityItem[]>(MOCK_ACTIVITIES);
  const [trendData, setTrendData] = useState<AttendanceTrendPoint[]>(MOCK_TREND_DATA_30D);
  const [departmentMetrics, setDepartmentMetrics] = useState<DepartmentMetric[]>(MOCK_DEPARTMENT_METRICS);
  const [distributionData, setDistributionData] = useState<WorkforceDistributionItem[]>([]);
  const [kpis, setKpis] = useState<Record<string, KpiMetric>>(BASE_KPIS);

  // Selected employee for detailed modal
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Export Modal state
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Initial load & when filters change
  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const health = await workforceApi.getHealth();
        if (!isMounted) return;
        setBackendStatus(health.status === 'healthy' ? 'connected' : 'offline');

        const [kpiRes, empRes, trendRes, deptRes, actRes, distRes] = await Promise.all([
          workforceApi.getKpis(filters),
          workforceApi.getEmployees(filters, { page: 1, limit: 100, sortBy: 'name', sortOrder: 'asc' }),
          workforceApi.getTrend(filters.dateRange, filters),
          workforceApi.getDepartmentMetrics(filters),
          workforceApi.getActivities(20, 0, filters),
          workforceApi.getDistribution('work_model', filters),
        ]);

        if (!isMounted) return;
        if (kpiRes) setKpis(kpiRes);
        if (empRes?.employees?.length) setEmployees(empRes.employees);
        if (trendRes?.length) setTrendData(trendRes);
        if (deptRes?.length) setDepartmentMetrics(deptRes);
        if (actRes?.activities?.length) setActivities(actRes.activities);
        if (distRes?.length) setDistributionData(distRes);
      } catch (err) {
        if (!isMounted) return;
        console.warn('API sync warning, falling back to local dataset:', err);
        setBackendStatus('offline');
      }
    }

    void fetchData();
    return () => {
      isMounted = false;
    };
  }, [filters]);

  // Refresh data action
  const refreshData = useCallback(async () => {
    setViewState('loading');
    try {
      const [kpiRes, empRes, trendRes, deptRes, actRes, distRes] = await Promise.all([
        workforceApi.getKpis(filters),
        workforceApi.getEmployees(filters, { page: 1, limit: 100, sortBy: 'name', sortOrder: 'asc' }),
        workforceApi.getTrend(filters.dateRange, filters),
        workforceApi.getDepartmentMetrics(filters),
        workforceApi.getActivities(20, 0, filters),
        workforceApi.getDistribution('work_model', filters),
      ]);
      if (kpiRes) setKpis(kpiRes);
      if (empRes?.employees?.length) setEmployees(empRes.employees);
      if (trendRes?.length) setTrendData(trendRes);
      if (deptRes?.length) setDepartmentMetrics(deptRes);
      if (actRes?.activities?.length) setActivities(actRes.activities);
      if (distRes?.length) setDistributionData(distRes);
      setViewState('normal');
    } catch {
      setViewState('normal');
    }
  }, [filters]);

  // Filtered employees for display
  const filteredEmployees = useMemo(() => {
    if (viewState === 'empty') return [];
    return filterEmployees(employees, filters);
  }, [employees, filters, viewState]);

  const filteredActivities = useMemo(() => {
    if (viewState === 'empty') return [];
    return filterActivities(activities, filters);
  }, [activities, filters, viewState]);

  // State simulator helper
  const simulateState = useCallback((state: DashboardViewState) => {
    setViewState(state);
    if (state === 'empty') {
      setKpis({
        totalWorkforce: { ...BASE_KPIS.totalWorkforce, value: 0, subtitle: 'No matching records' },
        totalEmployees: { ...BASE_KPIS.totalWorkforce, title: 'Total Employees', value: 0, subtitle: 'No matching records' },
        attendanceRate: { ...BASE_KPIS.attendanceRate, value: '0%', subtitle: 'No active data' },
        presentToday: { ...BASE_KPIS.presentToday, value: 0, subtitle: '0 On-site · 0 Remote' },
        present: { ...BASE_KPIS.presentToday, title: 'Present Today', value: 0, subtitle: '0 On-site · 0 Remote' },
        absent: { ...BASE_KPIS.onLeave, title: 'Absent', value: 0, subtitle: '0 Unexcused' },
        onLeave: { ...BASE_KPIS.onLeave, value: 0, subtitle: '0 Planned · 0 Sick' },
        overtimeHours: { ...BASE_KPIS.overtimeHours, value: '0 hrs', subtitle: '0 hours recorded' },
      });
    }
  }, []);

  // Attendance modal employee state
  const [attendanceModalEmployee, setAttendanceModalEmployee] = useState<Employee | null>(null);

  // Update employee status (e.g. clock-in / mark absent) via SQLite API
  const updateStatus = useCallback(async (id: string, status: string, clockInTime?: string) => {
    try {
      await workforceApi.updateEmployeeStatus(id, status, clockInTime);
    } catch {
      // ignore
    }
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id
          ? {
              ...emp,
              status: status as any,
              ...(clockInTime !== undefined ? { clockInTime } : {}),
            }
          : emp,
      ),
    );
    setSelectedEmployee((prev) =>
      prev && prev.id === id
        ? {
            ...prev,
            status: status as any,
            ...(clockInTime !== undefined ? { clockInTime } : {}),
          }
        : prev,
    );
    void refreshData();
  }, [refreshData]);

  return (
    <WorkforceContext.Provider
      value={{
        themeMode,
        toggleTheme,
        setThemeMode,
        colorPreset,
        setColorPreset,
        viewState,
        setViewState,
        simulateState,
        backendStatus,
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
        distributionData,
        kpis,
        selectedEmployee,
        setSelectedEmployee,
        attendanceModalEmployee,
        setAttendanceModalEmployee,
        isExportOpen,
        setIsExportOpen,
        refreshData,
        updateStatus,
      }}
    >
      {children}
    </WorkforceContext.Provider>
  );
};
