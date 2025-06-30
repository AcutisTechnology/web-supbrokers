import { useMutation } from '@tanstack/react-query';
import { api } from '@/shared/configs/api';

export function useCreateAluguel() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      await api.post('alugueis', { body: formData });
    },
  });
} 