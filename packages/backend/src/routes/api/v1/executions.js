import { Router } from 'express';

import getExecutionAction from '@/controllers/api/v1/executions/get-execution.js';
import getExecutionsAction from '@/controllers/api/v1/executions/get-executions.js';

const router = Router();

router.get('/', getExecutionsAction);
router.get('/:executionId', getExecutionAction);

export default router;
