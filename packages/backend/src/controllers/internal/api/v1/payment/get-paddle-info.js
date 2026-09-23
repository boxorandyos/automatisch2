import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  renderObject(response, {
    sandbox: process.env.PADDLE_SANDBOX === 'true',
    vendorId: process.env.PADDLE_VENDOR_ID || null,
  });
};
