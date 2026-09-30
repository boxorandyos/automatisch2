import { Router } from 'express';
import { authenticateUser } from '@/helpers/authentication.js';
import { authorizeUser } from '@/helpers/authorization.js';
import getAgentsAction from '@/controllers/internal/api/v1/agents/get-agents.js';
import getAgentAction from '@/controllers/internal/api/v1/agents/get-agent.js';
import createAgentAction from '@/controllers/internal/api/v1/agents/create-agent.js';
import updateAgentAction from '@/controllers/internal/api/v1/agents/update-agent.js';
import deleteAgentAction from '@/controllers/internal/api/v1/agents/delete-agent.js';
import getAgentToolsAction from '@/controllers/internal/api/v1/agents/get-agent-tools.js';
import createAgentToolAction from '@/controllers/internal/api/v1/agents/create-agent-tool.js';
import deleteAgentToolAction from '@/controllers/internal/api/v1/agents/delete-agent-tool.js';
import getAgentExecutionsAction from '@/controllers/internal/api/v1/agents/get-agent-executions.js';
import getAgentExecutionAction from '@/controllers/internal/api/v1/agents/get-agent-execution.js';
import testAgentAction from '@/controllers/internal/api/v1/agents/test-agent.js';

const router = Router();

router.get('/', authenticateUser, authorizeUser, getAgentsAction);
router.post('/', authenticateUser, authorizeUser, createAgentAction);
router.get('/:agentId', authenticateUser, authorizeUser, getAgentAction);
router.patch('/:agentId', authenticateUser, authorizeUser, updateAgentAction);
router.delete('/:agentId', authenticateUser, authorizeUser, deleteAgentAction);
router.get(
  '/:agentId/tools',
  authenticateUser,
  authorizeUser,
  getAgentToolsAction
);
router.post(
  '/:agentId/tools',
  authenticateUser,
  authorizeUser,
  createAgentToolAction
);
router.delete(
  '/:agentId/tools/:agentToolId',
  authenticateUser,
  authorizeUser,
  deleteAgentToolAction
);
router.get(
  '/:agentId/executions',
  authenticateUser,
  authorizeUser,
  getAgentExecutionsAction
);
router.get(
  '/:agentId/executions/:agentExecutionId',
  authenticateUser,
  authorizeUser,
  getAgentExecutionAction
);
router.post('/:agentId/test', authenticateUser, authorizeUser, testAgentAction);

export default router;
