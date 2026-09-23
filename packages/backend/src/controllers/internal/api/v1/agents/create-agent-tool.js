import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  const agent = await request.currentUser
    .$relatedQuery('agents')
    .findById(request.params.agentId)
    .throwIfNotFound();

  const agentTool = await agent.$relatedQuery('agentTools').insertAndFetch({
    type: request.body.type || 'app',
    flowId: request.body.flowId,
    connectionId: request.body.connectionId,
    appKey: request.body.appKey,
    actions: request.body.actions || [],
  });

  renderObject(response, agentTool, { status: 201 });
};
