import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useAdminDeleteTemplate(templateId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete(`/v1/admin/templates/${templateId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'templates'] });
    },
  });
}
