import { Router } from 'express';

import { authenticateUser } from '@/helpers/authentication.js';
import { authorizeAdmin } from '@/helpers/authorization.js';
import getPermissionsCatalogAction from '@/controllers/internal/api/v1/admin/permissions/get-permissions-catalog.js';

const router = Router();

router.get('/', authenticateUser, authorizeAdmin, getPermissionsCatalogAction);

export default router;
