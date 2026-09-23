import { useQuery } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useInvoices(userId) {
  const query = useQuery({
    queryKey: ['users', userId, 'invoices'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/v1/users/${userId}/invoices`, {
        signal,
      });
      return data;
    },
    enabled: !!userId,
  });

  return query;
}
