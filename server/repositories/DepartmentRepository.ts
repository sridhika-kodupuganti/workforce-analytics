import type { Database } from 'better-sqlite3';
import { getDatabase } from '../db/database.ts';
import type { DepartmentEntity } from '../types/index.ts';

export class DepartmentRepository {
  private db: Database;

  constructor(db?: Database) {
    this.db = db || getDatabase();
  }

  public getAll(): DepartmentEntity[] {
    const stmt = this.db.prepare(`
      SELECT 
        d.id,
        d.name,
        d.code,
        d.head,
        d.budget,
        d.target_attendance_rate,
        d.created_at,
        COUNT(e.id) as headcount
      FROM departments d
      LEFT JOIN employees e ON e.department_id = d.id
      GROUP BY d.id
      ORDER BY d.name ASC
    `);
    return stmt.all() as DepartmentEntity[];
  }

  public getById(id: number): DepartmentEntity | undefined {
    const stmt = this.db.prepare(`
      SELECT * FROM departments WHERE id = ?
    `);
    return stmt.get(id) as DepartmentEntity | undefined;
  }

  public getByName(name: string): DepartmentEntity | undefined {
    const stmt = this.db.prepare(`
      SELECT * FROM departments WHERE name = ?
    `);
    return stmt.get(name) as DepartmentEntity | undefined;
  }

  public create(dept: Omit<DepartmentEntity, 'id'>): DepartmentEntity {
    const stmt = this.db.prepare(`
      INSERT INTO departments (name, code, head, budget, target_attendance_rate)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(dept.name, dept.code, dept.head, dept.budget, dept.target_attendance_rate);
    return {
      id: Number(info.lastInsertRowid),
      ...dept,
    };
  }
}
