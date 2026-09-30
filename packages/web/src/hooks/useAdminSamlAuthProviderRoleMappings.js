import { useQuery } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useAdminSamlAuthProviderRoleMappings(samlAuthProviderId) {
  const query = useQuery({
    queryKey: ['admin', 'samlAuthProviders', samlAuthProviderId, 'roleMappings'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(
        `/v1/admin/saml-auth-providers/${samlAuthProviderId}/role-mappings`,
        { signal },
      );
      return data;
    },
    enabled: !!samlAuthProviderId,
  });

  return query;
}
