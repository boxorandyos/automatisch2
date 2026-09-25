import Base from '@/models/base.js';
import Agent from '@/models/agent.js';
import Flow from '@/models/flow.js';
import Connection from '@/models/connection.js';

class AgentTool extends Base {
  static tableName = 'agent_tools';

  static jsonSchema = {
    type: 'object',

    properties: {
      id: { type: 'string', format: 'uuid' },
      agentId: { type: ['string', 'null'], format: 'uuid' },
      type: { type: 'string', default: 'app' },
      flowId: { type: ['string', 'null'], format: 'uuid' },
      connectionId: { type: ['string', 'null'], format: 'uuid' },
      appKey: { type: ['string', 'null'] },
      actions: {
        type: 'array',
        items: {},
        default: [],
      },
      deletedAt: { type: ['string', 'null'] },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };

  static relationMappings = () => ({
    agent: {
      relation: Base.BelongsToOneRelation,
      modelClass: Agent,
      join: {
        from: 'agent_tools.agent_id',
        to: 'agents.id',
      },
    },
    flow: {
      relation: Base.BelongsToOneRelation,
      modelClass: Flow,
      join: {
        from: 'agent_tools.flow_id',
        to: 'flows.id',
      },
    },
    connection: {
      relation: Base.BelongsToOneRelation,
      modelClass: Connection,
      join: {
        from: 'agent_tools.connection_id',
        to: 'connections.id',
      },
    },
  });
}

export default AgentTool;
