import { Router } from 'express';

import appsRouter from '@/routes/api/v1/apps.js';
import executionsRouter from '@/routes/api/v1/executions.js';
import flowsRouter from '@/routes/api/v1/flows.js';
import foldersRouter from '@/routes/api/v1/folders.js';
import templatesRouter from '@/routes/api/v1/templates.js';
import userInvitationsRouter from '@/routes/api/v1/user-invitations.js';
import usersRouter from '@/routes/api/v1/users.js';

const router = Router();

router.use('/apps', appsRouter);
router.use('/executions', executionsRouter);
router.use('/flows', flowsRouter);
router.use('/templates', templatesRouter);
router.use('/user-invitations', userInvitationsRouter);
router.use('/users/:userId/folders', foldersRouter);
router.use('/users', usersRouter);

export default router;
