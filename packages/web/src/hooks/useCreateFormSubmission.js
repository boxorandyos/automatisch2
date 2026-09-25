import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export default function useCreateFormSubmission() {
  return useMutation({
    mutationFn: async ({ webhookUrl, data: formData }) => {
      const { data } = await axios.post(webhookUrl, formData);
      return data;
    },
  });
}
