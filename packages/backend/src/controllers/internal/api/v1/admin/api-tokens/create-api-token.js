import { renderObject } from '@/helpers/renderer.js';
import ApiToken from '@/models/api-token.js';

export default async function createApiToken(_request, response) {
  const apiToken = await ApiToken.create();

  renderObject(response, apiToken, {
    status: 201,
    serializer: 'AdminApiTokenFull',
  });
}
