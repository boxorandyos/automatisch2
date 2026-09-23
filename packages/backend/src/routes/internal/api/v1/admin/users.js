import { Router } from 'express';
import { authenticateUser } from '@/helpers/authentication.js';
import { authorizeAdmin } from '@/helpers/authorization.js';
import getUsersAction from '@/controllers/internal/api/v1/admin/users/get-users.js';
import createUserAction from '@/controllers/internal/api/v1/admin/users/create-user.js';
import getUserAction from '@/controllers/internal/api/v1/admin/users/get-user.js';
import updateUserAction from '@/controllers/internal/api/v1/admin/users/update-user.js';
import deleteUserAction from '@/controllers/internal/api/v1/admin/users/delete-user.js';

const router = Router();

router.get('/', authenticateUser, authorizeAdmin, getUsersAction);
router.post('/', authenticateUser, authorizeAdmin, createUserAction);
router.get('/:userId', authenticateUser, authorizeAdmin, getUserAction);
router.patch('/:userId', authenticateUser, authorizeAdmin, updateUserAction);
router.delete('/:userId', authenticateUser, authorizeAdmin, deleteUserAction);

export default router;
