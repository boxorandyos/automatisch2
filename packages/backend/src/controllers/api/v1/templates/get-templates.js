import { renderObject } from '@/helpers/renderer.js';
import Template from '@/models/template.js';

export default async (request, response) => {
  const templates = await Template.query().orderBy('created_at', 'desc');

  renderObject(response, templates);
};
