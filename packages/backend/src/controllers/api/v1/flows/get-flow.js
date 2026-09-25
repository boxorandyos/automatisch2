import { renderObject } from '@/helpers/renderer.js';
import Flow from '@/models/flow.js';

export default async (request, response) => {
  const flow = await Flow.query()
    .findById(request.params.flowId)
    .withGraphFetched({ steps: true })
    .throwIfNotFound();

  renderObject(response, flow);
};
