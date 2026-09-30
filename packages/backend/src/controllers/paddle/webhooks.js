import appConfig from '@/config/app.js';
import handlePaddleWebhook from '@/helpers/billing/webhooks.js';

export default async (request, response) => {
  // Paddle Classic webhooks are cloud-only. Self-hosted AGPL installs ignore them.
  if (!appConfig.isCloud) {
    response.status(204).end();
    return;
  }

  await handlePaddleWebhook(request.body);

  response.status(200).end();
};
