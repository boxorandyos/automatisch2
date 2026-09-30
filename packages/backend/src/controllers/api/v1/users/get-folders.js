import { renderObject } from '@/helpers/renderer.js';
import User from '@/models/user.js';

export default async (request, response) => {
  const user = await User.query()
    .findById(request.params.userId)
    .throwIfNotFound();

  const folders = await user.$relatedQuery('folders').orderBy('name', 'asc');

  renderObject(response, folders);
};
