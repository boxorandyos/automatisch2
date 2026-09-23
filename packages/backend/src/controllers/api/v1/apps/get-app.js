import App from '@/models/app.js';
import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  const app = await App.findOneByKey(request.params.appKey);

  if (!app) {
    return response.status(404).end();
  }

  renderObject(response, app, { serializer: 'App' });
};
