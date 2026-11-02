import { Router } from 'express';
import { AnalyticsController } from '../controllers/AnalyticsController.ts';

const router = Router();
const controller = new AnalyticsController();

router.get('/kpis', controller.getKpis);
router.get('/trend', controller.getTrend);
router.get('/departments', controller.getDepartmentMetrics);
router.get('/distribution', controller.getDistribution);
router.get('/activities', controller.getActivities);

export default router;
