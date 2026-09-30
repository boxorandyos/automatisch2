import { renderObject } from '@/helpers/renderer.js';
import User from '@/models/user.js';

export default async (request, response) => {
  const user = await User.query()
    .findById(request.params.userId)
    .throwIfNotFound();

  const folder = await user
    .$relatedQuery('folders')
    .findById(request.params.folderId)
    .throwIfNotFound();

  const updatedFolder = await folder
    .$query()
    .patchAndFetch({ name: request.body.name });

  renderObject(response, updatedFolder);
};
