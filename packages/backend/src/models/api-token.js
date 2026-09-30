import crypto from 'node:crypto';

import Base from '@/models/base.js';

class ApiToken extends Base {
  static tableName = 'api_tokens';

  static jsonSchema = {
    type: 'object',
    required: ['token'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      token: { type: 'string', minLength: 1 },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };

  static generateToken() {
    return crypto.randomBytes(48).toString('hex');
  }

  static async create() {
    return await this.query().insertAndFetch({
      token: this.generateToken(),
    });
  }
}

export default ApiToken;
