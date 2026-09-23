import { renderObject } from '@/helpers/renderer.js';
import paginateRest from '@/helpers/pagination.js';
import Flow from '@/models/flow.js';

export default async (request, response) => {
  let flowsQuery = Flow.query()
    .withGraphFetched({ steps: true })
    .orderBy('active', 'desc')
    .orderBy('updated_at', 'desc');

  if (request.query.userId) {
    flowsQuery = flowsQuery.where('user_id', request.query.userId);
  }

  if (request.query.name) {
    flowsQuery = flowsQuery.where('name', 'ilike', `%${request.query.name}%`);
  }

  if (request.query.status === 'published') {
    flowsQuery = flowsQuery.where('active', true);
  } else if (request.query.status === 'draft') {
    flowsQuery = flowsQuery.where('active', false);
  }

  if (request.query.folderId === 'null') {
    flowsQuery = flowsQuery.whereNull('folder_id');
  } else if (request.query.folderId) {
    flowsQuery = flowsQuery.where('folder_id', request.query.folderId);
  }

  const flows = await paginateRest(flowsQuery, request.query.page);

  renderObject(response, flows);
};
