import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';

import app from '../../../../../../app.js';
import { createRole } from '@/factories/role.js';
import { createUser } from '@/factories/user.js';
import createAuthTokenByUserId from '@/helpers/create-auth-token-by-user-id.js';
import getUsersMock from '@/mocks/rest/internal/api/v1/admin/users/get-users.js';

describe('GET /internal/api/v1/admin/users', () => {
  let adminToken;
  let adminUser;
  let adminRole;
  let memberUser;
  let memberRole;

  beforeEach(async () => {
    adminRole = await createRole({ name: 'Admin' });
    adminUser = await createUser({
      roleId: adminRole.id,
      fullName: 'Admin Person',
    });

    memberRole = await createRole({ name: 'Member role' });
    memberUser = await createUser({
      roleId: memberRole.id,
      fullName: 'Member Person',
    });

    adminToken = await createAuthTokenByUserId(adminUser.id);
  });

  it('lists users ordered for the admin users table', async () => {
    const response = await request(app)
      .get('/internal/api/v1/admin/users')
      .set('Authorization', adminToken)
      .expect(200);

    const expectedBody = await getUsersMock(
      [adminUser, memberUser],
      [adminRole, memberRole]
    );

    expect(response.body).toStrictEqual(expectedBody);
  });
});
