import { Request, Response } from 'express';
import { AnalyticsService } from '../services/AnalyticsService.ts';
import type { FilterParams } from '../types/index.ts';

export class AnalyticsController {
  private analyticsService: AnalyticsService;

  constructor(analyticsService?: AnalyticsService) {
    this.analyticsService = analyticsService || new AnalyticsService();
  }

  private extractFilters(req: Request): FilterParams {
    return {
      department: (req.query.department as string) || 'All',
      location: (req.query.location as string) || 'All',
      status: (req.query.status as string) || 'All',
      dateRange: (req.query.dateRange as string) || '30d',
      searchQuery: (req.query.searchQuery as string) || (req.query.q as string) || '',
    };
  }

  public getKpis = (req: Request, res: Response) => {
    try {
      const filters = this.extractFilters(req);
      const kpis = this.analyticsService.getKpis(filters);
      res.json({ success: true, data: kpis });
    } catch (error: any) {
      console.error('Error in getKpis:', error);
      res.status(500).json({ success: false, error: error.message || 'Internal server error' });
    }
  };

  public getTrend = (req: Request, res: Response) => {
    try {
      const filters = this.extractFilters(req);
      const range = (req.query.range as string) || filters.dateRange || '30d';
      const days = range === '7d' ? 7 : range === '14d' ? 14 : range === '90d' ? 90 : 30;
      const trend = this.analyticsService.getAttendanceTrend(days, filters);
      res.json({ success: true, data: trend });
    } catch (error: any) {
      console.error('Error in getTrend:', error);
      res.status(500).json({ success: false, error: error.message || 'Internal server error' });
    }
  };

  public getDepartmentMetrics = (req: Request, res: Response) => {
    try {
      const filters = this.extractFilters(req);
      const metrics = this.analyticsService.getDepartmentMetrics(filters);
      res.json({ success: true, data: metrics });
    } catch (error: any) {
      console.error('Error in getDepartmentMetrics:', error);
      res.status(500).json({ success: false, error: error.message || 'Internal server error' });
    }
  };

  public getDistribution = (req: Request, res: Response) => {
    try {
      const filters = this.extractFilters(req);
      const dimension = (req.query.dimension as any) || 'work_model';
      const distribution = this.analyticsService.getWorkforceDistribution(dimension, filters);
      res.json({ success: true, data: distribution });
    } catch (error: any) {
      console.error('Error in getDistribution:', error);
      res.status(500).json({ success: false, error: error.message || 'Internal server error' });
    }
  };

  public getActivities = (req: Request, res: Response) => {
    try {
      const filters = this.extractFilters(req);
      const limit = Number(req.query.limit) || 10;
      const offset = Number(req.query.offset) || 0;
      const result = this.analyticsService.getActivities(limit, offset, filters);
      res.json({
        success: true,
        data: result.activities,
        pagination: {
          total: result.total,
          limit,
          offset,
        },
      });
    } catch (error: any) {
      console.error('Error in getActivities:', error);
      res.status(500).json({ success: false, error: error.message || 'Internal server error' });
    }
  };
}
