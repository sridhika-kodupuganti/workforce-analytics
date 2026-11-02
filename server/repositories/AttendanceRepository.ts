import type { Database } from 'better-sqlite3';
import { getDatabase } from '../db/database.ts';
import type {
  AttendanceRecordEntity,
  AttendanceTrendPoint,
  FilterParams,
} from '../types/index.ts';

export class AttendanceRepository {
  private db: Database;

  constructor(db?: Database) {
    this.db = db || getDatabase();
  }

  public getDailyTrend(days: number = 30, filters: FilterParams = {}): AttendanceTrendPoint[] {
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

    const where = conditions.join(' AND ');

    // Group attendance records by date
    const sql = `
      SELECT 
        ar.date,
        SUM(CASE WHEN ar.status IN ('Present', 'Overtime') THEN 1 ELSE 0 END) as present,
        SUM(CASE WHEN ar.status = 'Remote' THEN 1 ELSE 0 END) as remote,
        SUM(CASE WHEN ar.status = 'Absent' THEN 1 ELSE 0 END) as absent,
        SUM(CASE WHEN ar.status = 'On Leave' THEN 1 ELSE 0 END) as onLeave,
        COUNT(ar.id) as total
      FROM attendance_records ar
      JOIN employees e ON e.id = ar.employee_id
      WHERE ${where}
      GROUP BY ar.date
      ORDER BY ar.date DESC
      LIMIT ?
    `;

    params.push(days);

    const rows = (this.db.prepare(sql).all(...params) as any[]).reverse();

    return rows.map((r) => {
      const total = r.total || 1;
      const active = (r.present || 0) + (r.remote || 0);
      const rate = Number(((active / total) * 100).toFixed(1));

      // Format date for chart labels: "YYYY-MM-DD" -> "MMM DD"
      const dateObj = new Date(r.date + 'T00:00:00');
      const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      return {
        date: formattedDate,
        fullDate: r.date,
        present: r.present || 0,
        remote: r.remote || 0,
        absent: r.absent || 0,
        onLeave: r.onLeave || 0,
        total: r.total || 0,
        attendanceRate: rate,
      };
    });
  }

  public getEmployeeHistory(employeeId: string, limit: number = 14): AttendanceRecordEntity[] {
    const stmt = this.db.prepare(`
      SELECT * FROM attendance_records 
      WHERE employee_id = ?
      ORDER BY date DESC
      LIMIT ?
    `);
    return stmt.all(employeeId, limit) as AttendanceRecordEntity[];
  }

  public recordDaily(record: AttendanceRecordEntity): void {
    const stmt = this.db.prepare(`
      INSERT INTO attendance_records (
        employee_id, date, status, clock_in, clock_out, hours_worked, overtime_hours, work_location, notes
      ) VALUES (
        @employee_id, @date, @status, @clock_in, @clock_out, @hours_worked, @overtime_hours, @work_location, @notes
      )
      ON CONFLICT(employee_id, date) DO UPDATE SET
        status = excluded.status,
        clock_in = excluded.clock_in,
        clock_out = excluded.clock_out,
        hours_worked = excluded.hours_worked,
        overtime_hours = excluded.overtime_hours,
        work_location = excluded.work_location,
        notes = excluded.notes
    `);
    stmt.run(record);
  }
}
