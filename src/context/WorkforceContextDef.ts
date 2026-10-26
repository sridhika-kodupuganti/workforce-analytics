import { createContext } from 'react';
import type {
  Employee,
  ActivityItem,
  DashboardFilters,
  DashboardViewState,
  KpiMetric,
  DepartmentMetric,
  AttendanceTrendPoint,
} from '../types/workforce.ts';

export interface WorkforceContextType {
  themeMode: 'light' | 'dark';
  toggleTheme: () => void;
  setThemeMode: (mode: 'light' | 'dark') => void;

  viewState: DashboardViewState;
  setViewState: (state: DashboardViewState) => void;
  simulateState: (state: DashboardViewState) => void;

  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  activeNav: string;
  setActiveNav: (nav: string) => void;

  filters: DashboardFilters;
  setFilter: <K extends keyof DashboardFilters>(key: K, value: DashboardFilters[K]) => void;
  resetFilters: () => void;
  activeFilterCount: number;

  employees: Employee[];
  filteredEmployees: Employee[];
  activities: ActivityItem[];
  filteredActivities: ActivityItem[];
  trendData: AttendanceTrendPoint[];
  departmentMetrics: DepartmentMetric[];

  kpis: Record<string, KpiMetric>;

  selectedEmployee: Employee | null;
  setSelectedEmployee: (emp: Employee | null) => void;

  isExportOpen: boolean;
  setIsExportOpen: (open: boolean) => void;

  refreshData: () => void;
}

export const WorkforceContext = createContext<WorkforceContextType | undefined>(undefined);
