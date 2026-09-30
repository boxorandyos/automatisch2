import Base from '@/models/base.js';
import User from '@/models/user.js';
import Subscription from '@/models/subscription.js';

class UsageData extends Base {
  static tableName = 'usage_data';

  static jsonSchema = {
    type: 'object',
    required: ['consumedTaskCount'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      userId: { type: ['string', 'null'], format: 'uuid' },
      subscriptionId: { type: ['string', 'null'], format: 'uuid' },
      consumedTaskCount: { type: 'integer' },
      nextResetAt: { type: ['string', 'null'] },
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
        from: 'usage_data.user_id',
        to: 'users.id',
      },
    },
    subscription: {
      relation: Base.BelongsToOneRelation,
      modelClass: Subscription,
      join: {
        from: 'usage_data.subscription_id',
        to: 'subscriptions.id',
      },
    },
  });
}

export default UsageData;
