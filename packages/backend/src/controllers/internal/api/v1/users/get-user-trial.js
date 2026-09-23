import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  renderObject(response, {
    inTrial: await request.currentUser.inTrial(),
    expireAt: request.currentUser.trialExpiryDate,
  });
};
