import crypto from 'node:crypto';
import { McpServer as SdkMcpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import Engine from '@/engine/index.js';
import McpToolExecution from '@/models/mcp-tool-execution.js';
import McpSession from '@/models/mcp-session.js';
import transports from '@/helpers/mcp-transports.js';

const toolNameFor = (mcpTool) => {
  if (mcpTool.type === 'flow') {
    return mcpTool.action || `flow_${mcpTool.flowId}`;
  }

  return mcpTool.action || `${mcpTool.appKey}_tool`;
};

const createSdkServer = async (mcpServer) => {
  const sdkServer = new SdkMcpServer({
    name: mcpServer.name || 'automatisch-mcp',
    version: '1.0.0',
  });

  const mcpTools = await mcpServer.$relatedQuery('mcpTools');

  for (const mcpTool of mcpTools) {
    const name = toolNameFor(mcpTool);

    sdkServer.tool(
      name,
      mcpTool.type === 'flow'
        ? `Run Automatisch flow tool ${name}`
        : `Run Automatisch app action ${name}`,
      async (args = {}) => {
        const execution = await McpToolExecution.query().insertAndFetch({
          mcpToolId: mcpTool.id,
          status: 'running',
          dataIn: JSON.stringify(args),
        });

        try {
          let result;

          if (mcpTool.type === 'flow' && mcpTool.flowId) {
            result = await Engine.run({
              flowId: mcpTool.flowId,
              triggeredByRequest: true,
              initialData: [
                {
                  raw: args,
                  meta: { internalId: crypto.randomUUID() },
                },
              ],
            });
          } else {
            result = {
              statusCode: 501,
              body: 'App MCP tools are not executed via HTTP transport yet.',
            };
          }

          const dataOut =
            result?.body ?? result?.output ?? JSON.stringify(result ?? {});

          await execution.$query().patchAndFetch({
            status: 'success',
            dataOut:
              typeof dataOut === 'string' ? dataOut : JSON.stringify(dataOut),
          });

          return {
            content: [
              {
                type: 'text',
                text:
                  typeof dataOut === 'string'
                    ? dataOut
                    : JSON.stringify(dataOut),
              },
            ],
          };
        } catch (error) {
          await execution.$query().patchAndFetch({
            status: 'error',
            errorDetails: { message: error.message },
          });

          return {
            content: [{ type: 'text', text: error.message }],
            isError: true,
          };
        }
      }
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
