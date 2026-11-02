-- Workforce Analytics Platform (WFA) Task 2 Database Schema
-- Target: SQLite 3

PRAGMA foreign_keys = ON;

-- 1. Departments Table
CREATE TABLE IF NOT EXISTS departments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  code TEXT UNIQUE NOT NULL,
  head TEXT NOT NULL,
  budget REAL NOT NULL DEFAULT 0,
  target_attendance_rate REAL NOT NULL DEFAULT 95.0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Employees Table
CREATE TABLE IF NOT EXISTS employees (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar TEXT NOT NULL,
  role TEXT NOT NULL,
  department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
  department TEXT NOT NULL,
  location TEXT NOT NULL,
  employment_type TEXT NOT NULL CHECK(employment_type IN ('Full-time', 'Contractor', 'Intern', 'Part-time')),
  work_model TEXT NOT NULL CHECK(work_model IN ('On-site', 'Hybrid', 'Remote')),
  status TEXT NOT NULL CHECK(status IN ('Present', 'Remote', 'On Leave', 'Absent', 'Half-Day', 'Overtime')),
  clock_in_time TEXT,
  hours_worked_today REAL NOT NULL DEFAULT 0,
  overtime_hours_this_month REAL NOT NULL DEFAULT 0,
  leave_type TEXT CHECK(leave_type IN ('Annual', 'Sick', 'Parental', 'Casual', 'Unpaid') OR leave_type IS NULL),
  join_date TEXT NOT NULL,
  phone TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Attendance Records Table (Historical and Daily Telemetry)
CREATE TABLE IF NOT EXISTS attendance_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id TEXT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  date TEXT NOT NULL, -- Format: YYYY-MM-DD
  status TEXT NOT NULL CHECK(status IN ('Present', 'Remote', 'On Leave', 'Absent', 'Half-Day', 'Overtime')),
  clock_in TEXT,
  clock_out TEXT,
  hours_worked REAL NOT NULL DEFAULT 0,
  overtime_hours REAL NOT NULL DEFAULT 0,
  work_location TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(employee_id, date)
);

-- 4. Workforce Activities Table (Audit and Event Stream)
CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY,
  employee_id TEXT REFERENCES employees(id) ON DELETE SET NULL,
  employee_name TEXT NOT NULL,
  avatar TEXT NOT NULL,
  department TEXT NOT NULL,
  role TEXT NOT NULL,
  activity_type TEXT NOT NULL CHECK(activity_type IN (
    'Clock-in', 'Clock-out', 'Leave Approved', 'Leave Requested',
    'Remote Check-in', 'Overtime Logged', 'Shift Swapped', 'Absent Reported'
  )),
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL CHECK(status IN ('Completed', 'Pending', 'Flagged', 'Approved')),
  details TEXT NOT NULL
);

-- Performance Indexes for Analytics Queries & Filters
CREATE INDEX IF NOT EXISTS idx_emp_dept ON employees(department);
CREATE INDEX IF NOT EXISTS idx_emp_location ON employees(location);
CREATE INDEX IF NOT EXISTS idx_emp_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_emp_name ON employees(name);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance_records(date);
CREATE INDEX IF NOT EXISTS idx_attendance_emp_date ON attendance_records(employee_id, date);
CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON activities(timestamp DESC);
