import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useAdminUpdateSamlAuthProvider(samlAuthProviderId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.patch(
        `/v1/admin/saml-auth-providers/${samlAuthProviderId}`,
        payload,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'samlAuthProviders'],
      });
    },
  });
}
