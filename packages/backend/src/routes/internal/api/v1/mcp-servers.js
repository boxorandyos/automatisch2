import { Router } from 'express';
import { authenticateUser } from '@/helpers/authentication.js';
import { authorizeUser } from '@/helpers/authorization.js';
import getMcpServersAction from '@/controllers/internal/api/v1/mcp-servers/get-mcp-servers.js';
import getMcpServerAction from '@/controllers/internal/api/v1/mcp-servers/get-mcp-server.js';
import createMcpServerAction from '@/controllers/internal/api/v1/mcp-servers/create-mcp-server.js';
import updateMcpServerAction from '@/controllers/internal/api/v1/mcp-servers/update-mcp-server.js';
import deleteMcpServerAction from '@/controllers/internal/api/v1/mcp-servers/delete-mcp-server.js';
import rotateTokenAction from '@/controllers/internal/api/v1/mcp-servers/rotate-token.js';
import getMcpToolsAction from '@/controllers/internal/api/v1/mcp-servers/get-mcp-tools.js';
import createMcpToolsAction from '@/controllers/internal/api/v1/mcp-servers/create-mcp-tools.js';
import deleteMcpToolAction from '@/controllers/internal/api/v1/mcp-servers/delete-mcp-tool.js';
import getMcpToolExecutionsAction from '@/controllers/internal/api/v1/mcp-servers/get-mcp-tool-executions.js';

const router = Router();

router.get('/', authenticateUser, authorizeUser, getMcpServersAction);
router.post('/', authenticateUser, authorizeUser, createMcpServerAction);
router.get('/:mcpServerId', authenticateUser, authorizeUser, getMcpServerAction);
router.patch(
  '/:mcpServerId',
  authenticateUser,
  authorizeUser,
  updateMcpServerAction
);
router.delete(
  '/:mcpServerId',
  authenticateUser,
  authorizeUser,
  deleteMcpServerAction
);
router.post(
  '/:mcpServerId/rotate-token',
  authenticateUser,
  authorizeUser,
  rotateTokenAction
);
router.get(
  '/:mcpServerId/mcp-tools',
  authenticateUser,
  authorizeUser,
  getMcpToolsAction
);
router.post(
  '/:mcpServerId/mcp-tools',
  authenticateUser,
  authorizeUser,
  createMcpToolsAction
);
router.delete(
  '/:mcpServerId/mcp-tools/:mcpToolId',
  authenticateUser,
  authorizeUser,
  deleteMcpToolAction
);
router.get(
  '/:mcpServerId/mcp-tool-executions',
  authenticateUser,
  authorizeUser,
  getMcpToolExecutionsAction
);

export default router;
