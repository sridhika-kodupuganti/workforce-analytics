import type { Database } from 'better-sqlite3';
import { getDatabase } from '../db/database.ts';
import type { ActivityEntity, FilterParams } from '../types/index.ts';

export class ActivityRepository {
  private db: Database;

  constructor(db?: Database) {
    this.db = db || getDatabase();
  }

  public findAll(
    limit: number = 20,
    offset: number = 0,
    filters: FilterParams = {},
  ): { activities: ActivityEntity[]; total: number } {
    const conditions: string[] = ['1=1'];
    const params: any[] = [];

    if (filters.department && filters.department !== 'All') {
      conditions.push('a.department = ?');
      params.push(filters.department);
    }

    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = `%${filters.searchQuery.trim()}%`;
      conditions.push('(a.employee_name LIKE ? OR a.activity_type LIKE ? OR a.details LIKE ?)');
      params.push(q, q, q);
    }

    const where = conditions.join(' AND ');

    const countSql = `SELECT COUNT(*) as count FROM activities a WHERE ${where}`;
    const countRes = this.db.prepare(countSql).get(...params) as { count: number };
    const total = countRes?.count || 0;

    const dataSql = `
      SELECT * FROM activities a
      WHERE ${where}
      ORDER BY datetime(a.timestamp) DESC
      LIMIT ? OFFSET ?
    `;
    const activities = this.db.prepare(dataSql).all(...params, limit, offset) as ActivityEntity[];

    return { activities, total };
  }

  public create(activity: ActivityEntity): ActivityEntity {
    const stmt = this.db.prepare(`
      INSERT INTO activities (
        id, employee_id, employee_name, avatar, department, role, activity_type, timestamp, status, details
      ) VALUES (
        @id, @employee_id, @employee_name, @avatar, @department, @role, @activity_type, @timestamp, @status, @details
      )
    `);
    stmt.run(activity);
    return activity;
  }
}
