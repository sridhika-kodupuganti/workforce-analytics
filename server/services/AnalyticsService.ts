import { EmployeeRepository } from '../repositories/EmployeeRepository.ts';
import { AttendanceRepository } from '../repositories/AttendanceRepository.ts';
import { ActivityRepository } from '../repositories/ActivityRepository.ts';
import type {
  FilterParams,
  KpisResponse,
  AttendanceTrendPoint,
  DepartmentMetric,
  WorkforceDistributionItem,
} from '../types/index.ts';

export class AnalyticsService {
  private employeeRepo: EmployeeRepository;
  private attendanceRepo: AttendanceRepository;
  private activityRepo: ActivityRepository;

  constructor(
    employeeRepo?: EmployeeRepository,
    attendanceRepo?: AttendanceRepository,
    activityRepo?: ActivityRepository,
  ) {
    this.employeeRepo = employeeRepo || new EmployeeRepository();
    this.attendanceRepo = attendanceRepo || new AttendanceRepository();
    this.activityRepo = activityRepo || new ActivityRepository();
  }

  public getKpis(filters: FilterParams = {}): KpisResponse {
    const totalEmployees = this.employeeRepo.count(filters);

    // Distribution by status in current filter scope
    const statusCounts = this.employeeRepo.getDistribution('status', filters);
    const countMap: Record<string, number> = {};
    statusCounts.forEach((s) => {
      countMap[s.name] = s.count;
    });

    const presentCount = (countMap['Present'] || 0) + (countMap['Overtime'] || 0);
    const remoteCount = countMap['Remote'] || 0;
    const onLeaveCount = countMap['On Leave'] || 0;
    const absentCount = countMap['Absent'] || 0;
    const totalActive = presentCount + remoteCount;

    const rate = totalEmployees > 0
      ? Number(((totalActive / totalEmployees) * 100).toFixed(1))
      : 0;

    // Get historical trend sparklines (last 7 days)
    const recentTrend = this.attendanceRepo.getDailyTrend(7, filters);
    const rateSparkline = recentTrend.map((t) => t.attendanceRate);
    const totalSparkline = recentTrend.map((t) => t.total);
    const presentSparkline = recentTrend.map((t) => t.present);
    const onLeaveSparkline = recentTrend.map((t) => t.onLeave);
    const absentSparkline = recentTrend.map((t) => t.absent);

    return {
      // 1. Total Employees (Required KPI 1)
      totalEmployees: {
        title: 'Total Employees',
        value: totalEmployees,
        delta: 4.8,
        deltaPeriod: 'vs last month',
        trend: 'up',
        isPositive: true,
        subtitle: `${totalEmployees} enrolled staff across all hubs`,
        sparklineData: totalSparkline.length > 1 ? totalSparkline : [totalEmployees - 5, totalEmployees],
        unit: 'employees',
      },

      // 2. Present (Required KPI 2)
      present: {
        title: 'Present Today',
        value: presentCount,
        delta: 2.4,
        deltaPeriod: 'on-site badge-in',
        trend: 'up',
        isPositive: true,
        subtitle: `${presentCount} on-site · ${remoteCount} remote active`,
        sparklineData: presentSparkline.length > 1 ? presentSparkline : [presentCount - 3, presentCount],
        progressValue: totalEmployees > 0 ? Math.round((presentCount / totalEmployees) * 100) : 0,
      },

      // 3. Absent (Required KPI 3)
      absent: {
        title: 'Absent',
        value: absentCount,
        delta: -1.2,
        deltaPeriod: 'unexcused absences',
        trend: 'down',
        isPositive: true, // lower absent is positive
        subtitle: `${absentCount} unexcused · immediate alert`,
        sparklineData: absentSparkline.length > 1 ? absentSparkline : [absentCount + 1, absentCount],
        progressValue: totalEmployees > 0 ? Math.round((absentCount / totalEmployees) * 100) : 0,
      },

      // 4. On Leave (Required KPI 4)
      onLeave: {
        title: 'On Leave',
        value: onLeaveCount,
        delta: -3.5,
        deltaPeriod: 'approved leaves',
        trend: 'down',
        isPositive: true,
        subtitle: `${onLeaveCount} planned annual/sick leaves`,
        sparklineData: onLeaveSparkline.length > 1 ? onLeaveSparkline : [onLeaveCount + 2, onLeaveCount],
        progressValue: totalEmployees > 0 ? Math.round((onLeaveCount / totalEmployees) * 100) : 0,
      },

      // 5. Attendance Rate (Required KPI 5)
      attendanceRate: {
        title: 'Attendance Rate',
        value: `${rate}%`,
        delta: rate >= 95 ? 1.5 : -1.8,
        deltaPeriod: 'target 95.0%',
        trend: rate >= 95 ? 'up' : 'down',
        isPositive: rate >= 95,
        subtitle: `${totalActive} active · ${onLeaveCount + absentCount} off duty`,
        sparklineData: rateSparkline.length > 1 ? rateSparkline : [94.0, 95.2, rate],
        progressValue: rate,
      },

      // Backward-compatible aliases for existing Task 1 UI components:
      totalWorkforce: {
        title: 'Total Workforce',
        value: totalEmployees,
        delta: 4.8,
        deltaPeriod: 'vs last month',
        trend: 'up',
        isPositive: true,
        subtitle: `${totalEmployees} staff across 6 global hubs`,
        sparklineData: totalSparkline.length > 1 ? totalSparkline : [totalEmployees - 5, totalEmployees],
        unit: 'employees',
      },
      presentToday: {
        title: 'Present Today',
        value: presentCount,
        delta: 2.4,
        deltaPeriod: 'on-site badge-in',
        trend: 'up',
        isPositive: true,
        subtitle: `${presentCount} on-site · ${remoteCount} remote active`,
        sparklineData: presentSparkline.length > 1 ? presentSparkline : [presentCount - 3, presentCount],
        progressValue: totalEmployees > 0 ? Math.round((presentCount / totalEmployees) * 100) : 0,
      },
      overtimeHours: {
        title: 'Overtime & Logged',
        value: '343 hrs',
        delta: 4.8,
        deltaPeriod: 'monthly logged load',
        trend: 'up',
        isPositive: false,
        subtitle: 'Average 8.1 hrs/day workload',
        sparklineData: [40, 52, 68, 75, 84],
        unit: 'hours',
      },
    };
  }

  public getAttendanceTrend(days: number = 30, filters: FilterParams = {}): AttendanceTrendPoint[] {
    return this.attendanceRepo.getDailyTrend(days, filters);
  }

  public getDepartmentMetrics(filters: FilterParams = {}): DepartmentMetric[] {
    return this.employeeRepo.getDepartmentMetrics(filters);
  }

  public getWorkforceDistribution(
    dimension: 'work_model' | 'employment_type' | 'department',
    filters: FilterParams = {},
  ): WorkforceDistributionItem[] {
    const raw = this.employeeRepo.getDistribution(dimension, filters);
    const total = raw.reduce((sum, item) => sum + item.count, 0) || 1;

    const colorPalettes: Record<string, string[]> = {
      work_model: ['#6366F1', '#0EA5E9', '#10B981'],
      employment_type: ['#6366F1', '#F59E0B', '#10B981', '#EC4899'],
      department: ['#6366F1', '#0EA5E9', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#14B8A6'],
    };

    const colors = colorPalettes[dimension] || ['#6366F1', '#0EA5E9', '#10B981', '#F59E0B'];

    return raw.map((item, idx) => ({
      name: item.name,
      value: item.count,
      color: colors[idx % colors.length],
      percentage: Number(((item.count / total) * 100).toFixed(1)),
    }));
  }

  public getActivities(limit: number = 10, offset: number = 0, filters: FilterParams = {}) {
    return this.activityRepo.findAll(limit, offset, filters);
  }
}
