import { renderObject } from '@/helpers/renderer.js';
import Template from '@/models/template.js';

export default async function getTemplates(_request, response) {
  const templates = await Template.query().orderBy('name', 'asc');

  renderObject(response, templates, { serializer: 'AdminTemplate' });
}
