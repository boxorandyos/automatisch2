import crypto from 'node:crypto';
import { McpServer as SdkMcpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

import McpSession from '@/models/mcp-session.js';
import transports from '@/helpers/mcp-transports.js';
import {
  describeMcpTools,
  executeDescribedMcpTool,
} from '@/helpers/mcp.js';

const createSdkServer = async (mcpServer) => {
  const sdkServer = new SdkMcpServer({
    name: mcpServer.name || 'automatisch-mcp',
    version: '1.0.0',
  });

  const describedTools = await describeMcpTools(mcpServer);

  for (const describedTool of describedTools) {
    sdkServer.tool(
      describedTool.name,
      describedTool.description,
      describedTool.zodSchema.shape || {},
      async (args = {}) => executeDescribedMcpTool(describedTool, args),
    );
  }

  return sdkServer;
};

export default async (request, response) => {
  const mcpServer = request.mcpServer;
  const sessionIdHeader = request.headers['mcp-session-id'];

  try {
    if (sessionIdHeader && transports.has(sessionIdHeader)) {
      const { transport } = transports.get(sessionIdHeader);
      await transport.handleRequest(request, response, request.body);
      return;
    }

    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => crypto.randomUUID(),
      enableJsonResponse: true,
      onsessioninitialized: async (sessionId) => {
        await McpSession.query().insert({
          id: sessionId,
          mcpServerId: mcpServer.id,
        });
      },
    });

    const sdkServer = await createSdkServer(mcpServer);
    await sdkServer.connect(transport);

    transport.onclose = async () => {
      const sessionId = transport.sessionId;
      if (sessionId) {
        transports.delete(sessionId);
        await McpSession.query().findById(sessionId).delete();
      }
    };

    await transport.handleRequest(request, response, request.body);

    if (transport.sessionId) {
      transports.set(transport.sessionId, { transport, sdkServer });
    }
  } catch (error) {
    if (!response.headersSent) {
      response.status(500).json({
        jsonrpc: '2.0',
        error: { code: -32603, message: error.message },
        id: null,
      });
    }
  }
};
