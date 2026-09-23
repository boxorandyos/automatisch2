const adminOAuthClientSerializer = (oauthClient) => {
  return {
    id: oauthClient.id,
    appKey: oauthClient.appKey,
    name: oauthClient.name,
    active: oauthClient.active,
    formattedAuthDefaults: oauthClient.formattedAuthDefaults,
    createdAt: oauthClient.createdAt.getTime(),
    updatedAt: oauthClient.updatedAt.getTime(),
  };
};

export default adminOAuthClientSerializer;
