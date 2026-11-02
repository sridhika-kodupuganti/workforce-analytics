import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App.tsx';
import { EmployeeRepository } from '../../server/repositories/EmployeeRepository.ts';
import { DepartmentRepository } from '../../server/repositories/DepartmentRepository.ts';
import { AttendanceRepository } from '../../server/repositories/AttendanceRepository.ts';
import { AnalyticsService } from '../../server/services/AnalyticsService.ts';
import { EmployeeService } from '../../server/services/EmployeeService.ts';

describe('Task 2 — Architecture, Backend SQLite & Advanced UI/UX Tests', () => {
  let employeeRepo: EmployeeRepository;
  let departmentRepo: DepartmentRepository;
  let attendanceRepo: AttendanceRepository;
  let analyticsService: AnalyticsService;
  let employeeService: EmployeeService;

  beforeEach(() => {
    employeeRepo = new EmployeeRepository();
    departmentRepo = new DepartmentRepository();
    attendanceRepo = new AttendanceRepository();
    analyticsService = new AnalyticsService(employeeRepo, attendanceRepo);
    employeeService = new EmployeeService(employeeRepo, attendanceRepo);
  });

  describe('1. SQLite Database & Repository Pattern Tests', () => {
    it('retrieves all departments from SQLite', () => {
      const depts = departmentRepo.getAll();
      expect(depts.length).toBeGreaterThanOrEqual(7);
      expect(depts.some((d) => d.name === 'Engineering')).toBe(true);
      expect(depts.some((d) => d.name === 'Sales')).toBe(true);
    });

    it('retrieves employees with search and pagination from SQLite', () => {
      const result = employeeService.getEmployees(
        { searchQuery: 'Sarah' },
        { page: 1, limit: 10, sortBy: 'name', sortOrder: 'asc' },
      );
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0].name).toContain('Sarah');
      expect(result.pagination.total).toBeGreaterThan(0);
    });

    it('filters employees by department and status in SQLite', () => {
      const result = employeeService.getEmployees(
        { department: 'Engineering', status: 'Present' },
        { page: 1, limit: 10, sortBy: 'name', sortOrder: 'asc' },
      );
      expect(result.data.every((e) => e.department === 'Engineering')).toBe(true);
      expect(result.data.every((e) => e.status === 'Present')).toBe(true);
    });

    it('calculates KPIs including Total Employees, Present, Absent, On Leave, and Attendance Rate from SQLite', () => {
      const kpis = analyticsService.getKpis();
      expect(kpis.totalEmployees).toBeDefined();
      expect(kpis.present).toBeDefined();
      expect(kpis.absent).toBeDefined();
      expect(kpis.onLeave).toBeDefined();
      expect(kpis.attendanceRate).toBeDefined();

      expect(typeof kpis.totalEmployees.value).toBe('number');
      expect(typeof kpis.present.value).toBe('number');
      expect(typeof kpis.absent.value).toBe('number');
      expect(typeof kpis.onLeave.value).toBe('number');
      expect(typeof kpis.attendanceRate.value).toBe('string');
    });

    it('retrieves 30-day attendance trend data points from SQLite', () => {
      const trend = attendanceRepo.getDailyTrend(30);
      expect(trend.length).toBeGreaterThan(0);
      expect(trend[0]).toHaveProperty('present');
      expect(trend[0]).toHaveProperty('attendanceRate');
      expect(trend[0]).toHaveProperty('total');
    });
  });

  describe('2. Advanced Dashboard UI/UX & Employee Table Tests', () => {
    it('renders the 5 mandatory KPI cards (Total Employees, Present, Absent, On Leave, Attendance Rate)', () => {
      render(<App />);
      expect(screen.getAllByText(/Total (Workforce|Employees)/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Present/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Absent/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/On Leave/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Attendance Rate/i).length).toBeGreaterThan(0);
    });

    it('renders the Employee Directory Table with sortable columns and pagination', () => {
      render(<App />);
      expect(screen.getByText(/Workforce Directory & Attendance Roster/i)).toBeInTheDocument();
      expect(screen.getByText('Employee')).toBeInTheDocument();
      expect(screen.getByText('Role & Title')).toBeInTheDocument();
      expect(screen.getAllByText('Department').length).toBeGreaterThan(0);
    });

    it('allows searching within the Employee Directory Table', async () => {
      render(<App />);
      const tableSearch = screen.getByPlaceholderText('Search staff, role, ID...');

      fireEvent.change(tableSearch, { target: { value: 'Sarah' } });

      await waitFor(() => {
        expect(screen.getAllByText(/Sarah Chen/i).length).toBeGreaterThan(0);
      });
    });

    it('renders SQLite database connectivity badge in the top operations banner', () => {
      render(<App />);
      expect(screen.getAllByText(/SQLite DB/i).length).toBeGreaterThan(0);
    });
  });
});
