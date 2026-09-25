import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  const agent = await request.currentUser
    .$relatedQuery('agents')
    .findById(request.params.agentId)
    .throwIfNotFound();

  const agentTools = await agent
    .$relatedQuery('agentTools')
    .orderBy('created_at', 'desc');

  renderObject(response, agentTools);
};
