import { useQuery } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useAgents({ page } = {}) {
  const query = useQuery({
    queryKey: ['agents', { page }],
    queryFn: async ({ signal }) => {
      const { data } = await api.get('/v1/agents', {
        params: { page },
        signal,
      });
      return data;
    },
  });

  return query;
}
