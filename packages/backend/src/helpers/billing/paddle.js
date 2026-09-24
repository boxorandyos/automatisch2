import { DateTime } from 'luxon';

import appConfig from '@/config/app.js';
import { createInstance } from '@/helpers/axios-with-proxy.js';

const VENDOR_BASE_URL = appConfig.isDev
  ? 'https://sandbox-vendors.paddle.com'
  : 'https://vendors.paddle.com';

const vendorClient = createInstance({
  baseURL: VENDOR_BASE_URL,
});

async function postVendor(path, body) {
  const { data } = await vendorClient.post(path, {
    vendor_id: appConfig.paddleVendorId,
    vendor_auth_code: appConfig.paddleVendorAuthCode,
    ...body,
  });

  return data?.response ?? [];
}

async function getSubscription(subscriptionId) {
  const subscriptions = await postVendor('/api/2.0/subscription/users', {
    subscription_id: subscriptionId,
  });

  return subscriptions[0] || null;
}

async function getInvoices(subscriptionId) {
  return postVendor('/api/2.0/subscription/payments', {
    subscription_id: subscriptionId,
    is_paid: 1,
    from: DateTime.now().minus({ years: 3 }).toISODate(),
    to: DateTime.now().plus({ days: 3 }).toISODate(),
  });
}

const paddleClient = {
  getSubscription,
  getInvoices,
};

export default paddleClient;
