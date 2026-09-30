import { Router } from 'express';

import { authenticateUser } from '@/helpers/authentication.js';
import { authorizeAdmin } from '@/helpers/authorization.js';
import createUserAction from '@/controllers/internal/api/v1/admin/users/create-user.js';
import deleteUserAction from '@/controllers/internal/api/v1/admin/users/delete-user.js';
import getUserAction from '@/controllers/internal/api/v1/admin/users/get-user.js';
import getUsersAction from '@/controllers/internal/api/v1/admin/users/get-users.js';
import updateUserAction from '@/controllers/internal/api/v1/admin/users/update-user.js';

const adminUsersRouter = Router();

adminUsersRouter.get('/', authenticateUser, authorizeAdmin, getUsersAction);
adminUsersRouter.post('/', authenticateUser, authorizeAdmin, createUserAction);
adminUsersRouter.get(
  '/:userId',
  authenticateUser,
  authorizeAdmin,
  getUserAction
);
adminUsersRouter.patch(
  '/:userId',
  authenticateUser,
  authorizeAdmin,
  updateUserAction
);
adminUsersRouter.delete(
  '/:userId',
  authenticateUser,
  authorizeAdmin,
  deleteUserAction
);

export default adminUsersRouter;
