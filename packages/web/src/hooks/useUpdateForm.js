import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useUpdateForm(formId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.patch(`/v1/forms/${formId}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    },
  });
}
