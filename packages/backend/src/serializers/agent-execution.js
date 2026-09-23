const agentExecutionSerializer = (agentExecution) => {
  return {
    id: agentExecution.id,
    agentId: agentExecution.agentId,
    prompt: agentExecution.prompt,
    output: agentExecution.output,
    status: agentExecution.status,
    finishedAt: agentExecution.finishedAt
      ? new Date(agentExecution.finishedAt).getTime()
      : null,
    createdAt: agentExecution.createdAt.getTime(),
    updatedAt: agentExecution.updatedAt.getTime(),
  };
};

export default agentExecutionSerializer;
