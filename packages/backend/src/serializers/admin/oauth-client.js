const adminOAuthClientSerializer = (oauthClient) => {
  return {
    id: oauthClient.id,
    appKey: oauthClient.appKey,
    name: oauthClient.name,
    active: oauthClient.active,
    formattedAuthDefaults: oauthClient.formattedAuthDefaults,
    createdAt: new Date(oauthClient.createdAt).getTime(),
    updatedAt: new Date(oauthClient.updatedAt).getTime(),
  };
};

export default adminOAuthClientSerializer;
