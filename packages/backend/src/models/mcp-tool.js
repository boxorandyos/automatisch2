import Base from '@/models/base.js';
import McpServer from '@/models/mcp-server.js';
import Flow from '@/models/flow.js';
import Connection from '@/models/connection.js';
import McpToolExecution from '@/models/mcp-tool-execution.js';

class McpTool extends Base {
  static tableName = 'mcp_tools';

  static jsonSchema = {
    type: 'object',

    properties: {
      id: { type: 'string', format: 'uuid' },
      mcpServerId: { type: ['string', 'null'], format: 'uuid' },
      type: { type: 'string', default: 'app' },
      flowId: { type: ['string', 'null'], format: 'uuid' },
      connectionId: { type: ['string', 'null'], format: 'uuid' },
      appKey: { type: ['string', 'null'] },
      action: { type: ['string', 'null'] },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };

  static relationMappings = () => ({
    mcpServer: {
      relation: Base.BelongsToOneRelation,
      modelClass: McpServer,
      join: {
        from: 'mcp_tools.mcp_server_id',
        to: 'mcp_servers.id',
      },
    },
    flow: {
      relation: Base.BelongsToOneRelation,
      modelClass: Flow,
      join: {
        from: 'mcp_tools.flow_id',
        to: 'flows.id',
      },
    },
    connection: {
      relation: Base.BelongsToOneRelation,
      modelClass: Connection,
      join: {
        from: 'mcp_tools.connection_id',
        to: 'connections.id',
      },
    },
    mcpToolExecutions: {
      relation: Base.HasManyRelation,
      modelClass: McpToolExecution,
      join: {
        from: 'mcp_tools.id',
        to: 'mcp_tool_executions.mcp_tool_id',
      },
    },
  });
}

export default McpTool;
