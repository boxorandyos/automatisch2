const samlAuthProviderSerializer = (samlAuthProvider) => {
  return {
    id: samlAuthProvider.id,
    name: samlAuthProvider.name,
    loginUrl: samlAuthProvider.loginUrl,
    issuer: samlAuthProvider.issuer,
    active: samlAuthProvider.active,
  };
};

export default samlAuthProviderSerializer;
