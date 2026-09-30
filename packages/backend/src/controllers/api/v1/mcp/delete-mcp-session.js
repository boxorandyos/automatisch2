import McpSession from '@/models/mcp-session.js';
import transports from '@/helpers/mcp-transports.js';

export default async (request, response) => {
  const sessionId = request.headers['mcp-session-id'];

  if (!sessionId) {
    return response.status(400).json({ error: 'Missing mcp-session-id header' });
  }

  const mcpSession = await McpSession.query()
    .findById(sessionId)
    .where({ mcpServerId: request.mcpServer.id })
    .throwIfNotFound();

  const active = transports.get(sessionId);

  if (active?.transport) {
    await active.transport.close?.();
    transports.delete(sessionId);
  }

  await mcpSession.$query().delete();

  response.status(204).end();
};
