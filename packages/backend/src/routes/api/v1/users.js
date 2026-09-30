import { Router } from 'express';

import deleteUserAction from '@/controllers/api/v1/users/delete-user.js';
import getUserAction from '@/controllers/api/v1/users/get-user.js';
import getUsersAction from '@/controllers/api/v1/users/get-users.js';

const router = Router();

router.get('/', getUsersAction);
router.get('/:userId', getUserAction);
router.delete('/:userId', deleteUserAction);

export default router;
