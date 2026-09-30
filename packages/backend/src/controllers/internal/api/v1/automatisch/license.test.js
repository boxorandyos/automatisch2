import { expect, describe, it } from 'vitest';
import request from 'supertest';
import app from '../../../../../app.js';
import licenseMock from '@/mocks/rest/internal/api/v1/automatisch/license.js';

describe('GET /internal/api/v1/automatisch/license', () => {
  it('should return Automatisch license info', async () => {
    const response = await request(app)
      .get('/internal/api/v1/automatisch/license')
      .expect(200);

    const expectedPayload = licenseMock();

    expect(response.body).toStrictEqual(expectedPayload);
  });
});
