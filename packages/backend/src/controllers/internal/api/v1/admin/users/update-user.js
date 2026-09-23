import { renderObject } from '@/helpers/renderer.js';
import User from '@/models/user.js';

function pickUpdatableFields(body) {
  const nextValues = {};

  if (Object.prototype.hasOwnProperty.call(body, 'email')) {
    nextValues.email = body.email;
  }

  if (Object.prototype.hasOwnProperty.call(body, 'fullName')) {
    nextValues.fullName = body.fullName;
  }

  if (Object.prototype.hasOwnProperty.call(body, 'roleId')) {
    nextValues.roleId = body.roleId;
  }

  return nextValues;
}

export default async function updateUser(request, response) {
  const { userId } = request.params;
  const patch = pickUpdatableFields(request.body);

  const user = await User.query()
    .withGraphFetched('role')
    .patchAndFetchById(userId, patch)
    .throwIfNotFound();

  renderObject(response, user);
}
