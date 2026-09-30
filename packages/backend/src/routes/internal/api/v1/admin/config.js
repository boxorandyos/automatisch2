import { Router } from 'express';

import { authenticateUser } from '@/helpers/authentication.js';
import { authorizeAdmin } from '@/helpers/authorization.js';
import updateConfigAction from '@/controllers/internal/api/v1/admin/config/update-config.js';

const router = Router();

router.patch('/', authenticateUser, authorizeAdmin, updateConfigAction);

export default router;
