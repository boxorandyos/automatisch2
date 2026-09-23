import { Router } from 'express';

import { authenticateUser } from '@/helpers/authentication.js';
import { authorizeAdmin } from '@/helpers/authorization.js';
import getRolesAction from '@/controllers/internal/api/v1/admin/roles/get-roles.js';
import getRoleAction from '@/controllers/internal/api/v1/admin/roles/get-role.js';
import createRoleAction from '@/controllers/internal/api/v1/admin/roles/create-role.js';
import updateRoleAction from '@/controllers/internal/api/v1/admin/roles/update-role.js';
import deleteRoleAction from '@/controllers/internal/api/v1/admin/roles/delete-role.js';

const router = Router();

router.get('/', authenticateUser, authorizeAdmin, getRolesAction);
router.post('/', authenticateUser, authorizeAdmin, createRoleAction);
router.get('/:roleId', authenticateUser, authorizeAdmin, getRoleAction);
router.patch('/:roleId', authenticateUser, authorizeAdmin, updateRoleAction);
router.delete('/:roleId', authenticateUser, authorizeAdmin, deleteRoleAction);

export default router;
