import { renderObject } from '@/helpers/renderer.js';
import AppConfig from '@/models/app-config.js';

export default async (request, response) => {
  const appConfig = await AppConfig.query().insertAndFetch({
    key: request.params.appKey,
    ...appConfigParams(request),
  });

  renderObject(response, appConfig, { status: 201 });
};

const appConfigParams = (request) => {
  const { useOnlyPredefinedAuthClients, disabled } = request.body;

  return {
    useOnlyPredefinedAuthClients,
    disabled,
  };
};
