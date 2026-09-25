export default async (request, response) => {
  const agent = await request.currentUser
    .$relatedQuery('agents')
    .findById(request.params.agentId)
    .throwIfNotFound();

  const agentTool = await agent
    .$relatedQuery('agentTools')
    .findById(request.params.agentToolId)
    .throwIfNotFound();

  await agentTool.$query().delete();

  response.status(204).end();
};
