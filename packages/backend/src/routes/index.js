import { Router } from 'express';
import webhooksRouter from '@/routes/webhooks.js';
import healthcheckRouter from '@/routes/healthcheck.js';
import paddleRouter from '@/routes/paddle.js';
import apiRouter from '@/routes/api/index.js';
import internalApiRouter from '@/routes/internal/api/index.js';

const router = Router();

router.use('/webhooks', webhooksRouter);
router.use('/healthcheck', healthcheckRouter);
router.use('/paddle', paddleRouter);
router.use('/api', apiRouter);
router.use('/internal/api', internalApiRouter);

export default router;
