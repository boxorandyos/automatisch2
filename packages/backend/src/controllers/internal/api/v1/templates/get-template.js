import { renderObject } from '@/helpers/renderer.js';
import Template from '@/models/template.js';

export default async function getTemplate(request, response) {
  const template = await Template.query()
    .findById(request.params.templateId)
    .throwIfNotFound();

  renderObject(response, template, { serializer: 'Template' });
}
