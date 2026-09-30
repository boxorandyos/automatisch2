import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useCreateAgentTool(agentId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post(`/v1/agents/${agentId}/tools`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['agents', agentId, 'tools'],
      });
    },
  });
}
