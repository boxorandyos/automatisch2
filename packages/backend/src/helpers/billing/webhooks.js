import Subscription from '@/models/subscription.js';
import User from '@/models/user.js';

const subscriptionPayload = (payload) => ({
  paddleSubscriptionId: String(payload.subscription_id),
  paddlePlanId: String(payload.subscription_plan_id),
  status: payload.status,
  updateUrl: payload.update_url,
  cancelUrl: payload.cancel_url,
  nextBillAmount: String(payload.next_bill_amount ?? payload.unit_price ?? '0'),
  nextBillDate: payload.next_bill_date,
  lastBillDate: payload.last_bill_date || null,
  cancellationEffectiveDate: payload.cancellation_effective_date || null,
});

const resolveUserId = async (payload) => {
  if (payload.passthrough) {
    try {
      const passthrough = JSON.parse(payload.passthrough);
      if (passthrough.userId) {
        return passthrough.userId;
      }
    } catch {
      // passthrough may be a plain user id string
      return payload.passthrough;
    }
  }

  if (payload.user_id) {
    const user = await User.query().findById(payload.user_id);
    if (user) return user.id;
  }

  if (payload.email) {
    const user = await User.query().findOne({
      email: payload.email.toLowerCase(),
    });
    if (user) return user.id;
  }

  return null;
};

const upsertSubscription = async (payload) => {
  const userId = await resolveUserId(payload);
  const existingSubscription = await Subscription.query().findOne({
    paddleSubscriptionId: String(payload.subscription_id),
  });

  if (existingSubscription) {
    return await existingSubscription
      .$query()
      .patchAndFetch(subscriptionPayload(payload));
  }

  if (!userId) {
    throw new Error('Unable to resolve user for Paddle subscription webhook.');
  }

  const subscription = await Subscription.query().insertAndFetch({
    userId,
    ...subscriptionPayload(payload),
  });

  const user = await User.query().findById(userId);
  if (user) {
    await user.createUsageData(subscription.id);
  }

  return subscription;
};

const cancelSubscription = async (payload) => {
  const subscription = await Subscription.query()
    .findOne({
      paddleSubscriptionId: String(payload.subscription_id),
    })
    .throwIfNotFound();

  return await subscription.$query().patchAndFetch({
    status: payload.status || 'deleted',
    cancellationEffectiveDate: payload.cancellation_effective_date || null,
  });
};

export default async function handlePaddleWebhook(payload) {
  switch (payload.alert_name) {
    case 'subscription_created':
    case 'subscription_updated':
    case 'subscription_payment_succeeded':
      return await upsertSubscription(payload);
    case 'subscription_cancelled':
    case 'subscription_deleted':
      return await cancelSubscription(payload);
    default:
      return null;
  }
}
