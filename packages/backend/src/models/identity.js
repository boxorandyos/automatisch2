import Base from '@/models/base.js';
import User from '@/models/user.js';
import SamlAuthProvider from '@/models/saml-auth-provider.js';

class Identity extends Base {
  static tableName = 'identities';

  static jsonSchema = {
    type: 'object',
    required: ['remoteId', 'providerId', 'providerType'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      userId: { type: ['string', 'null'], format: 'uuid' },
      remoteId: { type: 'string', minLength: 1 },
      providerId: { type: 'string', minLength: 1 },
      providerType: { type: 'string', minLength: 1 },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };

  static relationMappings = () => ({
    user: {
      relation: Base.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'identities.user_id',
        to: 'users.id',
      },
    },
    samlAuthProvider: {
      relation: Base.BelongsToOneRelation,
      modelClass: SamlAuthProvider,
      join: {
        from: 'identities.provider_id',
        to: 'saml_auth_providers.id',
      },
    },
  });
}

export default Identity;
