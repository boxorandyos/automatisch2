import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  const mcpServer = await request.currentUser
    .$relatedQuery('mcpServers')
    .findById(request.params.mcpServerId)
    .throwIfNotFound();

  const updatedMcpServer = await mcpServer.rotateToken();

  renderObject(response, updatedMcpServer);
};
