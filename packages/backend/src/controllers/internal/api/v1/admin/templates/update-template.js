import { renderObject } from '@/helpers/renderer.js';
import Template from '@/models/template.js';

export default async function updateTemplate(request, response) {
  const template = await Template.query()
    .patchAndFetchById(request.params.templateId, {
      name: request.body.name,
    })
    .throwIfNotFound();

  renderObject(response, template, { serializer: 'AdminTemplate' });
}
