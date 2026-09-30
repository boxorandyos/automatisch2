import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useUpdateAgent(agentId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.patch(`/v1/agents/${agentId}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents', agentId] });
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
  });
}
