const adminSamlAuthProviderSerializer = (samlAuthProvider) => {
  return {
    id: samlAuthProvider.id,
    name: samlAuthProvider.name,
    certificate: samlAuthProvider.certificate,
    signatureAlgorithm: samlAuthProvider.signatureAlgorithm,
    issuer: samlAuthProvider.issuer,
    entryPoint: samlAuthProvider.entryPoint,
    firstnameAttributeName: samlAuthProvider.firstnameAttributeName,
    surnameAttributeName: samlAuthProvider.surnameAttributeName,
    emailAttributeName: samlAuthProvider.emailAttributeName,
    roleAttributeName: samlAuthProvider.roleAttributeName,
    defaultRoleId: samlAuthProvider.defaultRoleId,
    active: samlAuthProvider.active,
    loginUrl: samlAuthProvider.loginUrl,
    createdAt: samlAuthProvider.createdAt.getTime(),
    updatedAt: samlAuthProvider.updatedAt.getTime(),
  };
};

export default adminSamlAuthProviderSerializer;
