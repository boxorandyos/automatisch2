import { Router } from 'express';

import { authenticateUser } from '@/helpers/authentication.js';
import checkIsCloud from '@/helpers/check-is-cloud.js';
import getPlansAction from '@/controllers/internal/api/v1/payment/get-plans.js';
import getPaddleInfoAction from '@/controllers/internal/api/v1/payment/get-paddle-info.js';

const router = Router();

router.get('/plans', authenticateUser, checkIsCloud, getPlansAction);
router.get('/paddle-info', authenticateUser, checkIsCloud, getPaddleInfoAction);

export default router;
