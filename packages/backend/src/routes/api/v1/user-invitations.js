import { Router } from 'express';

import createUserInvitationAction from '@/controllers/api/v1/user-invitations/create-user-invitation.js';
import deleteUserInvitationAction from '@/controllers/api/v1/user-invitations/delete-user-invitation.js';
import getUserInvitationsAction from '@/controllers/api/v1/user-invitations/get-user-invitations.js';

const router = Router();

router.get('/', getUserInvitationsAction);
router.post('/', createUserInvitationAction);
router.delete('/:userId', deleteUserInvitationAction);

export default router;
