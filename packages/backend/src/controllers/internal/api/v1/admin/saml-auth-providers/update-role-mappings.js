import { renderObject } from '@/helpers/renderer.js';
import SamlAuthProvider from '@/models/saml-auth-provider.js';

export default async (request, response) => {
  const samlAuthProvider = await SamlAuthProvider.query()
    .findById(request.params.samlAuthProviderId)
    .throwIfNotFound();

  const roleMappingsPayload = Array.isArray(request.body.roleMappings)
    ? request.body.roleMappings
    : request.body;

  await samlAuthProvider.$relatedQuery('roleMappings').delete();

  const roleMappings = await samlAuthProvider
    .$relatedQuery('roleMappings')
    .insertAndFetch(
      (Array.isArray(roleMappingsPayload) ? roleMappingsPayload : []).map(
        (roleMapping) => ({
          roleId: roleMapping.roleId,
          remoteRoleName: roleMapping.remoteRoleName,
        })
      )
    );

  renderObject(response, roleMappings);
};
