import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useAdminUpdateOAuthClient(appKey, oauthClientId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.patch(
        `/v1/admin/apps/${appKey}/oauth-clients/${oauthClientId}`,
        payload,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'apps', appKey, 'oauthClients'],
      });
    },
  });
}
