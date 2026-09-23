import { Router } from 'express';

import getAppAction from '@/controllers/api/v1/apps/get-app.js';
import getAppsAction from '@/controllers/api/v1/apps/get-apps.js';

const router = Router();

router.get('/', getAppsAction);
router.get('/:appKey', getAppAction);

export default router;
