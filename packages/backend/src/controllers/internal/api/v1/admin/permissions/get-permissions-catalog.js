import { renderObject } from '@/helpers/renderer.js';
import permissionCatalog from '@/helpers/permission-catalog.js';

export default async function getPermissionsCatalog(_request, response) {
  renderObject(response, permissionCatalog);
}
