import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useUpdateMcpServer(mcpServerId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.patch(
        `/v1/mcp-servers/${mcpServerId}`,
        payload,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcpServers', mcpServerId] });
      queryClient.invalidateQueries({ queryKey: ['mcpServers'] });
    },
  });
}
