import { renderObject } from '@/helpers/renderer.js';
import Template from '@/models/template.js';

export default async function createTemplate(request, response) {
  const { name, flowId } = request.body;

  let template;

  if (typeof Template.createFromFlow === 'function') {
    template = await Template.createFromFlow(request.currentUser, {
      name,
      flowId,
    });
  } else {
    const flow = await request.currentUser
      .$relatedQuery('flows')
      .findById(flowId)
      .throwIfNotFound();

    const flowData = await flow.export();

    template = await Template.query().insertAndFetch({
      name: name || flow.name,
      flowData,
    });
  }

  renderObject(response, template, {
    status: 201,
    serializer: 'AdminTemplate',
  });
}
