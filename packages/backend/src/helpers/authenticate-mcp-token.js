import McpServer from '@/models/mcp-server.js';

export const authenticateMcpToken = async (request, response, next) => {
  const authorizationHeader = request.headers.authorization || '';
  const [scheme, token] = authorizationHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return response.status(401).json({ error: 'Unauthorized' });
  }

  const mcpServer = await McpServer.query().findOne({ token });

  if (!mcpServer) {
    return response.status(401).json({ error: 'Unauthorized' });
  }

  request.mcpServer = mcpServer;
  next();
};

export default authenticateMcpToken;
