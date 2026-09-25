import { useQuery } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useAdminOAuthClient(appKey, oauthClientId) {
  const query = useQuery({
    queryKey: ['admin', 'apps', appKey, 'oauthClients', oauthClientId],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(
        `/v1/admin/apps/${appKey}/oauth-clients/${oauthClientId}`,
        { signal },
      );
      return data;
    },
    enabled: !!appKey && !!oauthClientId,
  });

  return query;
}
