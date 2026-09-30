import { renderObject } from '@/helpers/renderer.js';
import paginateRest from '@/helpers/pagination.js';

export default async (request, response) => {
  const agent = await request.currentUser
    .$relatedQuery('agents')
    .findById(request.params.agentId)
    .throwIfNotFound();

  const agentExecutionsQuery = agent
    .$relatedQuery('agentExecutions')
    .orderBy('created_at', 'desc');

  const agentExecutions = await paginateRest(
    agentExecutionsQuery,
    request.query.page
  );

  renderObject(response, agentExecutions);
};
