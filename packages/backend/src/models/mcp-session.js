import Base from '@/models/base.js';
import McpServer from '@/models/mcp-server.js';

class McpSession extends Base {
  static tableName = 'mcp_sessions';

  static jsonSchema = {
    type: 'object',
    required: ['mcpServerId'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      mcpServerId: { type: 'string', format: 'uuid' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };

  static relationMappings = () => ({
    mcpServer: {
      relation: Base.BelongsToOneRelation,
      modelClass: McpServer,
      join: {
        from: 'mcp_sessions.mcp_server_id',
        to: 'mcp_servers.id',
      },
    },
  });
}

export default McpSession;
