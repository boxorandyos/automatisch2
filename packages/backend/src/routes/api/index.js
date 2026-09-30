import { Router } from 'express';

import authenticateApiToken from '@/helpers/authenticate-api-token.js';
import apiV1Router from '@/routes/api/v1/index.js';
import mcpRouter from '@/routes/api/v1/mcp.js';

const router = Router();

// MCP uses MCP server Bearer tokens (not API tokens).
router.use('/v1/mcp', mcpRouter);

router.use(authenticateApiToken);
router.use('/v1', apiV1Router);

export default router;
