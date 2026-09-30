import { DateTime } from 'luxon';

import { renderObject } from '@/helpers/renderer.js';
import paginateRest from '@/helpers/pagination.js';
import Execution from '@/models/execution.js';

export default async (request, response) => {
  const executionsQuery = Execution.query()
    .withSoftDeleted()
    .joinRelated({ flow: true })
    .withGraphFetched({
      flow: {
        steps: true,
      },
    })
    .where((builder) => {
      builder.withSoftDeleted();

      if (request.query.name) {
        builder.where('flow.name', 'ilike', `%${request.query.name}%`);
      }

      if (request.query.status === 'success') {
        builder.where('executions.status', 'success');
      } else if (request.query.status === 'failure') {
        builder.where('executions.status', 'failure');
      }

      if (request.query.startDateTime) {
        const startDate = DateTime.fromMillis(Number(request.query.startDateTime));

        if (startDate.isValid) {
          builder.where('executions.created_at', '>=', startDate.toISO());
        }
      }

      if (request.query.endDateTime) {
        const endDate = DateTime.fromMillis(Number(request.query.endDateTime));

        if (endDate.isValid) {
          builder.where('executions.created_at', '<=', endDate.toISO());
        }
      }
    })
    .orderBy('created_at', 'desc');

  const executions = await paginateRest(executionsQuery, request.query.page);

  renderObject(response, executions);
};
