import { Router } from 'express';
import { authenticateUser } from '@/helpers/authentication.js';
import { authorizeUser } from '@/helpers/authorization.js';
import getFormsAction from '@/controllers/internal/api/v1/forms/get-forms.js';
import getFormAction from '@/controllers/internal/api/v1/forms/get-form.js';
import createFormAction from '@/controllers/internal/api/v1/forms/create-form.js';
import updateFormAction from '@/controllers/internal/api/v1/forms/update-form.js';
import deleteFormAction from '@/controllers/internal/api/v1/forms/delete-form.js';

const router = Router();

router.get('/', authenticateUser, authorizeUser, getFormsAction);
router.get('/:formId', authenticateUser, authorizeUser, getFormAction);
router.post('/', authenticateUser, authorizeUser, createFormAction);
router.patch('/:formId', authenticateUser, authorizeUser, updateFormAction);
router.delete('/:formId', authenticateUser, authorizeUser, deleteFormAction);

export default router;
