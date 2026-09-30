import Base from '@/models/base.js';
import User from '@/models/user.js';
import UsageData from '@/models/usage-data.js';

class Subscription extends Base {
  static tableName = 'subscriptions';

  static jsonSchema = {
    type: 'object',
    required: [
      'paddleSubscriptionId',
      'paddlePlanId',
      'updateUrl',
      'cancelUrl',
      'status',
      'nextBillAmount',
      'nextBillDate',
    ],

    properties: {
      id: { type: 'string', format: 'uuid' },
      userId: { type: ['string', 'null'], format: 'uuid' },
      paddleSubscriptionId: { type: 'string', minLength: 1 },
      paddlePlanId: { type: 'string', minLength: 1 },
      updateUrl: { type: 'string', minLength: 1 },
      cancelUrl: { type: 'string', minLength: 1 },
      status: { type: 'string', minLength: 1 },
      nextBillAmount: { type: 'string', minLength: 1 },
      nextBillDate: { type: 'string' },
      lastBillDate: { type: ['string', 'null'] },
      cancellationEffectiveDate: { type: ['string', 'null'] },
      deletedAt: { type: ['string', 'null'] },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };

  static get virtualAttributes() {
    return ['isValid'];
  }

  get isValid() {
    const validStatuses = ['active', 'past_due', 'trialing'];

    return validStatuses.includes(this.status);
  }

  static relationMappings = () => ({
    user: {
      relation: Base.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'subscriptions.user_id',
        to: 'users.id',
      },
    },
    usageData: {
      relation: Base.HasManyRelation,
      modelClass: UsageData,
      join: {
        from: 'subscriptions.id',
        to: 'usage_data.subscription_id',
      },
    },
  });
}

export default Subscription;
