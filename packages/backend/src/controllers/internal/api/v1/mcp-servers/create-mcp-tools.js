import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  const mcpServer = await request.currentUser
    .$relatedQuery('mcpServers')
    .findById(request.params.mcpServerId)
    .throwIfNotFound();

  const mcpTool = await mcpServer.$relatedQuery('mcpTools').insertAndFetch({
    type: request.body.type || 'app',
    flowId: request.body.flowId,
    connectionId: request.body.connectionId,
    appKey: request.body.appKey,
    action: request.body.action,
  });

  renderObject(response, mcpTool, { status: 201 });
};
