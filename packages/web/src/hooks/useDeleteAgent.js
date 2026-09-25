import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useDeleteAgent(agentId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete(`/v1/agents/${agentId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
  });
}
