import { Router } from 'express';

import { authenticateUser } from '@/helpers/authentication.js';
import { authorizeAdmin } from '@/helpers/authorization.js';
import getTemplatesAction from '@/controllers/internal/api/v1/admin/templates/get-templates.js';
import getTemplateAction from '@/controllers/internal/api/v1/admin/templates/get-template.js';
import createTemplateAction from '@/controllers/internal/api/v1/admin/templates/create-template.js';
import updateTemplateAction from '@/controllers/internal/api/v1/admin/templates/update-template.js';
import deleteTemplateAction from '@/controllers/internal/api/v1/admin/templates/delete-template.js';

const router = Router();

router.get('/', authenticateUser, authorizeAdmin, getTemplatesAction);
router.post('/', authenticateUser, authorizeAdmin, createTemplateAction);
router.get(
  '/:templateId',
  authenticateUser,
  authorizeAdmin,
  getTemplateAction
);
router.patch(
  '/:templateId',
  authenticateUser,
  authorizeAdmin,
  updateTemplateAction
);
router.delete(
  '/:templateId',
  authenticateUser,
  authorizeAdmin,
  deleteTemplateAction
);

export default router;
