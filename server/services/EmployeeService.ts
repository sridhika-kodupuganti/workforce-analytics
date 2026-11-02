import { EmployeeRepository } from '../repositories/EmployeeRepository.ts';
import { AttendanceRepository } from '../repositories/AttendanceRepository.ts';
import { ActivityRepository } from '../repositories/ActivityRepository.ts';
import type {
  EmployeeEntity,
  FilterParams,
  PaginationParams,
  PaginatedResult,
} from '../types/index.ts';

export class EmployeeService {
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

  public getEmployees(
    filters: FilterParams = {},
    pagination: PaginationParams = { page: 1, limit: 10, sortBy: 'name', sortOrder: 'asc' },
  ): PaginatedResult<EmployeeEntity> {
    const page = Math.max(1, Number(pagination.page) || 1);
    const limit = Math.max(1, Number(pagination.limit) || 10);

    const { employees, total } = this.employeeRepo.findAll(filters, {
      ...pagination,
      page,
      limit,
    });

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data: employees,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  public getEmployeeById(id: string) {
    const employee = this.employeeRepo.findById(id);
    if (!employee) return null;

    const attendanceHistory = this.attendanceRepo.getEmployeeHistory(id, 14);

    return {
      ...employee,
      attendanceHistory,
    };
  }

  public createEmployee(data: EmployeeEntity): EmployeeEntity {
    const employee = this.employeeRepo.create(data);

    // Log creation activity
    this.activityRepo.create({
      id: `ACT-${Date.now()}`,
      employee_id: employee.id,
      employee_name: employee.name,
      avatar: employee.avatar,
      department: employee.department,
      role: employee.role,
      activity_type: 'Remote Check-in',
      timestamp: new Date().toISOString(),
      status: 'Completed',
      details: `New staff member onboarded to ${employee.department} (${employee.location})`,
    });

    return employee;
  }

  public updateStatus(id: string, status: string, clockInTime?: string): boolean {
    const success = this.employeeRepo.updateStatus(id, status, clockInTime);
    if (success) {
      const emp = this.employeeRepo.findById(id);
      if (emp) {
        this.activityRepo.create({
          id: `ACT-${Date.now()}`,
          employee_id: emp.id,
          employee_name: emp.name,
          avatar: emp.avatar,
          department: emp.department,
          role: emp.role,
          activity_type: status === 'Present' ? 'Clock-in' : status === 'On Leave' ? 'Leave Approved' : 'Remote Check-in',
          timestamp: new Date().toISOString(),
          status: 'Completed',
          details: `Attendance status updated to ${status} via biometric turnstile gateway`,
        });
      }
    }
    return success;
  }
}
