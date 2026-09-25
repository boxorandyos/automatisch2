import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  const agent = await request.currentUser.$relatedQuery('agents').insertAndFetch({
    name: request.body.name,
    description: request.body.description,
    instructions: request.body.instructions,
  });

  renderObject(response, agent, { status: 201 });
};
