export type Department =
  | 'All'
  | 'Engineering'
  | 'Product & Design'
  | 'Marketing'
  | 'Sales'
  | 'Human Resources'
  | 'Customer Success'
  | 'Finance & Ops';

export type Location =
  | 'All'
  | 'New York (HQ)'
  | 'San Francisco'
  | 'London'
  | 'Singapore'
  | 'Berlin'
  | 'Remote';

export type AttendanceStatus =
  | 'All'
  | 'Present'
  | 'Remote'
  | 'On Leave'
  | 'Half-Day'
  | 'Overtime';

export type EmploymentType = 'Full-time' | 'Contractor' | 'Intern' | 'Part-time';

export type WorkModel = 'On-site' | 'Hybrid' | 'Remote';

export interface Employee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  department: Exclude<Department, 'All'>;
  location: Exclude<Location, 'All'>;
  employmentType: EmploymentType;
  workModel: WorkModel;
  status: Exclude<AttendanceStatus, 'All'>;
  clockInTime?: string;
  hoursWorkedToday: number;
  overtimeHoursThisMonth: number;
  leaveType?: 'Annual' | 'Sick' | 'Parental' | 'Casual' | 'Unpaid';
  joinDate: string;
}

export interface ActivityItem {
  id: string;
  employeeId: string;
  employeeName: string;
  avatar: string;
  department: string;
  role: string;
  activityType:
    | 'Clock-in'
    | 'Clock-out'
    | 'Leave Approved'
    | 'Leave Requested'
    | 'Remote Check-in'
    | 'Overtime Logged'
    | 'Shift Swapped';
  timestamp: string;
  status: 'Completed' | 'Pending' | 'Flagged' | 'Approved';
  details: string;
}

export interface AttendanceTrendPoint {
  date: string;
  fullDate: string;
  present: number;
  remote: number;
  onLeave: number;
  total: number;
  attendanceRate: number;
}

export interface DepartmentMetric {
  department: string;
  headcount: number;
  presentCount: number;
  remoteCount: number;
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

export interface DashboardFilters {
  dateRange: '7d' | '14d' | '30d' | '90d' | 'custom';
  startDate?: string;
  endDate?: string;
  department: Department;
  location: Location;
  status: AttendanceStatus;
  searchQuery: string;
}

export interface KpiMetric {
  title: string;
  value: string | number;
  delta: number; // percentage change
  deltaPeriod: string;
  trend: 'up' | 'down' | 'neutral';
  isPositive: boolean;
  subtitle: string;
  sparklineData: number[];
  progressValue?: number;
  unit?: string;
}

export type DashboardViewState = 'normal' | 'loading' | 'empty' | 'error';
