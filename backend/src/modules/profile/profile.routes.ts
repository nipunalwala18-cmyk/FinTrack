import { Router } from 'express';
import { ProfileController } from './controller/profile.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router = Router();
const controller = new ProfileController();

router.use(authMiddleware as any);

router.get('/', controller.getProfile);
router.put('/', controller.updateProfile);
router.get('/preferences', controller.getPreferences);
router.put('/preferences', controller.updatePreferences);
router.post('/avatar', controller.uploadAvatar);
router.get('/activity', controller.getActivityLogs);
router.get('/report-settings', controller.getReportSettings);
router.put('/report-settings', controller.updateReportSettings);

export default router;
