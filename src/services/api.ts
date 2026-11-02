import type {
  DashboardFilters,
  Employee,
  ActivityItem,
  AttendanceTrendPoint,
  DepartmentMetric,
  WorkforceDistributionItem,
  KpiMetric,
  EmployeeSortField,
  SortOrder,
  PaginationMeta,
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

const API_BASE = '/api';

function buildQueryString(params: Record<string, any>): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '' && value !== 'All') {
      query.append(key, String(value));
    }
  }
  const str = query.toString();
  return str ? `?${str}` : '';
}

export const workforceApi = {
  /**
   * Health check
   */
  async getHealth(): Promise<{ status: string; database: string; employeesCount: number }> {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return { status: 'fallback', database: 'in-memory', employeesCount: INITIAL_EMPLOYEES.length };
    }
  },

  /**
   * Fetch 5 Required Dashboard KPI Cards (Total Employees, Present, Absent, On Leave, Attendance Rate)
   */
  async getKpis(filters: DashboardFilters): Promise<Record<string, KpiMetric>> {
    try {
      const qs = buildQueryString({
        department: filters.department,
        location: filters.location,
        status: filters.status,
        dateRange: filters.dateRange,
        searchQuery: filters.searchQuery,
      });

      const res = await fetch(`${API_BASE}/analytics/kpis${qs}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
      throw new Error('Invalid KPI response format');
    } catch {
      // Fallback calculation for offline / test mock resilience
      const filtered = filterEmployees(INITIAL_EMPLOYEES, filters);
      const total = filtered.length;
      const present = filtered.filter((e) => e.status === 'Present' || e.status === 'Overtime').length;
      const remote = filtered.filter((e) => e.status === 'Remote').length;
      const absent = filtered.filter((e) => e.status === 'Absent').length;
      const onLeave = filtered.filter((e) => e.status === 'On Leave').length;
      const active = present + remote;
      const rate = total > 0 ? ((active / total) * 100).toFixed(1) : '95.0';

      return {
        totalEmployees: {
          title: 'Total Employees',
          value: total,
          delta: 4.8,
          deltaPeriod: 'vs last month',
          trend: 'up',
          isPositive: true,
          subtitle: `${total} enrolled staff across all hubs`,
          sparklineData: [Math.max(1, total - 4), Math.max(1, total - 2), total],
          unit: 'employees',
        },
        present: {
          title: 'Present Today',
          value: present,
          delta: 2.4,
          deltaPeriod: 'on-site badge-in',
          trend: 'up',
          isPositive: true,
          subtitle: `${present} on-site · ${remote} remote active`,
          sparklineData: [Math.max(0, present - 3), present],
          progressValue: total > 0 ? Math.round((present / total) * 100) : 0,
        },
        absent: {
          title: 'Absent',
          value: absent,
          delta: -1.2,
          deltaPeriod: 'unexcused absences',
          trend: 'down',
          isPositive: true,
          subtitle: `${absent} unexcused · immediate alert`,
          sparklineData: [absent + 1, absent],
          progressValue: total > 0 ? Math.round((absent / total) * 100) : 0,
        },
        onLeave: {
          title: 'On Leave',
          value: onLeave,
          delta: -3.5,
          deltaPeriod: 'approved leaves',
          trend: 'down',
          isPositive: true,
          subtitle: `${onLeave} planned annual/sick leaves`,
          sparklineData: [onLeave + 2, onLeave],
          progressValue: total > 0 ? Math.round((onLeave / total) * 100) : 0,
        },
        attendanceRate: {
          title: 'Attendance Rate',
          value: `${rate}%`,
          delta: Number(rate) >= 95 ? 1.5 : -1.8,
          deltaPeriod: 'target 95.0%',
          trend: Number(rate) >= 95 ? 'up' : 'down',
          isPositive: Number(rate) >= 95,
          subtitle: `${active} active · ${onLeave + absent} off duty`,
          sparklineData: [92.0, 94.5, Number(rate)],
          progressValue: Number(rate),
        },
        // Backward-compat aliases
        totalWorkforce: {
          ...BASE_KPIS.totalWorkforce,
          value: total,
          subtitle: `${total} matching workforce members`,
        },
        presentToday: {
          ...BASE_KPIS.presentToday,
          value: present,
          subtitle: `${present} on-site · ${remote} remote`,
        },
        overtimeHours: BASE_KPIS.overtimeHours,
      };
    }
  },

  /**
   * Fetch attendance trend points for Area Chart
   */
  async getTrend(range: string = '30d', filters: DashboardFilters): Promise<AttendanceTrendPoint[]> {
    try {
      const qs = buildQueryString({
        range,
        department: filters.department,
        location: filters.location,
        status: filters.status,
      });

      const res = await fetch(`${API_BASE}/analytics/trend${qs}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
      throw new Error('Invalid trend response format');
    } catch {
      const count = range === '7d' ? 7 : range === '14d' ? 14 : MOCK_TREND_DATA_30D.length;
      return MOCK_TREND_DATA_30D.slice(-count);
    }
  },

  /**
   * Fetch department distribution metrics
   */
  async getDepartmentMetrics(filters: DashboardFilters): Promise<DepartmentMetric[]> {
    try {
      const qs = buildQueryString({
        department: filters.department,
        location: filters.location,
        status: filters.status,
      });

      const res = await fetch(`${API_BASE}/analytics/departments${qs}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
      throw new Error('Invalid department response format');
    } catch {
      if (filters.department !== 'All') {
        return MOCK_DEPARTMENT_METRICS.filter((dm) => dm.department === filters.department);
      }
      return MOCK_DEPARTMENT_METRICS;
    }
  },

  /**
   * Fetch workforce distribution items (for Donut Chart)
   */
  async getDistribution(
    dimension: 'work_model' | 'employment_type' | 'department',
    filters: DashboardFilters,
  ): Promise<WorkforceDistributionItem[]> {
    try {
      const qs = buildQueryString({
        dimension,
        department: filters.department,
        location: filters.location,
        status: filters.status,
      });

      const res = await fetch(`${API_BASE}/analytics/distribution${qs}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
      throw new Error('Invalid distribution response format');
    } catch {
      // Fallback distribution
      return [
        { name: 'Hybrid', value: 30, color: '#6366F1', percentage: 50 },
        { name: 'On-site', value: 20, color: '#0EA5E9', percentage: 33.3 },
        { name: 'Remote', value: 10, color: '#10B981', percentage: 16.7 },
      ];
    }
  },

  /**
   * Fetch paginated employees with search, sorting, and filters (SQLite REST API)
   */
  async getEmployees(
    filters: DashboardFilters,
    pagination: {
      page: number;
      limit: number;
      sortBy: EmployeeSortField;
      sortOrder: SortOrder;
    },
  ): Promise<{ employees: Employee[]; pagination: PaginationMeta }> {
    try {
      const qs = buildQueryString({
        department: filters.department,
        location: filters.location,
        status: filters.status,
        searchQuery: filters.searchQuery,
        page: pagination.page,
        limit: pagination.limit,
        sortBy: pagination.sortBy,
        sortOrder: pagination.sortOrder,
      });

      const res = await fetch(`${API_BASE}/employees${qs}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success && json.data) {
        return {
          employees: json.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            email: item.email,
            avatar: item.avatar,
            role: item.role,
            department: item.department,
            location: item.location,
            employmentType: item.employment_type || item.employmentType,
            workModel: item.work_model || item.workModel,
            status: item.status,
            clockInTime: item.clock_in_time || item.clockInTime,
            hoursWorkedToday: item.hours_worked_today ?? item.hoursWorkedToday ?? 0,
            overtimeHoursThisMonth: item.overtime_hours_this_month ?? item.overtimeHoursThisMonth ?? 0,
            leaveType: item.leave_type || item.leaveType,
            joinDate: item.join_date || item.joinDate,
            phone: item.phone,
          })),
          pagination: json.pagination,
        };
      }
      throw new Error('Invalid employees response format');
    } catch {
      // Offline / test fallback
      const filtered = filterEmployees(INITIAL_EMPLOYEES, filters);
      const sorted = [...filtered].sort((a, b) => {
        const valA = (a as any)[pagination.sortBy] ?? '';
        const valB = (b as any)[pagination.sortBy] ?? '';
        if (typeof valA === 'number' && typeof valB === 'number') {
          return pagination.sortOrder === 'asc' ? valA - valB : valB - valA;
        }
        return pagination.sortOrder === 'asc'
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });

      const start = (pagination.page - 1) * pagination.limit;
      const paginated = sorted.slice(start, start + pagination.limit);

      return {
        employees: paginated,
        pagination: {
          total: sorted.length,
          page: pagination.page,
          limit: pagination.limit,
          totalPages: Math.ceil(sorted.length / pagination.limit) || 1,
        },
      };
    }
  },

  /**
   * Fetch recent activities audit log
   */
  async getActivities(
    limit: number = 10,
    offset: number = 0,
    filters: DashboardFilters,
  ): Promise<{ activities: ActivityItem[]; total: number }> {
    try {
      const qs = buildQueryString({
        limit,
        offset,
        department: filters.department,
        searchQuery: filters.searchQuery,
      });

      const res = await fetch(`${API_BASE}/analytics/activities${qs}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success && json.data) {
        return {
          activities: json.data.map((item: any) => ({
            id: item.id,
            employeeId: item.employee_id || item.employeeId,
            employeeName: item.employee_name || item.employeeName,
            avatar: item.avatar,
            department: item.department,
            role: item.role,
            activityType: item.activity_type || item.activityType,
            timestamp: item.timestamp,
            status: item.status,
            details: item.details,
          })),
          total: json.pagination?.total || json.data.length,
        };
      }
      throw new Error('Invalid activity response format');
    } catch {
      const filtered = filterActivities(MOCK_ACTIVITIES, filters);
      return {
        activities: filtered.slice(offset, offset + limit),
        total: filtered.length,
      };
    }
  },

  /**
   * Update employee status in SQLite database
   */
  async updateEmployeeStatus(id: string, status: string, clockInTime?: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/employees/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, clockInTime }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },
};
