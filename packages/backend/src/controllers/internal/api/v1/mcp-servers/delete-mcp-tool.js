export default async (request, response) => {
  const mcpServer = await request.currentUser
    .$relatedQuery('mcpServers')
    .findById(request.params.mcpServerId)
    .throwIfNotFound();

  const mcpTool = await mcpServer
    .$relatedQuery('mcpTools')
    .findById(request.params.mcpToolId)
    .throwIfNotFound();

  await mcpTool.$relatedQuery('mcpToolExecutions').delete();
  await mcpTool.$query().delete();

  response.status(204).end();
};
