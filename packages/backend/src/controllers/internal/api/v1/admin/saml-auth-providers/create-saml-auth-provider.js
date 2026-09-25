import { renderObject } from '@/helpers/renderer.js';
import SamlAuthProvider from '@/models/saml-auth-provider.js';

export default async (request, response) => {
  const samlAuthProvider = await SamlAuthProvider.query().insertAndFetch(
    samlAuthProviderParams(request)
  );

  renderObject(response, samlAuthProvider, {
    status: 201,
    serializer: 'AdminSamlAuthProvider',
  });
};

const samlAuthProviderParams = (request) => {
  const {
    name,
    certificate,
    signatureAlgorithm,
    issuer,
    entryPoint,
    firstnameAttributeName,
    surnameAttributeName,
    emailAttributeName,
    roleAttributeName,
    defaultRoleId,
    active,
  } = request.body;

  return {
    name,
    certificate,
    signatureAlgorithm,
    issuer,
    entryPoint,
    firstnameAttributeName,
    surnameAttributeName,
    emailAttributeName,
    roleAttributeName,
    defaultRoleId,
    active,
  };
};
