import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useAdminCreateOAuthClient(appKey) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post(
        `/v1/admin/apps/${appKey}/oauth-clients`,
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
