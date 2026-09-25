import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  const agent = await request.currentUser
    .$relatedQuery('agents')
    .findById(request.params.agentId)
    .throwIfNotFound();

  const agentExecution = await agent
    .$relatedQuery('agentExecutions')
    .findById(request.params.agentExecutionId)
    .throwIfNotFound();

  renderObject(response, agentExecution);
};
