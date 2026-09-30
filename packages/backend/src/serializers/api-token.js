const apiTokenSerializer = (apiToken) => {
  const token = apiToken.token || '';

  return {
    id: apiToken.id,
    token:
      token.substring(0, 4) + '...' + token.substring(token.length - 4),
    createdAt: apiToken.createdAt.getTime(),
    updatedAt: apiToken.updatedAt.getTime(),
  };
};

export default apiTokenSerializer;
