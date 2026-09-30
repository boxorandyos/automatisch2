import { renderObject } from '@/helpers/renderer.js';
import paginateRest from '@/helpers/pagination.js';
import User from '@/models/user.js';

export default async (request, response) => {
  const usersQuery = User.query()
    .withGraphFetched('role')
    .where({ status: 'active' })
    .orderBy('full_name', 'asc');

  const users = await paginateRest(usersQuery, request.query.page);

  renderObject(response, users);
};
