import { renderObject } from '@/helpers/renderer.js';
import AppConfig from '@/models/app-config.js';

export default async (request, response) => {
  let appConfig = await AppConfig.query().findById(request.params.appKey);

  if (!appConfig) {
    appConfig = await AppConfig.query().insertAndFetch({
      key: request.params.appKey,
      ...appConfigParams(request),
    });

    return renderObject(response, appConfig, { status: 201 });
  }

  appConfig = await appConfig.$query().patchAndFetch(appConfigParams(request));

  renderObject(response, appConfig);
};

const appConfigParams = (request) => {
  const { useOnlyPredefinedAuthClients, disabled } = request.body;

  return {
    useOnlyPredefinedAuthClients,
    disabled,
  };
};
