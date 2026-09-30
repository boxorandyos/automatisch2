import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  const agent = await request.currentUser
    .$relatedQuery('agents')
    .findById(request.params.agentId)
    .throwIfNotFound();

  const agentTool = await agent.createOrUpdateTool({
    type: request.body.type || 'app',
    flowId: request.body.flowId,
    connectionId: request.body.connectionId,
    appKey: request.body.appKey,
    actions: request.body.actions || [],
  });

  if (!agentTool) {
    response.status(204).end();
    return;
  }

  renderObject(response, agentTool, { status: 201 });
};
