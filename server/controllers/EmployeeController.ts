import { Request, Response } from 'express';
import { EmployeeService } from '../services/EmployeeService.ts';
import { DepartmentRepository } from '../repositories/DepartmentRepository.ts';
import type { FilterParams, PaginationParams } from '../types/index.ts';

export class EmployeeController {
  private employeeService: EmployeeService;
  private departmentRepo: DepartmentRepository;

  constructor(employeeService?: EmployeeService, departmentRepo?: DepartmentRepository) {
    this.employeeService = employeeService || new EmployeeService();
    this.departmentRepo = departmentRepo || new DepartmentRepository();
  }

  public getEmployees = (req: Request, res: Response) => {
    try {
      const filters: FilterParams = {
        department: (req.query.department as string) || 'All',
        location: (req.query.location as string) || 'All',
        status: (req.query.status as string) || 'All',
        searchQuery: (req.query.searchQuery as string) || (req.query.q as string) || '',
      };

      const pagination: PaginationParams = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
        sortBy: (req.query.sortBy as string) || 'name',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc',
      };

      const result = this.employeeService.getEmployees(filters, pagination);
      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error: any) {
      console.error('Error in getEmployees:', error);
      res.status(500).json({ success: false, error: error.message || 'Internal server error' });
    }
  };

  public getEmployeeById = (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const employee = this.employeeService.getEmployeeById(id);
      if (!employee) {
        return res.status(404).json({ success: false, error: `Employee ${id} not found` });
      }
      res.json({ success: true, data: employee });
    } catch (error: any) {
      console.error('Error in getEmployeeById:', error);
      res.status(500).json({ success: false, error: error.message || 'Internal server error' });
    }
  };

  public createEmployee = (req: Request, res: Response) => {
    try {
      const employeeData = req.body;
      if (!employeeData.name || !employeeData.email || !employeeData.department) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed: name, email, and department are required',
        });
      }

      if (!employeeData.id) {
        employeeData.id = `EMP-${Date.now().toString().slice(-4)}`;
      }

      const created = this.employeeService.createEmployee(employeeData);
      res.status(201).json({ success: true, data: created });
    } catch (error: any) {
      console.error('Error in createEmployee:', error);
      res.status(500).json({ success: false, error: error.message || 'Internal server error' });
    }
  };

  public updateStatus = (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status, clockInTime } = req.body;

      if (!status) {
        return res.status(400).json({ success: false, error: 'Status is required' });
      }

      const updated = this.employeeService.updateStatus(id, status, clockInTime);
      if (!updated) {
        return res.status(404).json({ success: false, error: `Employee ${id} not found or no changes made` });
      }

      res.json({ success: true, message: `Status updated to ${status} for ${id}` });
    } catch (error: any) {
      console.error('Error in updateStatus:', error);
      res.status(500).json({ success: false, error: error.message || 'Internal server error' });
    }
  };

  public getDepartments = (_req: Request, res: Response) => {
    try {
      const departments = this.departmentRepo.getAll();
      res.json({ success: true, data: departments });
    } catch (error: any) {
      console.error('Error in getDepartments:', error);
      res.status(500).json({ success: false, error: error.message || 'Internal server error' });
    }
  };
}
