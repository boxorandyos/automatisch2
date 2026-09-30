import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  let agent = await request.currentUser
    .$relatedQuery('agents')
    .findById(request.params.agentId)
    .throwIfNotFound();

  agent = await agent.$query().patchAndFetch({
    name: request.body.name,
    description: request.body.description,
    instructions: request.body.instructions,
  });

  renderObject(response, agent);
};
