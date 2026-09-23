import handlePaddleWebhook from '@/helpers/billing/webhooks.js';

export default async (request, response) => {
  await handlePaddleWebhook(request.body);

  response.status(200).end();
};
