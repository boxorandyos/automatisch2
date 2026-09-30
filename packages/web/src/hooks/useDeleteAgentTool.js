import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useDeleteAgentTool(agentId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (toolId) => {
      const { data } = await api.delete(
        `/v1/agents/${agentId}/tools/${toolId}`,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['agents', agentId, 'tools'],
      });
    },
  });
}
