import { Router } from 'express';
import { ReportsController } from './controller/reports.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router = Router();
const controller = new ReportsController();

router.use(authMiddleware as any);

router.get('/', controller.getReports);
router.get('/:id', controller.getReportById);
router.post('/generate', controller.generateReport);
router.post('/download', controller.downloadReport);
router.post('/email', controller.emailReport);
router.delete('/:id', controller.deleteReport);

export default router;
