import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useCreateMcpTool(mcpServerId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post(
        `/v1/mcp-servers/${mcpServerId}/mcp-tools`,
        payload,
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
