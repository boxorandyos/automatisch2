const agentToolSerializer = (agentTool) => {
  return {
    id: agentTool.id,
    agentId: agentTool.agentId,
    type: agentTool.type,
    flowId: agentTool.flowId,
    connectionId: agentTool.connectionId,
    appKey: agentTool.appKey,
    actions: agentTool.actions,
    createdAt: agentTool.createdAt.getTime(),
    updatedAt: agentTool.updatedAt.getTime(),
  };
};

export default agentToolSerializer;
