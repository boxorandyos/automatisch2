import { renderObject } from '@/helpers/renderer.js';
import OAuthClient from '@/models/oauth-client.js';

export default async (request, response) => {
  const oauthClient = await OAuthClient.query()
    .findOne({
      id: request.params.oauthClientId,
      appKey: request.params.appKey,
    })
    .throwIfNotFound();

  const updatedOAuthClient = await oauthClient
    .$query()
    .patchAndFetch(oauthClientParams(request));

  renderObject(response, updatedOAuthClient, {
    serializer: 'AdminOAuthClient',
  });
};

const oauthClientParams = (request) => {
  const { name, active, formattedAuthDefaults } = request.body;

  return {
    name,
    active,
    formattedAuthDefaults,
  };
};
