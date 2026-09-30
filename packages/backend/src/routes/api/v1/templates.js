import { Router } from 'express';

import createTemplateAction from '@/controllers/api/v1/templates/create-template.js';
import deleteTemplateAction from '@/controllers/api/v1/templates/delete-template.js';
import getTemplateAction from '@/controllers/api/v1/templates/get-template.js';
import getTemplatesAction from '@/controllers/api/v1/templates/get-templates.js';

const router = Router();

router.get('/', getTemplatesAction);
router.post('/', createTemplateAction);
router.get('/:templateId', getTemplateAction);
router.delete('/:templateId', deleteTemplateAction);

export default router;
