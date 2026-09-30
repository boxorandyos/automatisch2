import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  const computedLicense = {
    id: null,
    name: null,
    expireAt: null,
    verified: false,
  };

  renderObject(response, computedLicense);
};
