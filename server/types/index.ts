export type DepartmentName =
  | 'Engineering'
  | 'Product & Design'
  | 'Marketing'
  | 'Sales'
  | 'Human Resources'
  | 'Customer Success'
  | 'Finance & Ops';

export type OfficeLocation =
  | 'New York (HQ)'
  | 'San Francisco'
  | 'London'
  | 'Singapore'
  | 'Berlin'
  | 'Remote';

export type AttendanceStatus =
  | 'Present'
  | 'Remote'
  | 'On Leave'
  | 'Absent'
  | 'Half-Day'
  | 'Overtime';

export type EmploymentType = 'Full-time' | 'Contractor' | 'Intern' | 'Part-time';

export type WorkModel = 'On-site' | 'Hybrid' | 'Remote';

export interface DepartmentEntity {
  id: number;
  name: string;
  code: string;
  head: string;
  budget: number;
  target_attendance_rate: number;
  created_at?: string;
  headcount?: number;
}

export interface EmployeeEntity {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  department_id: number;
  department: string;
  location: string;
  employment_type: EmploymentType;
  work_model: WorkModel;
  status: AttendanceStatus;
  clock_in_time: string | null;
  hours_worked_today: number;
  overtime_hours_this_month: number;
  leave_type: string | null;
  join_date: string;
  phone: string | null;
  created_at?: string;
}

export interface AttendanceRecordEntity {
  id?: number;
  employee_id: string;
  date: string;
  status: AttendanceStatus;
  clock_in: string | null;
  clock_out: string | null;
  hours_worked: number;
  overtime_hours: number;
  work_location: string | null;
  notes: string | null;
  created_at?: string;
}

export interface ActivityEntity {
  id: string;
  employee_id: string | null;
  employee_name: string;
  avatar: string;
  department: string;
  role: string;
  activity_type: string;
  timestamp: string;
  status: 'Completed' | 'Pending' | 'Flagged' | 'Approved';
  details: string;
}

export interface FilterParams {
  department?: string;
  location?: string;
  status?: string;
  dateRange?: string; // '7d' | '14d' | '30d' | '90d'
  searchQuery?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface KpiMetric {
  title: string;
  value: string | number;
  delta: number;
  deltaPeriod: string;
  trend: 'up' | 'down' | 'neutral';
  isPositive: boolean;
  subtitle: string;
  sparklineData: number[];
  progressValue?: number;
  unit?: string;
}

export interface KpisResponse {
  totalEmployees: KpiMetric;
  present: KpiMetric;
  absent: KpiMetric;
  onLeave: KpiMetric;
  attendanceRate: KpiMetric;
  // Backward-compat keys for Task 1 components
  totalWorkforce?: KpiMetric;
  presentToday?: KpiMetric;
  overtimeHours?: KpiMetric;
}

export interface AttendanceTrendPoint {
  date: string;
  fullDate: string;
  present: number;
  remote: number;
  absent: number;
  onLeave: number;
  total: number;
  attendanceRate: number;
}

export interface DepartmentMetric {
  department: string;
  headcount: number;
  presentCount: number;
  remoteCount: number;
  absentCount: number;
  onLeaveCount: number;
  attendanceRate: number;
  avgHours: number;
  overtimeHours: number;
}

export interface WorkforceDistributionItem {
  name: string;
  value: number;
  color: string;
  percentage: number;
}
