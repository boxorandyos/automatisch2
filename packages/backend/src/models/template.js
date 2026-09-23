import Base from '@/models/base.js';

class Template extends Base {
  static tableName = 'templates';

  static jsonSchema = {
    type: 'object',

    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: ['string', 'null'] },
      flowData: { type: ['object', 'null'] },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };

  static async createFromFlow(user, { name, flowId }) {
    const flow = await user
      .$relatedQuery('flows')
      .findById(flowId)
      .throwIfNotFound();

    const flowData = await flow.export();

    return await Template.query().insertAndFetch({
      name: name || flow.name,
      flowData,
    });
  }
}

export default Template;
