import { renderObject } from '@/helpers/renderer.js';
import User from '@/models/user.js';

export default async function getUser(request, response) {
  const { userId } = request.params;

  const user = await User.query()
    .withGraphFetched('role')
    .findById(userId)
    .throwIfNotFound();

  renderObject(response, user);
}
