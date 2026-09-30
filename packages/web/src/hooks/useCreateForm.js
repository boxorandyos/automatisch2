import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from 'helpers/api';

export default function useCreateForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/v1/forms', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    },
  });
}
