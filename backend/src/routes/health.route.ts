import { Router } from 'express';
import { env } from '../config/env.js';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: env.NODE_ENV,
  });
});

export default router;
