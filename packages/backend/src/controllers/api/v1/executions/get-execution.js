import { renderObject } from '@/helpers/renderer.js';
import Execution from '@/models/execution.js';

export default async (request, response) => {
  const execution = await Execution.query()
    .withSoftDeleted()
    .findById(request.params.executionId)
    .withGraphFetched({
      flow: {
        steps: true,
      },
    })
    .throwIfNotFound();

  renderObject(response, execution);
};
