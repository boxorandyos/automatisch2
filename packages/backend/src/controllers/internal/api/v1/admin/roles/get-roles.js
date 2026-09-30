import { renderObject } from '@/helpers/renderer.js';
import Role from '@/models/role.js';

export default async function getRoles(_request, response) {
  const roles = await Role.query()
    .withGraphFetched('permissions')
    .orderBy('name', 'asc');

  renderObject(response, roles);
}
