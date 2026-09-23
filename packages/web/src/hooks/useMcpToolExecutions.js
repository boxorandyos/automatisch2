import { useQuery } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useMcpToolExecutions(mcpServerId, { page } = {}) {
  const query = useQuery({
    queryKey: ['mcpServers', mcpServerId, 'mcp-tool-executions', { page }],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(
        `/v1/mcp-servers/${mcpServerId}/mcp-tool-executions`,
        { params: { page }, signal },
      );
      return data;
    },
    enabled: !!mcpServerId,
  });

  return query;
}
