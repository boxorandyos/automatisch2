import { renderObject } from '@/helpers/renderer.js';
import User from '@/models/user.js';

export default async (request, response) => {
  const user = await User.query()
    .findById(request.params.userId)
    .withGraphFetched('role')
    .throwIfNotFound();

  renderObject(response, user);
};
