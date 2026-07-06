import { Router } from 'express';
import { AiController } from './controller/ai.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router = Router();
const controller = new AiController();

router.use(authMiddleware as any);

router.post('/chat', controller.chat);
router.get('/conversations', controller.getConversations);
router.get('/conversations/:id', controller.getConversationById);
router.delete('/conversations/:id', controller.deleteConversation);

export default router;
