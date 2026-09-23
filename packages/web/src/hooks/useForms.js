import { useQuery } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useForms({ page } = {}) {
  const query = useQuery({
    queryKey: ['forms', { page }],
    queryFn: async ({ signal }) => {
      const { data } = await api.get('/v1/forms', {
        params: { page },
        signal,
      });
      return data;
    },
  });

  return query;
}
