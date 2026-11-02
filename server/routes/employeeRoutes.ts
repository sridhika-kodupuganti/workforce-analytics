import { Router } from 'express';
import { EmployeeController } from '../controllers/EmployeeController.ts';

const router = Router();
const controller = new EmployeeController();

router.get('/employees', controller.getEmployees);
router.get('/employees/:id', controller.getEmployeeById);
router.post('/employees', controller.createEmployee);
router.patch('/employees/:id/status', controller.updateStatus);
router.get('/departments', controller.getDepartments);

export default router;
