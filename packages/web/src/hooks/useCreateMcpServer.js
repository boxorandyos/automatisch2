import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useCreateMcpServer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload = {}) => {
      const { data } = await api.post('/v1/mcp-servers', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcpServers'] });
    },
  });
}
