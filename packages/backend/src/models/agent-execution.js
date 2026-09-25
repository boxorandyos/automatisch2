import Base from '@/models/base.js';
import Agent from '@/models/agent.js';

class AgentExecution extends Base {
  static tableName = 'agent_executions';

  static jsonSchema = {
    type: 'object',

    properties: {
      id: { type: 'string', format: 'uuid' },
      agentId: { type: ['string', 'null'], format: 'uuid' },
      prompt: { type: ['string', 'null'] },
      output: { type: ['string', 'null'] },
      status: { type: ['string', 'null'] },
      finishedAt: { type: ['string', 'null'] },
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
        from: 'agent_executions.agent_id',
        to: 'agents.id',
      },
    },
  });
}

export default AgentExecution;
