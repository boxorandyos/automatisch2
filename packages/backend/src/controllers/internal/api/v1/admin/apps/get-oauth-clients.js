import { renderObject } from '@/helpers/renderer.js';
import AppConfig from '@/models/app-config.js';

export default async (request, response) => {
  const appConfig = await AppConfig.query()
    .findById(request.params.appKey)
    .throwIfNotFound();

  const oauthClients = await appConfig
    .$relatedQuery('oauthClients')
    .orderBy('created_at', 'desc');

  renderObject(response, oauthClients);
};
