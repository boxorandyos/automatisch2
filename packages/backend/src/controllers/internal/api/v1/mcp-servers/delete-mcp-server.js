export default async (request, response) => {
  const mcpServer = await request.currentUser
    .$relatedQuery('mcpServers')
    .findById(request.params.mcpServerId)
    .throwIfNotFound();

  const mcpTools = await mcpServer.$relatedQuery('mcpTools');

  for (const mcpTool of mcpTools) {
    await mcpTool.$relatedQuery('mcpToolExecutions').delete();
  }

  await mcpServer.$relatedQuery('mcpSessions').delete();
  await mcpServer.$relatedQuery('mcpTools').delete();
  await mcpServer.$query().delete();

  response.status(204).end();
};
