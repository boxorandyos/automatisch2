import { Router } from 'express';
import authenticateMcpToken from '@/helpers/authenticate-mcp-token.js';
import handleMcpRequestAction from '@/controllers/api/v1/mcp/handle-mcp-request.js';
import deleteMcpSessionAction from '@/controllers/api/v1/mcp/delete-mcp-session.js';

const router = Router();

router.post('/', authenticateMcpToken, handleMcpRequestAction);
router.get('/', authenticateMcpToken, handleMcpRequestAction);
router.delete('/', authenticateMcpToken, deleteMcpSessionAction);

export default router;
