import Crypto from 'node:crypto';
import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';

import app from '../../../../../../app.js';
import { createRole } from '@/factories/role.js';
import { createUser } from '@/factories/user.js';
import createAuthTokenByUserId from '@/helpers/create-auth-token-by-user-id.js';
import updateUserMock from '@/mocks/rest/internal/api/v1/admin/users/update-user.js';

describe('PATCH /internal/api/v1/admin/users/:userId', () => {
  let adminToken;

  beforeEach(async () => {
    const adminRole = await createRole({ name: 'Admin' });
    const adminUser = await createUser({ roleId: adminRole.id });
    adminToken = await createAuthTokenByUserId(adminUser.id);
  });

  it('updates another user and returns the refreshed record', async () => {
    const existingUser = await createUser();
    const replacementRole = await createRole();

    const patch = {
      email: 'new-address@example.com',
      fullName: 'Renamed User',
      roleId: replacementRole.id,
    };

    const response = await request(app)
      .patch(`/internal/api/v1/admin/users/${existingUser.id}`)
      .set('Authorization', adminToken)
      .send(patch)
      .expect(200);

    const refreshedUser = await existingUser.$query();

    expect(response.body).toMatchObject(
      updateUserMock(
        {
          ...refreshedUser,
          ...patch,
        },
        replacementRole
      )
    );
  });

  it('rejects invalid field types with model validation errors', async () => {
    const existingUser = await createUser();

    const response = await request(app)
      .patch(`/internal/api/v1/admin/users/${existingUser.id}`)
      .set('Authorization', adminToken)
      .send({
        email: null,
        fullName: null,
        roleId: null,
      })
      .expect(422);

    expect(response.body.meta.type).toBe('ModelValidation');
    expect(response.body.errors).toMatchObject({
      email: ['must be string'],
      fullName: ['must be string'],
      roleId: ['must be string'],
    });
  });

  it('responds 404 when patching a missing user', async () => {
    await request(app)
      .patch(`/internal/api/v1/admin/users/${Crypto.randomUUID()}`)
      .set('Authorization', adminToken)
      .expect(404);
  });

  it('responds 400 for a malformed user id', async () => {
    await request(app)
      .patch('/internal/api/v1/admin/users/bad-id')
      .set('Authorization', adminToken)
      .expect(400);
  });
});
