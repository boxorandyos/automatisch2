import appConfig from '@/config/app.js';
import { renderObject } from '@/helpers/renderer.js';
import Config from '@/models/config.js';

export default async (request, response) => {
  const installationCompleted = await Config.isInstallationCompleted();

  const info = {
    docsUrl: appConfig.docsUrl,
    installationCompleted,
    isCloud: appConfig.isCloud,
    isEnterprise: false,
    isMation: appConfig.isMation,
  };

  renderObject(response, info);
};
