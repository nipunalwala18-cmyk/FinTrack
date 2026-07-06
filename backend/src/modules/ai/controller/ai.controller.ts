import { Request, Response, NextFunction } from 'express';
import { AiService } from '../service/ai.service.js';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware.js';

const aiService = new AiService();

export class AiController {
  public async chat(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { conversationId, message } = req.body;
      if (!message || typeof message !== 'string') {
        res.status(400).json({ success: false, message: 'Message string is required' });
        return;
      }

      const result = await aiService.chat(userId, conversationId || null, message);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  public async getConversations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const list = await aiService.getConversations(userId);
      res.status(200).json({ success: true, data: list });
    } catch (error) {
      next(error);
    }
  }

  public async getConversationById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      const conversation = await aiService.getConversationById(id, userId);
      res.status(200).json({ success: true, data: conversation });
    } catch (error) {
      next(error);
    }
  }

  public async deleteConversation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      const result = await aiService.deleteConversation(id, userId);
      res.status(200).json({ success: true, data: result, message: 'Conversation deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
export default AiController;
