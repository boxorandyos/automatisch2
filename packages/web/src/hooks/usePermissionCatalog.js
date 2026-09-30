import { useQuery } from '@tanstack/react-query';
import api from 'helpers/api';

export default function usePermissionCatalog() {
  const query = useQuery({
    queryKey: ['admin', 'permissions'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get('/v1/admin/permissions', { signal });
      return data;
    },
  });

  return query;
}
