# WorkforceIQ — Enterprise Workforce Analytics & Attendance Platform
## Task 2: Advanced UI/UX Dashboard Development, Architecture & SQLite Integration

An enterprise-grade, modern Workforce Analytics and Attendance Management platform developed with **React 19**, **TypeScript**, **Vite**, **Material UI (MUI)**, **Recharts**, **Node.js**, **Express**, and **SQLite 3**.

---

## 🎨 Figma Design & UI/UX System

- **Figma Design Link**: [https://www.figma.com/file/WorkforceIQ-Analytics-Platform-Task2](https://www.figma.com/design/workforce-analytics-dashboard)
- **Design Tokens & System**:
  - **Color Palette**: High-contrast Slate `#0F172A`, Deep Navy `#1E293B`, Indigo Accent `#6366F1`, Emerald Success `#10B981`, Sky Active `#0EA5E9`, Amber Alert `#F59E0B`, Crimson Danger `#EF4444`.
  - **Typography**: Google Fonts (*Plus Jakarta Sans* for headers, *Inter* for body and tabular numbers).
  - **Layout & Responsiveness**: 12-column responsive fluid grid adapting dynamically to Mobile (<600px), Tablet (600px - 960px), Laptop (960px - 1280px), and Large Desktop (>1280px).
  - **Accessibility**: ARIA labels, role semantics, keyboard navigation, minimum 4.5:1 color contrast ratios, and screen-reader safe sortable tables.

---

## 🏗️ Architecture & Clean Separation of Concerns

The application strictly adheres to **SOLID principles**, **Modular Architecture**, and the **Repository Pattern**:

```
workforce-analytics/
├── server/                                # Backend REST API Layer (Node.js + Express)
│   ├── db/
│   │   ├── database.ts                   # SQLite Connection Manager & WAL optimization
│   │   ├── schema.sql                    # DDL Schemas (departments, employees, attendance, activities)
│   │   └── seed.ts                       # Automated Database Seeder with realistic workforce dataset
│   ├── repositories/                     # Repository Pattern (Direct Database Operations)
│   │   ├── DepartmentRepository.ts       # Department queries & headcounts
│   │   ├── EmployeeRepository.ts         # Search, multi-column sort, filter, pagination
│   │   ├── AttendanceRepository.ts       # Telemetry aggregation & date-range trends
│   │   └── ActivityRepository.ts         # Real-time workforce activity logs
│   ├── services/                         # Business Logic Layer
│   │   ├── AnalyticsService.ts           # Computes 5 Required KPIs, trends, distributions
│   │   └── EmployeeService.ts            # Employee directory & CRUD logic
│   ├── controllers/                      # Express HTTP Controllers
│   │   ├── AnalyticsController.ts        # Request mapping & validation for analytics
│   │   └── EmployeeController.ts         # Request mapping & validation for employees
│   ├── routes/                           # Express Router Modules
│   │   ├── analyticsRoutes.ts            # /api/analytics/*
│   │   └── employeeRoutes.ts             # /api/employees & /api/departments
│   ├── types/                            # Backend strict TypeScript contracts
│   └── index.ts                          # Express server entry point (Port 5001)
│
├── src/                                  # Frontend Client Layer (React 19 + TypeScript + Vite)
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── KpiCardsGrid.tsx          # 5 Mandatory KPI cards (Total, Present, Absent, On Leave, Rate)
│   │   │   ├── EmployeeDirectoryTable.tsx# Sortable, searchable, paginated workforce directory
│   │   │   ├── AttendanceTrendChart.tsx  # Multi-series stacked Area Chart (7D, 14D, 30D)
│   │   │   ├── DepartmentDistributionChart.tsx # Stacked Bar Chart with metric sorting
│   │   │   ├── WorkforceDonutChart.tsx   # Interactive Donut Chart with dimension toggle
│   │   │   ├── RecentActivityFeed.tsx    # Telemetry audit feed with pagination
│   │   │   ├── FilterToolbar.tsx         # Multi-filter toolbar (Dept, Location, Date, Status)
│   │   │   ├── EmployeeDetailModal.tsx   # Rich employee timecard modal
│   │   │   ├── ExportModal.tsx           # CSV & JSON export engine
│   │   │   └── StateFeedback.tsx         # Empty & Error state handlers with Retry
│   │   └── layout/
│   │       ├── Sidebar.tsx               # Collapsible responsive sidebar with live badges
│   │       └── TopNavbar.tsx             # Header with theme toggle, state simulator & profile
│   ├── context/
│   │   ├── WorkforceContext.tsx          # Presentation state, filter coordination & sync
│   │   ├── WorkforceContextDef.ts        # Typed Context interface definitions
│   │   └── useWorkforce.ts               # Custom consumer hook
│   ├── services/
│   │   └── api.ts                        # Frontend API service layer (connects to SQLite backend)
│   ├── types/                            # Frontend TypeScript contracts
│   ├── theme/                            # MUI Light/Dark theme definitions
│   └── App.tsx                           # Application root layout
```

---

## 💾 SQLite Database Schemas (`server/db/schema.sql`)

### 1. `departments`
Stores departmental organization, budget, and target attendance metrics.
```sql
CREATE TABLE departments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  code TEXT UNIQUE NOT NULL,
  head TEXT NOT NULL,
  budget REAL NOT NULL DEFAULT 0,
  target_attendance_rate REAL NOT NULL DEFAULT 95.0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 2. `employees`
Stores complete staff records, contract parameters, and live attendance statuses.
```sql
CREATE TABLE employees (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar TEXT NOT NULL,
  role TEXT NOT NULL,
  department_id INTEGER NOT NULL REFERENCES departments(id),
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
```

### 3. `attendance_records`
Daily telemetry data across past 30+ days for historical trend and rate calculations.
```sql
CREATE TABLE attendance_records (
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
```

### 4. `activities`
Audit logs of clock-ins, biometric turnstile badges, and leave approvals.
```sql
CREATE TABLE activities (
  id TEXT PRIMARY KEY,
  employee_id TEXT REFERENCES employees(id) ON DELETE SET NULL,
  employee_name TEXT NOT NULL,
  avatar TEXT NOT NULL,
  department TEXT NOT NULL,
  role TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL CHECK(status IN ('Completed', 'Pending', 'Flagged', 'Approved')),
  details TEXT NOT NULL
);
```

---

## 📡 REST API Documentation

| Method | Endpoint | Description | Query Parameters |
|--------|----------|-------------|------------------|
| `GET` | `/api/health` | Service & SQLite database health check | None |
| `GET` | `/api/analytics/kpis` | 5 KPI metrics (Total, Present, Absent, On Leave, Rate) | `department`, `location`, `status`, `dateRange` |
| `GET` | `/api/analytics/trend` | Historical attendance area chart points | `range` (`7d`, `14d`, `30d`), `department`, `location` |
| `GET` | `/api/analytics/departments` | Department headcounts & attendance rates | `department`, `location`, `status` |
| `GET` | `/api/analytics/distribution` | Workforce donut chart breakdown | `dimension` (`work_model`, `employment_type`, `department`) |
| `GET` | `/api/analytics/activities` | Paginated live activity stream | `limit`, `offset`, `department`, `searchQuery` |
| `GET` | `/api/employees` | Search, sort, and paginate workforce directory | `page`, `limit`, `sortBy`, `sortOrder`, `department`, `location`, `status`, `searchQuery` |
| `GET` | `/api/employees/:id` | Single employee profile + attendance history | `id` (path param) |
| `PATCH` | `/api/employees/:id/status` | Update employee attendance status | `{ status, clockInTime }` in body |
| `GET` | `/api/departments` | Department master catalog | None |
| `POST` | `/api/seed` | Reseeds SQLite database with fresh dataset | None |

---

## ⚡ Setup & Execution Instructions

### Prerequisites
- Node.js >= 20.x or 22.x
- npm >= 10.x

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed SQLite Database
Populates `workforce.sqlite` with 7 departments, 60 realistic staff members, 30 days of daily attendance telemetry, and activity logs:
```bash
npm run server:seed
```

### 3. Run Frontend & Backend Concurrently
Launches both the Express SQLite REST API (port 5001) and Vite dev server (port 5173):
```bash
npm run dev:all
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

*Alternative individual startup commands:*
```bash
# Terminal 1: Backend Server (Port 5001)
npm run server

# Terminal 2: Vite Dev Server (Port 5173)
npm run dev
```

### 4. Run Test Suite
Executes all 22 automated integration and unit tests:
```bash
npm test
```

### 5. Production Build
Validates strict TypeScript types and compiles Vite production assets:
```bash
npm run build
```

---

## 📊 Key Highlights & Task 2 Verification

1. **Mandatory 5 KPI Cards**:
   - **Total Employees**: Real-time enrolled headcount with MoM growth badge and 7-day sparkline.
   - **Present Today**: Turnstile on-site badges + remote active breakdown with progress indicator.
   - **Absent**: Unexcused absence tracking with threshold status indicators.
   - **On Leave**: Planned annual, sick, and parental leave counters.
   - **Attendance Rate**: Effective workforce presence percentage vs 95.0% enterprise target.

2. **Workforce Directory with Full Search, Sorting & Pagination**:
   - Server-connected search bar filtering names, titles, departments, and IDs.
   - Sortable column headers (`Employee`, `Role & Title`, `Department`, `Hub / Location`, `Status`, `Hours Worked Today`).
   - Material UI `TablePagination` with selectable page sizes (5, 10, 25, 50).
   - Context menus for direct attendance sign-offs and profile inspection.

3. **No Hardcoded Data**:
   - All dashboard statistics, charts, activity feeds, and table rows are dynamically queried from SQLite using the Repository Pattern.

4. **Edge State Simulator**:
   - Single-click toolbar toggle to test `Normal`, `Loading`, `Empty`, and `Error` states with recovery actions.
