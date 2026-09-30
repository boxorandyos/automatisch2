import { renderObject } from '@/helpers/renderer.js';
import Role from '@/models/role.js';

export default async function updateRole(request, response) {
  const role = await Role.query()
    .findById(request.params.roleId)
    .throwIfNotFound();

  const updatedRole = await role.updateWithPermissions(roleParams(request));

  renderObject(response, updatedRole);
}

const roleParams = (request) => {
  const { name, description, permissions } = request.body;

  return {
    name,
    description,
    permissions,
  };
};
