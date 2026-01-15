import { Request, Response } from 'express';
import nestgptService from '../services/nestgptService';

class NestGptController {
  async chat(req: Request, res: Response) {
    try {
      const { sessionId, message } = req.body;
      const result = await nestgptService.handleMessage(sessionId, message);
      res.json({ success: true, ...result });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }
}

export default new NestGptController();
