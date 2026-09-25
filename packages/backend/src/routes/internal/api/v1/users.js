import { Router } from 'express';
import { authenticateUser } from '@/helpers/authentication.js';
import { authorizeUser } from '@/helpers/authorization.js';
import checkIsCloud from '@/helpers/check-is-cloud.js';
import getCurrentUserAction from '@/controllers/internal/api/v1/users/get-current-user.js';
import updateCurrentUserAction from '@/controllers/internal/api/v1/users/update-current-user.js';
import updateCurrentUserPasswordAction from '@/controllers/internal/api/v1/users/update-current-user-password.js';
import deleteCurrentUserAction from '@/controllers/internal/api/v1/users/delete-current-user.js';
import getAppsAction from '@/controllers/internal/api/v1/users/get-apps.js';
import getInvoicesAction from '@/controllers/internal/api/v1/users/get-invoices.js';
import getPlanAndUsageAction from '@/controllers/internal/api/v1/users/get-plan-and-usage.js';
import getSubscriptionAction from '@/controllers/internal/api/v1/users/get-subscription.js';
import getUserTrialAction from '@/controllers/internal/api/v1/users/get-user-trial.js';
import acceptInvitationAction from '@/controllers/internal/api/v1/users/accept-invitation.js';
import forgotPasswordAction from '@/controllers/internal/api/v1/users/forgot-password.js';
import resetPasswordAction from '@/controllers/internal/api/v1/users/reset-password.js';
import registerUserAction from '@/controllers/internal/api/v1/users/register-user.js';

const router = Router();

router.get('/me', authenticateUser, getCurrentUserAction);
router.patch('/:userId', authenticateUser, updateCurrentUserAction);

router.patch(
  '/:userId/password',
  authenticateUser,
  updateCurrentUserPasswordAction
);

router.get('/:userId/apps', authenticateUser, authorizeUser, getAppsAction);
router.get(
  '/:userId/invoices',
  authenticateUser,
  checkIsCloud,
  getInvoicesAction
);
router.get(
  '/:userId/plan-and-usage',
  authenticateUser,
  checkIsCloud,
  getPlanAndUsageAction
);
router.get(
  '/:userId/subscription',
  authenticateUser,
  checkIsCloud,
  getSubscriptionAction
);
router.get('/:userId/trial', authenticateUser, checkIsCloud, getUserTrialAction);
router.delete('/:userId', authenticateUser, deleteCurrentUserAction);

router.post('/invitation', acceptInvitationAction);
router.post('/forgot-password', forgotPasswordAction);
router.post('/reset-password', resetPasswordAction);
router.post('/register', registerUserAction);

export default router;
