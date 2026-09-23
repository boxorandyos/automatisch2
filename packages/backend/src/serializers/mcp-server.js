const mcpServerSerializer = (mcpServer) => {
  return {
    id: mcpServer.id,
    name: mcpServer.name,
    token: mcpServer.token,
    serverUrl: mcpServer.serverUrl,
    createdAt: mcpServer.createdAt.getTime(),
    updatedAt: mcpServer.updatedAt.getTime(),
  };
};

export default mcpServerSerializer;
