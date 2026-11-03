import { createContext } from 'react';
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
import type { ColorPreset } from '../theme/theme.ts';

export type { ColorPreset };

export interface WorkforceContextType {
  themeMode: 'light' | 'dark';
  toggleTheme: () => void;
  setThemeMode: (mode: 'light' | 'dark') => void;
  colorPreset: ColorPreset;
  setColorPreset: (preset: ColorPreset) => void;

  viewState: DashboardViewState;
  setViewState: (state: DashboardViewState) => void;
  simulateState: (state: DashboardViewState) => void;

  backendStatus: 'connected' | 'offline' | 'loading';

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
  distributionData: WorkforceDistributionItem[];

  kpis: Record<string, KpiMetric>;

  selectedEmployee: Employee | null;
  setSelectedEmployee: (emp: Employee | null) => void;

  attendanceModalEmployee: Employee | null;
  setAttendanceModalEmployee: (emp: Employee | null) => void;

  isExportOpen: boolean;
  setIsExportOpen: (open: boolean) => void;

  refreshData: () => void;
  updateStatus: (id: string, status: string, clockInTime?: string) => Promise<void>;
}

export const WorkforceContext = createContext<WorkforceContextType | undefined>(undefined);
