import Base from '@/models/base.js';
import User from '@/models/user.js';
import AgentTool from '@/models/agent-tool.js';
import AgentExecution from '@/models/agent-execution.js';

class Agent extends Base {
  static tableName = 'agents';

  static jsonSchema = {
    type: 'object',

    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: ['string', 'null'] },
      description: { type: ['string', 'null'] },
      instructions: { type: ['string', 'null'] },
      userId: { type: ['string', 'null'], format: 'uuid' },
      deletedAt: { type: ['string', 'null'] },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };

  static relationMappings = () => ({
    user: {
      relation: Base.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'agents.user_id',
        to: 'users.id',
      },
    },
    agentTools: {
      relation: Base.HasManyRelation,
      modelClass: AgentTool,
      join: {
        from: 'agents.id',
        to: 'agent_tools.agent_id',
      },
    },
    agentExecutions: {
      relation: Base.HasManyRelation,
      modelClass: AgentExecution,
      join: {
        from: 'agents.id',
        to: 'agent_executions.agent_id',
      },
    },
  });

  /**
   * Replace any existing app tool for the same appKey, then insert the new tool.
   * Flow-type tools are reserved for a future agent runtime path.
   */
  async createOrUpdateTool({
    connectionId,
    appKey,
    actions,
    type = 'app',
    flowId,
  }) {
    if (type === 'flow' && flowId) {
      return;
    }

    if (type === 'app' && appKey) {
      await this.$relatedQuery('agentTools').where('app_key', appKey).delete();

      return await this.$relatedQuery('agentTools').insertAndFetch({
        type,
        connectionId,
        appKey,
        actions,
        flowId,
      });
    }
  }
}

export default Agent;
