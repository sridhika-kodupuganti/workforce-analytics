import type { Database } from 'better-sqlite3';
import { getDatabase } from '../db/database.ts';
import type {
  EmployeeEntity,
  FilterParams,
  PaginationParams,
} from '../types/index.ts';

export class EmployeeRepository {
  private db: Database;

  constructor(db?: Database) {
    this.db = db || getDatabase();
  }

  private buildFilterConditions(filters: FilterParams): { whereClause: string; params: any[] } {
    const conditions: string[] = ['1=1'];
    const params: any[] = [];

    if (filters.department && filters.department !== 'All') {
      conditions.push('e.department = ?');
      params.push(filters.department);
    }

    if (filters.location && filters.location !== 'All') {
      conditions.push('e.location = ?');
      params.push(filters.location);
    }

    if (filters.status && filters.status !== 'All') {
      conditions.push('e.status = ?');
      params.push(filters.status);
    }

    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = `%${filters.searchQuery.trim()}%`;
      conditions.push('(e.name LIKE ? OR e.email LIKE ? OR e.role LIKE ? OR e.department LIKE ? OR e.id LIKE ?)');
      params.push(q, q, q, q, q);
    }

    return {
      whereClause: conditions.join(' AND '),
      params,
    };
  }

  public findAll(
    filters: FilterParams = {},
    pagination?: PaginationParams,
  ): { employees: EmployeeEntity[]; total: number } {
    const { whereClause, params } = this.buildFilterConditions(filters);

    // Total count for pagination
    const countSql = `SELECT COUNT(*) as count FROM employees e WHERE ${whereClause}`;
    const countResult = this.db.prepare(countSql).get(...params) as { count: number };
    const total = countResult?.count || 0;

    // Sorting safe column whitelist
    const allowedSortColumns: Record<string, string> = {
      name: 'e.name',
      role: 'e.role',
      department: 'e.department',
      location: 'e.location',
      status: 'e.status',
      hoursWorkedToday: 'e.hours_worked_today',
      hours_worked_today: 'e.hours_worked_today',
      overtimeHoursThisMonth: 'e.overtime_hours_this_month',
      overtime_hours_this_month: 'e.overtime_hours_this_month',
      joinDate: 'e.join_date',
      join_date: 'e.join_date',
      id: 'e.id',
    };

    const sortBy = pagination?.sortBy && allowedSortColumns[pagination.sortBy]
      ? allowedSortColumns[pagination.sortBy]
      : 'e.name';
    const sortOrder = pagination?.sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    let dataSql = `
      SELECT 
        e.id,
        e.name,
        e.email,
        e.avatar,
        e.role,
        e.department_id,
        e.department,
        e.location,
        e.employment_type,
        e.work_model,
        e.status,
        e.clock_in_time,
        e.hours_worked_today,
        e.overtime_hours_this_month,
        e.leave_type,
        e.join_date,
        e.phone,
        e.created_at
      FROM employees e
      WHERE ${whereClause}
      ORDER BY ${sortBy} ${sortOrder}
    `;

    const queryParams = [...params];

    if (pagination && pagination.limit && pagination.limit > 0) {
      const page = pagination.page && pagination.page > 0 ? pagination.page : 1;
      const offset = (page - 1) * pagination.limit;
      dataSql += ` LIMIT ? OFFSET ?`;
      queryParams.push(pagination.limit, offset);
    }

    const employees = this.db.prepare(dataSql).all(...queryParams) as EmployeeEntity[];

    return { employees, total };
  }

  public findById(id: string): EmployeeEntity | undefined {
    const stmt = this.db.prepare(`
      SELECT * FROM employees WHERE id = ?
    `);
    return stmt.get(id) as EmployeeEntity | undefined;
  }

  public create(emp: EmployeeEntity): EmployeeEntity {
    const stmt = this.db.prepare(`
      INSERT INTO employees (
        id, name, email, avatar, role, department_id, department, location,
        employment_type, work_model, status, clock_in_time, hours_worked_today,
        overtime_hours_this_month, leave_type, join_date, phone
      ) VALUES (
        @id, @name, @email, @avatar, @role, @department_id, @department, @location,
        @employment_type, @work_model, @status, @clock_in_time, @hours_worked_today,
        @overtime_hours_this_month, @leave_type, @join_date, @phone
      )
    `);
    stmt.run(emp);
    return emp;
  }

  public updateStatus(id: string, status: string, clockInTime?: string | null): boolean {
    const stmt = this.db.prepare(`
      UPDATE employees 
      SET status = ?, clock_in_time = COALESCE(?, clock_in_time)
      WHERE id = ?
    `);
    const result = stmt.run(status, clockInTime ?? null, id);
    return result.changes > 0;
  }

  public count(filters: FilterParams = {}): number {
    const { whereClause, params } = this.buildFilterConditions(filters);
    const sql = `SELECT COUNT(*) as count FROM employees e WHERE ${whereClause}`;
    const res = this.db.prepare(sql).get(...params) as { count: number };
    return res?.count || 0;
  }

  public getDistribution(
    dimension: 'department' | 'location' | 'work_model' | 'employment_type' | 'status',
    filters: FilterParams = {},
  ): Array<{ name: string; count: number }> {
    const { whereClause, params } = this.buildFilterConditions(filters);
    const sql = `
      SELECT e.${dimension} as name, COUNT(*) as count
      FROM employees e
      WHERE ${whereClause}
      GROUP BY e.${dimension}
      ORDER BY count DESC
    `;
    return this.db.prepare(sql).all(...params) as Array<{ name: string; count: number }>;
  }

  public getDepartmentMetrics(filters: FilterParams = {}): Array<{
    department: string;
    headcount: number;
    presentCount: number;
    remoteCount: number;
    absentCount: number;
    onLeaveCount: number;
    attendanceRate: number;
    avgHours: number;
    overtimeHours: number;
  }> {
    const { whereClause, params } = this.buildFilterConditions(filters);
    const sql = `
      SELECT 
        e.department,
        COUNT(e.id) as headcount,
        SUM(CASE WHEN e.status IN ('Present', 'Overtime') THEN 1 ELSE 0 END) as presentCount,
        SUM(CASE WHEN e.status = 'Remote' THEN 1 ELSE 0 END) as remoteCount,
        SUM(CASE WHEN e.status = 'Absent' THEN 1 ELSE 0 END) as absentCount,
        SUM(CASE WHEN e.status = 'On Leave' THEN 1 ELSE 0 END) as onLeaveCount,
        ROUND(AVG(e.hours_worked_today), 1) as avgHours,
        ROUND(SUM(e.overtime_hours_this_month), 1) as overtimeHours
      FROM employees e
      WHERE ${whereClause}
      GROUP BY e.department
      ORDER BY headcount DESC
    `;
    const rows = this.db.prepare(sql).all(...params) as any[];

    return rows.map((r) => {
      const active = (r.presentCount || 0) + (r.remoteCount || 0);
      const headcount = r.headcount || 1;
      const rate = Number(((active / headcount) * 100).toFixed(1));
      return {
        department: r.department,
        headcount: r.headcount,
        presentCount: r.presentCount || 0,
        remoteCount: r.remoteCount || 0,
        absentCount: r.absentCount || 0,
        onLeaveCount: r.onLeaveCount || 0,
        attendanceRate: rate,
        avgHours: r.avgHours || 8.0,
        overtimeHours: r.overtimeHours || 0,
      };
    });
  }
}
