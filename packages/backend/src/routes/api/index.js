import { Router } from 'express';

import mcpRouter from '@/routes/api/v1/mcp.js';

const router = Router();

// MCP uses MCP server Bearer tokens (not API tokens).
router.use('/v1/mcp', mcpRouter);

export default router;
