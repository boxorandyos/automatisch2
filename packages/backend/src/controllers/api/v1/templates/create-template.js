import { renderObject } from '@/helpers/renderer.js';
import Flow from '@/models/flow.js';
import Template from '@/models/template.js';
import User from '@/models/user.js';

export default async (request, response) => {
  const { name, flowId, userId } = request.body;

  const flow = await Flow.query().findById(flowId).throwIfNotFound();
  const owner = await User.query()
    .findById(userId || flow.userId)
    .throwIfNotFound();

  const template = await Template.createFromFlow(owner, { name, flowId });

  renderObject(response, template, { status: 201 });
};
