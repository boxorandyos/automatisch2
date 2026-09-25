import { renderObject } from '@/helpers/renderer.js';
import McpServer from '@/models/mcp-server.js';

export default async (request, response) => {
  const mcpServer = await request.currentUser
    .$relatedQuery('mcpServers')
    .insertAndFetch({
      name: request.body.name,
      token: McpServer.generateToken(),
    });

  renderObject(response, mcpServer, { status: 201 });
};
