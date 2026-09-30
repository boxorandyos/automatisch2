import { Router } from 'express';

import { authenticateUser } from '@/helpers/authentication.js';
import { authorizeAdmin } from '@/helpers/authorization.js';
import getApiTokensAction from '@/controllers/internal/api/v1/admin/api-tokens/get-api-tokens.js';
import createApiTokenAction from '@/controllers/internal/api/v1/admin/api-tokens/create-api-token.js';
import deleteApiTokenAction from '@/controllers/internal/api/v1/admin/api-tokens/delete-api-token.js';

const router = Router();

router.get('/', authenticateUser, authorizeAdmin, getApiTokensAction);
router.post('/', authenticateUser, authorizeAdmin, createApiTokenAction);
router.delete(
  '/:apiTokenId',
  authenticateUser,
  authorizeAdmin,
  deleteApiTokenAction
);

export default router;
