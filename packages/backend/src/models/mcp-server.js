import crypto from 'node:crypto';

import Base from '@/models/base.js';
import User from '@/models/user.js';
import McpTool from '@/models/mcp-tool.js';
import McpSession from '@/models/mcp-session.js';
import McpToolExecution from '@/models/mcp-tool-execution.js';
import appConfig from '@/config/app.js';

class McpServer extends Base {
  static tableName = 'mcp_servers';

  static jsonSchema = {
    type: 'object',
    required: ['name', 'token'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      userId: { type: ['string', 'null'], format: 'uuid' },
      name: { type: 'string', minLength: 1 },
      token: { type: 'string', minLength: 1 },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };

  static get virtualAttributes() {
    return ['serverUrl'];
  }

  get serverUrl() {
    return `${appConfig.baseUrl}/api/v1/mcp`;
  }

  static relationMappings = () => ({
    user: {
      relation: Base.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'mcp_servers.user_id',
        to: 'users.id',
      },
    },
    mcpTools: {
      relation: Base.HasManyRelation,
      modelClass: McpTool,
      join: {
        from: 'mcp_servers.id',
        to: 'mcp_tools.mcp_server_id',
      },
    },
    mcpSessions: {
      relation: Base.HasManyRelation,
      modelClass: McpSession,
      join: {
        from: 'mcp_servers.id',
        to: 'mcp_sessions.mcp_server_id',
      },
    },
    mcpToolExecutions: {
      relation: Base.ManyToManyRelation,
      modelClass: McpToolExecution,
      join: {
        from: 'mcp_servers.id',
        through: {
          from: 'mcp_tools.mcp_server_id',
          to: 'mcp_tools.id',
        },
        to: 'mcp_tool_executions.mcp_tool_id',
      },
    },
  });

  static generateToken() {
    return crypto.randomBytes(48).toString('hex');
  }

  async rotateToken() {
    return await this.$query().patchAndFetch({
      token: McpServer.generateToken(),
    });
  }
}

export default McpServer;
