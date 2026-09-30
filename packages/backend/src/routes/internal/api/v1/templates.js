import { Router } from 'express';

import { authenticateUser } from '@/helpers/authentication.js';
import { authorizeUser } from '@/helpers/authorization.js';
import { checkTemplatesEnabled } from '@/helpers/check-templates-enabled.js';
import getTemplatesAction from '@/controllers/internal/api/v1/templates/get-templates.js';
import getTemplateAction from '@/controllers/internal/api/v1/templates/get-template.js';

const router = Router();

router.get(
  '/',
  authenticateUser,
  authorizeUser,
  checkTemplatesEnabled,
  getTemplatesAction
);
router.get(
  '/:templateId',
  authenticateUser,
  authorizeUser,
  checkTemplatesEnabled,
  getTemplateAction
);

export default router;
