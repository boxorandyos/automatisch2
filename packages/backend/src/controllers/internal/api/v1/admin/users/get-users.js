import paginateRest from '@/helpers/pagination.js';
import { renderObject } from '@/helpers/renderer.js';
import User from '@/models/user.js';

export default async function getUsers(request, response) {
  const page = request.query.page;

  const query = User.query()
    .withGraphFetched('role')
    .orderBy('full_name', 'asc');

  const pageResult = await paginateRest(query, page);

  renderObject(response, pageResult);
}
