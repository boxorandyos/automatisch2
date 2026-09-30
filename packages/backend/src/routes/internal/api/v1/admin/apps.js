import { Router } from 'express';

import { authenticateUser } from '@/helpers/authentication.js';
import { authorizeAdmin } from '@/helpers/authorization.js';
import createConfigAction from '@/controllers/internal/api/v1/admin/apps/create-config.js';
import updateConfigAction from '@/controllers/internal/api/v1/admin/apps/update-config.js';
import getOAuthClientsAction from '@/controllers/internal/api/v1/admin/apps/get-oauth-clients.js';
import getOAuthClientAction from '@/controllers/internal/api/v1/admin/apps/get-oauth-client.js';
import createOAuthClientAction from '@/controllers/internal/api/v1/admin/apps/create-oauth-client.js';
import updateOAuthClientAction from '@/controllers/internal/api/v1/admin/apps/update-oauth-client.js';

const router = Router();

router.post(
  '/:appKey/config',
  authenticateUser,
  authorizeAdmin,
  createConfigAction
);
router.patch(
  '/:appKey/config',
  authenticateUser,
  authorizeAdmin,
  updateConfigAction
);
router.get(
  '/:appKey/oauth-clients',
  authenticateUser,
  authorizeAdmin,
  getOAuthClientsAction
);
router.post(
  '/:appKey/oauth-clients',
  authenticateUser,
  authorizeAdmin,
  createOAuthClientAction
);
router.get(
  '/:appKey/oauth-clients/:oauthClientId',
  authenticateUser,
  authorizeAdmin,
  getOAuthClientAction
);
router.patch(
  '/:appKey/oauth-clients/:oauthClientId',
  authenticateUser,
  authorizeAdmin,
  updateOAuthClientAction
);

export default router;
