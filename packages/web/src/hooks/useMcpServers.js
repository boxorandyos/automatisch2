import { useQuery } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useMcpServers({ page } = {}) {
  const query = useQuery({
    queryKey: ['mcpServers', { page }],
    queryFn: async ({ signal }) => {
      const { data } = await api.get('/v1/mcp-servers', {
        params: { page },
        signal,
      });
      return data;
    },
  });

  return query;
}
