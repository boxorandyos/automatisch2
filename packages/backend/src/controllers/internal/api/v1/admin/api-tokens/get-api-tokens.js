import { renderObject } from '@/helpers/renderer.js';
import ApiToken from '@/models/api-token.js';

export default async function getApiTokens(_request, response) {
  const apiTokens = await ApiToken.query().orderBy('created_at', 'desc');

  renderObject(response, apiTokens, { serializer: 'AdminApiToken' });
}
