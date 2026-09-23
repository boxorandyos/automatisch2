import { Router } from 'express';
import { authenticateUser } from '@/helpers/authentication.js';
import { authorizeUser } from '@/helpers/authorization.js';
import getCurrentUserAction from '@/controllers/internal/api/v1/users/get-current-user.js';
import updateCurrentUserAction from '@/controllers/internal/api/v1/users/update-current-user.js';
import updateCurrentUserPasswordAction from '@/controllers/internal/api/v1/users/update-current-user-password.js';
import deleteCurrentUserAction from '@/controllers/internal/api/v1/users/delete-current-user.js';
import getAppsAction from '@/controllers/internal/api/v1/users/get-apps.js';
import acceptInvitationAction from '@/controllers/internal/api/v1/users/accept-invitation.js';
import forgotPasswordAction from '@/controllers/internal/api/v1/users/forgot-password.js';
import resetPasswordAction from '@/controllers/internal/api/v1/users/reset-password.js';

const router = Router();

router.get('/me', authenticateUser, getCurrentUserAction);
router.patch('/:userId', authenticateUser, updateCurrentUserAction);

router.patch(
  '/:userId/password',
  authenticateUser,
  updateCurrentUserPasswordAction
);

router.get('/:userId/apps', authenticateUser, authorizeUser, getAppsAction);
router.delete('/:userId', authenticateUser, deleteCurrentUserAction);

router.post('/invitation', acceptInvitationAction);
router.post('/forgot-password', forgotPasswordAction);
router.post('/reset-password', resetPasswordAction);

export default router;
