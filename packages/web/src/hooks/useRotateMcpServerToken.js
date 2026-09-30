import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useRotateMcpServerToken(mcpServerId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post(
        `/v1/mcp-servers/${mcpServerId}/rotate-token`,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcpServers', mcpServerId] });
    },
  });
}
