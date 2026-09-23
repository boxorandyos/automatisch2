import { renderObject } from '@/helpers/renderer.js';
import OAuthClient from '@/models/oauth-client.js';

export default async (request, response) => {
  const oauthClient = await OAuthClient.query()
    .findOne({
      id: request.params.oauthClientId,
      appKey: request.params.appKey,
    })
    .throwIfNotFound();

  renderObject(response, oauthClient, { serializer: 'AdminOAuthClient' });
};
