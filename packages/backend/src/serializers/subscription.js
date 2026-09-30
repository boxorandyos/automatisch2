const subscriptionSerializer = (subscription) => {
  return {
    id: subscription.id,
    status: subscription.status,
    paddleSubscriptionId: subscription.paddleSubscriptionId,
    paddlePlanId: subscription.paddlePlanId,
    updateUrl: subscription.updateUrl,
    cancelUrl: subscription.cancelUrl,
    nextBillAmount: subscription.nextBillAmount,
    nextBillDate: subscription.nextBillDate,
    lastBillDate: subscription.lastBillDate,
    cancellationEffectiveDate: subscription.cancellationEffectiveDate,
    isValid: subscription.isValid,
    createdAt: subscription.createdAt.getTime(),
    updatedAt: subscription.updatedAt.getTime(),
  };
};

export default subscriptionSerializer;
