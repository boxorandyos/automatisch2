import appConfig from '@/config/app.js';
import Base from '@/models/base.js';
import Role from '@/models/role.js';
import RoleMapping from '@/models/role-mapping.js';
import Identity from '@/models/identity.js';

class SamlAuthProvider extends Base {
  static tableName = 'saml_auth_providers';

  static jsonSchema = {
    type: 'object',
    required: [
      'name',
      'certificate',
      'signatureAlgorithm',
      'issuer',
      'entryPoint',
      'firstnameAttributeName',
      'surnameAttributeName',
      'emailAttributeName',
      'roleAttributeName',
    ],

    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string', minLength: 1 },
      certificate: { type: 'string', minLength: 1 },
      signatureAlgorithm: {
        type: 'string',
        enum: ['sha1', 'sha256', 'sha512'],
      },
      issuer: { type: 'string', minLength: 1 },
      entryPoint: { type: 'string', minLength: 1 },
      firstnameAttributeName: { type: 'string', minLength: 1 },
      surnameAttributeName: { type: 'string', minLength: 1 },
      emailAttributeName: { type: 'string', minLength: 1 },
      roleAttributeName: { type: 'string', minLength: 1 },
      defaultRoleId: { type: ['string', 'null'], format: 'uuid' },
      active: { type: 'boolean' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };

  static get virtualAttributes() {
    return ['loginUrl'];
  }

  get loginUrl() {
    return `${appConfig.webAppUrl}/login/saml/${this.id}`;
  }

  static relationMappings = () => ({
    defaultRole: {
      relation: Base.BelongsToOneRelation,
      modelClass: Role,
      join: {
        from: 'saml_auth_providers.default_role_id',
        to: 'roles.id',
      },
    },
    roleMappings: {
      relation: Base.HasManyRelation,
      modelClass: RoleMapping,
      join: {
        from: 'saml_auth_providers.id',
        to: 'role_mappings.saml_auth_provider_id',
      },
    },
    identities: {
      relation: Base.HasManyRelation,
      modelClass: Identity,
      join: {
        from: 'saml_auth_providers.id',
        to: 'identities.provider_id',
      },
    },
  });

  get config() {
    return {
      callbackUrl: `${appConfig.baseUrl}/login/saml/${this.id}/callback`,
      cert: this.certificate,
      entryPoint: this.entryPoint,
      issuer: this.issuer,
      signatureAlgorithm: this.signatureAlgorithm,
      wantAssertionsSigned: true,
    };
  }
}

export default SamlAuthProvider;
