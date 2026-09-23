import { useQuery } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useAgentExecutions(agentId, { page } = {}) {
  const query = useQuery({
    queryKey: ['agents', agentId, 'executions', { page }],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/agents/${agentId}/executions`, {
        params: { page },
        signal,
      });
      return data;
    },
    enabled: !!agentId,
  });

  return query;
}
