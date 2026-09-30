export const freePlan = {
  productId: 'free',
  name: 'Free',
  limit: '1,000',
  price: null,
  quota: 1000,
};

export const paidPlans = [
  {
    productId: '47384',
    name: '10k - monthly',
    limit: '10,000',
    price: '€20',
    quota: 10000,
  },
  {
    productId: '47385',
    name: '50k - monthly',
    limit: '50,000',
    price: '€50',
    quota: 50000,
  },
  {
    productId: '47386',
    name: '100k - monthly',
    limit: '100,000',
    price: '€90',
    quota: 100000,
  },
];

const plans = [...paidPlans];

export const getPlanById = (productId) => {
  if (!productId || productId === freePlan.productId) {
    return freePlan;
  }

  return plans.find((plan) => plan.productId === productId) || freePlan;
};

export default plans;
