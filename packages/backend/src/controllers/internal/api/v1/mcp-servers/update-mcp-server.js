import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  let mcpServer = await request.currentUser
    .$relatedQuery('mcpServers')
    .findById(request.params.mcpServerId)
    .throwIfNotFound();

  mcpServer = await mcpServer.$query().patchAndFetch({
    name: request.body.name,
  });

  renderObject(response, mcpServer);
};
