import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  const forms = await request.currentUser
    .$relatedQuery('forms')
    .orderBy('updated_at', 'desc');

  renderObject(response, forms);
};
