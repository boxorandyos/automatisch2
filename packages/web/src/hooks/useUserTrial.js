import { useQuery } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useUserTrial(userId) {
  const query = useQuery({
    queryKey: ['users', userId, 'trial'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/users/${userId}/trial`, { signal });
      return data;
    },
    enabled: !!userId,
  });

  return query;
}
