# WorkforceIQ — Enterprise Workforce Analytics & Attendance Platform

An enterprise-grade, modern Workforce Analytics and Attendance Management dashboard developed from scratch with **React 19**, **TypeScript**, **Vite**, **Material UI (MUI)**, and **Recharts**.

---

## 🚀 Overview & Architecture

WorkforceIQ provides real-time visibility into distributed global workforce operations across six international hubs. It monitors attendance rates, on-site turnstiles vs remote check-ins, department headcounts, overtime allocations, and shift events with interactive data filters and state simulations.

### Key Technology Stack
- **Core Framework**: React 19 + TypeScript (Strict Type Safety + ES2023)
- **Build System & Dev Server**: Vite 8
- **Design System & Components**: Material UI (MUI) v9 + Emotion styling engine
- **Data Visualization**: Recharts (Interactive Area Charts, Stacked Bar Charts, Donut Charts)
- **Typography & Aesthetics**: Google Fonts (*Plus Jakarta Sans* & *Inter*), custom SVG sparklines, glassmorphism app bars, and responsive micro-interactions
- **Testing & Quality**: Vitest 5, React Testing Library, jsdom, and Oxlint

---

## ✨ Implemented Features

### 1. Collapsible Sidebar & Global Navigation
- **Responsive Layout**: Full 260px expanded menu on desktop, sleek 76px compact rail when collapsed, and accessible mobile slide-over Drawer with backdrop.
- **Navigation Modules**: Dashboard (live indicator), Workforce Directory (with headcount badge 340), Attendance & Logs, Departments, Advanced Analytics, and Platform Settings.
- **Interactive User Mini-Card**: Current operator status (`Sarah Chen - HR Analytics Lead`), live presence dot, and quick profile actions.

### 2. Header & Quick Actions Toolbar
- **State Simulator**: Dedicated segmented controls (`Normal`, `Loading`, `Empty`, `Error`) allowing testers and evaluators to test all edge states with a single click.
- **Theme Toggle**: One-click smooth toggle between high-contrast light mode and deep slate/navy dark mode, with localStorage persistence.
- **Global Search**: Debounced search across employee names, roles, departments, and activities.
- **Live Notifications Popover**: Alert badges showing overtime threshold alerts, approved shift swaps, and pending leave requests.
- **Data Refresh**: Async telemetry reload simulator with visual feedback.
- **Export Engine**: Modal allowing CSV spreadsheet and JSON download with selectable dataset inclusions.

### 3. Five High-Impact KPI Cards
1. **Total Workforce**: Total headcount (340 employees), +4.8% MoM trend badge, full-time vs contractor split, and sparkline.
2. **Attendance Rate**: 96.5% overall presence rate (+1.2% vs target of 95%), active vs absent breakdown, and linear progress bar.
3. **Present Today**: Real-time badge-ins (246 on-site turnstile badges vs 82 remote active staff) with visual proportion bar.
4. **On Leave / Absent**: 12 employees (8 planned annual leaves, 4 sick/casual leaves), with negative-delta positive indicator.
5. **Overtime & Logged Hours**: 343 monthly overtime hours logged, average 8.1 hrs/day workload alert, and monthly trajectory sparkline.

### 4. Interactive Attendance Trend Chart (Recharts)
- Multi-series stacked Area Chart displaying **On-Site Badge-in**, **Remote Active**, and **On Leave** staff across historical days.
- **Time Window Selector**: Toggle between Last 7 Days (7D), Last 14 Days (14D), and Last 30 Days (30D).
- **Custom Tooltip**: Clean floating cards showing exact staff counts and effective attendance percentages per workday.
- Gradient fills with smooth curves, responsive container resizing, and legend toggles.

### 5. Department-wise Employee Distribution (Recharts)
- Horizontal/vertical stacked Bar Chart tracking workforce across all 7 departments (`Engineering`, `Sales`, `Customer Success`, `Product & Design`, `Marketing`, `Finance & Ops`, `Human Resources`).
- **Metric Sorting**: Toggle between sorting by **Total Headcount** or **Attendance Rate %**.
- Stacks present in-office staff, remote staff, and approved leaves with custom hover inspections.

### 6. Workforce Pie & Donut Distribution Chart (Recharts)
- Interactive Donut chart featuring centered metrics overlay (`340 Total Staff`).
- **Dimension Switcher**:
  - By **Work Model**: Hybrid (52.4%), On-site (32.9%), Remote (14.7%)
  - By **Contract Type**: Full-time (83.5%), Contractor (10.6%), Part-time (3.5%), Intern (2.4%)
  - By **Department**: Proportional headcount breakdown
- Hover segment magnification and synced interactive legend table.

### 7. Recent Employee Activity Feed
- Real-time audit log of clock-ins, biometric turnstile badge-ins, leave approvals, overtime logs, and shift swaps.
- Color-coded status chips (`Completed`, `Approved`, `Pending`, `Flagged`).
- Paginated table (5, 10, 20 items per page) with quick employee view action.

### 8. Global Multi-Dimensional Filter Toolbar
- **Time Window**: 7d, 14d, 30d, 90d
- **Department Dropdown**: All or specific department
- **Location Dropdown**: All, New York (HQ), San Francisco, London, Singapore, Berlin, Remote
- **Status Dropdown**: All, Present, Remote, On Leave, Half-Day, Overtime
- **Dynamic Active Filter Chips**: Displays chip for each active filter with quick single-click removal.
- **Smart Reset Button**: Counts active filters and restores defaults in one click.

### 9. Interactive Employee Profile Modal
- Detailed timecard and employee directory card when clicking any staff row or activity event.
- Displays contact email, assigned hub, contract type, clock-in time, tenure, today's hours, and monthly overtime hours.
- Action button to simulate attendance sign-off.

### 10. Robust State Feedback & Error Boundaries
- **Loading State**: Customized skeleton placeholders matching exact KPI card, chart, and table dimensions.
- **Empty State**: Illustrated empty state card with guidance and a "Reset Filters" action button when no matching records exist.
- **Error State**: Simulates HTTP 503 telemetry gateway disconnection with a prominent "Retry Sync" action that automatically recovers the dashboard.

---

## 🧪 Testing Results

The platform includes automated unit and integration tests using **Vitest** and **React Testing Library**:

```bash
npm test
```

### Test Suite Summary
```text
 ✓ src/test/mockData.test.ts (6 tests)
   ✓ returns all employees when no filter is applied
   ✓ filters employees correctly by Department
   ✓ filters employees correctly by Location
   ✓ filters employees correctly by Attendance Status
   ✓ searches employees by name or role case-insensitively
   ✓ filters activities by search query

 ✓ src/test/dashboard.test.tsx (7 tests)
   ✓ renders brand identity and platform title
   ✓ renders all five KPI cards
   ✓ renders the filter toolbar with interactive controls
   ✓ renders recent workforce activity feed
   ✓ switches to Error state when Error button is clicked and recovers on Retry
   ✓ switches to Empty state when Empty button is clicked
   ✓ toggles theme mode button

Test Files:  2 passed (2)
Tests:       13 passed (13)
Duration:    3.07s
```

All 13 automated tests pass with 0 failures and 0 warnings.

---

## 🛠️ Setup & Running Instructions

### Prerequisites
- **Node.js**: v18.0.0 or later (Node 20+ recommended)
- **npm**: v9.0.0 or later

### Installation
1. Clone or navigate into the repository:
   ```bash
   cd review
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally (Development Mode)
Start the Vite development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### Running Tests
Execute the full automated test suite:
```bash
npm test
```

### Running the Linter
Run Oxlint code quality verification:
```bash
npm run lint
```

### Building for Production
Create the optimized production distribution:
```bash
npm run build
```
Preview the production build locally:
```bash
npm run preview
```

---

## 📁 Project Structure

```text
review/
├── index.html                 # HTML5 entrypoint with Google Fonts
├── package.json               # Dependencies and npm scripts
├── tsconfig.json              # TypeScript root configuration
├── tsconfig.app.json          # App TypeScript build rules
├── vite.config.ts             # Vite & Vitest configuration
├── src/
│   ├── main.tsx               # React 19 application root mounting
│   ├── App.tsx                # Master app shell & theme provider
│   ├── index.css              # Global styles & layout reset
│   ├── types/
│   │   └── workforce.ts       # TypeScript domain models and interfaces
│   ├── data/
│   │   └── mockData.ts        # Comprehensive mock dataset and filter helpers
│   ├── theme/
│   │   └── theme.ts           # Material UI Light & Dark theme definitions
│   ├── context/
│   │   ├── WorkforceContextDef.ts # Context & ContextType interfaces
│   │   ├── WorkforceContext.tsx   # Centralized state provider
│   │   └── useWorkforce.ts        # Typed consumer hook
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx        # Responsive collapsible sidebar & navigation
│   │   │   └── TopNavbar.tsx      # Header, search, simulator & profile menu
│   │   └── dashboard/
│   │       ├── WorkforceDashboard.tsx          # Main dashboard page layout
│   │       ├── FilterToolbar.tsx               # Date, department, location, status filters
│   │       ├── KpiCardsGrid.tsx                # 5 KPI cards with sparklines & progress
│   │       ├── AttendanceTrendChart.tsx        # Recharts time-series attendance area chart
│   │       ├── DepartmentDistributionChart.tsx # Recharts stacked department bar chart
│   │       ├── WorkforceDonutChart.tsx         # Recharts donut chart with category toggles
│   │       ├── RecentActivityFeed.tsx          # Live activity table with pagination
│   │       ├── EmployeeDetailModal.tsx         # Employee profile & attendance details modal
│   │       ├── ExportModal.tsx                 # CSV & JSON analytics report exporter
│   │       └── StateFeedback.tsx               # Empty and error state display cards
│   └── test/
│       ├── setup.ts           # Vitest environment setup and mocks
│       ├── mockData.test.ts   # Data filter unit tests
│       └── dashboard.test.tsx # UI integration and feature tests
```

---

## 🎨 Enterprise Design Principles Applied
- **Visual Excellence**: Bespoke indigo (`#4F46E5`), sky (`#0EA5E9`), emerald (`#10B981`), amber (`#F59E0B`), and rose (`#EF4444`) color palette.
- **Glassmorphism**: Translucent app bar with `backdrop-filter: blur(12px)`.
- **Accessibility & Contrast**: Conforms to WCAG AA color contrast standards across light and dark modes.
- **Responsiveness**: Grid layouts that gracefully adapt from multi-column desktop (1600px max width) down to compact mobile phones.
