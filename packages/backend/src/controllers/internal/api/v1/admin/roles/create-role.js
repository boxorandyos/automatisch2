import { renderObject } from '@/helpers/renderer.js';
import Role from '@/models/role.js';

export default async function createRole(request, response) {
  const { name, description, permissions } = roleParams(request);

  const role = await Role.query().insertAndFetch({
    name,
    description,
  });

  await role.createPermissions(permissions);

  const roleWithPermissions = await role
    .$query()
    .withGraphFetched('permissions');

  renderObject(response, roleWithPermissions, { status: 201 });
}

const roleParams = (request) => {
  const { name, description, permissions } = request.body;

  return {
    name,
    description,
    permissions,
  };
};
