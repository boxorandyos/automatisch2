import Base from '@/models/base.js';
import SamlAuthProvider from '@/models/saml-auth-provider.js';
import Role from '@/models/role.js';

class RoleMapping extends Base {
  static tableName = 'role_mappings';

  static jsonSchema = {
    type: 'object',
    required: ['remoteRoleName'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      samlAuthProviderId: { type: ['string', 'null'], format: 'uuid' },
      roleId: { type: ['string', 'null'], format: 'uuid' },
      remoteRoleName: { type: 'string', minLength: 1 },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };

  static relationMappings = () => ({
    samlAuthProvider: {
      relation: Base.BelongsToOneRelation,
      modelClass: SamlAuthProvider,
      join: {
        from: 'role_mappings.saml_auth_provider_id',
        to: 'saml_auth_providers.id',
      },
    },
    role: {
      relation: Base.BelongsToOneRelation,
      modelClass: Role,
      join: {
        from: 'role_mappings.role_id',
        to: 'roles.id',
      },
    },
  });
}

export default RoleMapping;
