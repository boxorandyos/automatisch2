import { renderObject } from '@/helpers/renderer.js';
import AppConfig from '@/models/app-config.js';

export default async (request, response) => {
  const appConfig = await AppConfig.query()
    .findById(request.params.appKey)
    .throwIfNotFound();

  const oauthClient = await appConfig.createOAuthClient(
    oauthClientParams(request)
  );

  renderObject(response, oauthClient, {
    status: 201,
    serializer: 'AdminOAuthClient',
  });
};

const oauthClientParams = (request) => {
  const { name, active, formattedAuthDefaults } = request.body;

  return {
    name,
    active,
    formattedAuthDefaults,
    appKey: request.params.appKey,
  };
};
