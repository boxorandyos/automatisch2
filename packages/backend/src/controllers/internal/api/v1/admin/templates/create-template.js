import { renderObject } from '@/helpers/renderer.js';
import Template from '@/models/template.js';

export default async function createTemplate(request, response) {
  const { name, flowId } = request.body;

  const template = await Template.createFromFlow(request.currentUser, {
    name,
    flowId,
  });

  renderObject(response, template, {
    status: 201,
    serializer: 'AdminTemplate',
  });
}
