import { renderObject } from '@/helpers/renderer.js';
import User from '@/models/user.js';

export default async (request, response) => {
  const user = await User.query().findById(request.body.userId).throwIfNotFound();

  const flow = request.body.templateId
    ? await user.createFlowFromTemplate(request.body.templateId)
    : await user.createEmptyFlow();

  renderObject(response, flow, { status: 201 });
};
