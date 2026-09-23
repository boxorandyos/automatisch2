import { Router } from 'express';

import webhooksAction from '@/controllers/paddle/webhooks.js';

const router = Router();

router.post('/webhooks', webhooksAction);

export default router;
