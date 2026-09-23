import { renderObject } from '@/helpers/renderer.js';
import runAgent from '@/helpers/agents.js';

export default async (request, response) => {
  const agent = await request.currentUser
    .$relatedQuery('agents')
    .findById(request.params.agentId)
    .throwIfNotFound();

  const result = await runAgent(agent, {
    prompt: request.body.prompt,
    messages: request.body.messages,
  });

  const agentExecution = await agent
    .$relatedQuery('agentExecutions')
    .orderBy('created_at', 'desc')
    .first();

  renderObject(response, agentExecution || result);
};
