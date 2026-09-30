import Crypto from 'node:crypto';
import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';

import app from '../../../../../../app.js';
import { createRole } from '@/factories/role.js';
import { createUser } from '@/factories/user.js';
import createAuthTokenByUserId from '@/helpers/create-auth-token-by-user-id.js';
import getUserMock from '@/mocks/rest/internal/api/v1/admin/users/get-user.js';

describe('GET /internal/api/v1/admin/users/:userId', () => {
  let adminToken;
  let targetUser;
  let targetRole;

  beforeEach(async () => {
    const adminRole = await createRole({ name: 'Admin' });
    const adminUser = await createUser({ roleId: adminRole.id });
    adminToken = await createAuthTokenByUserId(adminUser.id);

    targetUser = await createUser();
    targetRole = await targetUser.$relatedQuery('role');
  });

  it('returns the requested user payload', async () => {
    const response = await request(app)
      .get(`/internal/api/v1/admin/users/${targetUser.id}`)
      .set('Authorization', adminToken)
      .expect(200);

    expect(response.body).toStrictEqual(getUserMock(targetUser, targetRole));
  });

  it('responds 404 when the user id does not exist', async () => {
    await request(app)
      .get(`/internal/api/v1/admin/users/${Crypto.randomUUID()}`)
      .set('Authorization', adminToken)
      .expect(404);
  });

  it('responds 400 for a malformed user id', async () => {
    await request(app)
      .get('/internal/api/v1/admin/users/not-a-uuid')
      .set('Authorization', adminToken)
      .expect(400);
  });
});
