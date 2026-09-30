import { useQuery } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useSubscription(userId) {
  const query = useQuery({
    queryKey: ['users', userId, 'subscription'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/users/${userId}/subscription`, {
        signal,
      });
      return data;
    },
    enabled: !!userId,
  });

  return query;
}
