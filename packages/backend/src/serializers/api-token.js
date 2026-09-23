const apiTokenSerializer = (apiToken) => {
  const token = apiToken.token || '';

  return {
    id: apiToken.id,
    token: token.slice(-4),
    createdAt: apiToken.createdAt.getTime(),
    updatedAt: apiToken.updatedAt.getTime(),
  };
};

export default apiTokenSerializer;
