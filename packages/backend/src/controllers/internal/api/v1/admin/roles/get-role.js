import { renderObject } from '@/helpers/renderer.js';
import Role from '@/models/role.js';

export default async function getRole(request, response) {
  const role = await Role.query()
    .withGraphFetched('permissions')
    .findById(request.params.roleId)
    .throwIfNotFound();

  renderObject(response, role);
}
