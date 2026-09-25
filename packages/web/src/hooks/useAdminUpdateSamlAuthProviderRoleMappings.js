import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useAdminUpdateSamlAuthProviderRoleMappings(
  samlAuthProviderId,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.patch(
        `/v1/admin/saml-auth-providers/${samlAuthProviderId}/role-mappings`,
        payload,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          'admin',
          'samlAuthProviders',
          samlAuthProviderId,
          'roleMappings',
        ],
      });
    },
  });
}
