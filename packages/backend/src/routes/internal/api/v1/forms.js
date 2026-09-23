import { Router } from 'express';
import { authenticateUser } from '@/helpers/authentication.js';
import getFormsAction from '@/controllers/internal/api/v1/forms/get-forms.js';
import getFormAction from '@/controllers/internal/api/v1/forms/get-form.js';
import createFormAction from '@/controllers/internal/api/v1/forms/create-form.js';
import updateFormAction from '@/controllers/internal/api/v1/forms/update-form.js';
import deleteFormAction from '@/controllers/internal/api/v1/forms/delete-form.js';

const router = Router();

router.get('/', authenticateUser, getFormsAction);
router.get('/:formId', authenticateUser, getFormAction);
router.post('/', authenticateUser, createFormAction);
router.patch('/:formId', authenticateUser, updateFormAction);
router.delete('/:formId', authenticateUser, deleteFormAction);

export default router;
