import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useDeleteMcpTool(mcpServerId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (toolId) => {
      const { data } = await api.delete(
        `/v1/mcp-servers/${mcpServerId}/mcp-tools/${toolId}`,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['mcpServers', mcpServerId, 'mcp-tools'],
      });
    },
  });
}
