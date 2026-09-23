import { renderObject } from '@/helpers/renderer.js';
import billing from '@/helpers/billing/index.js';

export default async (request, response) => {
  renderObject(response, billing.plans);
};
