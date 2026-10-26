import { describe, it, expect } from 'vitest';
import {
  INITIAL_EMPLOYEES,
  MOCK_ACTIVITIES,
  filterEmployees,
  filterActivities,
} from '../data/mockData.ts';
import type { DashboardFilters } from '../types/workforce.ts';

describe('mockData filter utilities', () => {
  const baseFilters: DashboardFilters = {
    dateRange: '30d',
    department: 'All',
    location: 'All',
    status: 'All',
    searchQuery: '',
  };

  it('returns all employees when no filter is applied', () => {
    const result = filterEmployees(INITIAL_EMPLOYEES, baseFilters);
    expect(result.length).toBe(INITIAL_EMPLOYEES.length);
  });

  it('filters employees correctly by Department', () => {
    const result = filterEmployees(INITIAL_EMPLOYEES, {
      ...baseFilters,
      department: 'Engineering',
    });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((emp) => emp.department === 'Engineering')).toBe(true);
  });

  it('filters employees correctly by Location', () => {
    const result = filterEmployees(INITIAL_EMPLOYEES, {
      ...baseFilters,
      location: 'San Francisco',
    });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((emp) => emp.location === 'San Francisco')).toBe(true);
  });

  it('filters employees correctly by Attendance Status', () => {
    const result = filterEmployees(INITIAL_EMPLOYEES, {
      ...baseFilters,
      status: 'On Leave',
    });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((emp) => emp.status === 'On Leave')).toBe(true);
  });

  it('searches employees by name or role case-insensitively', () => {
    const result = filterEmployees(INITIAL_EMPLOYEES, {
      ...baseFilters,
      searchQuery: 'chen',
    });
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].name).toContain('Chen');
  });

  it('filters activities by search query', () => {
    const result = filterActivities(MOCK_ACTIVITIES, {
      ...baseFilters,
      searchQuery: 'Clock-in',
    });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((act) => act.activityType.toLowerCase().includes('clock-in') || act.details.toLowerCase().includes('clock-in'))).toBe(true);
  });
});
