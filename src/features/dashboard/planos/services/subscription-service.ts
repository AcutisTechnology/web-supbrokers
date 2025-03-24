import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  CreateSubscriptionDTO,
  SubscriptionResponse,
  PixPaymentResponse,
} from "../types/subscription";
import { api } from "@/shared/configs/api";

const createSubscription = async (
  data: CreateSubscriptionDTO
): Promise<SubscriptionResponse> => {
  const response = await api.post("asaas/subscriptions", { json: data });
  return response.json();
};

const createPixPayment = async (
  data: CreateSubscriptionDTO
): Promise<PixPaymentResponse> => {
  const response = await api.post("asaas/subscriptions/pix", { json: data });
  return response.json();
};

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSubscription,
    onSuccess: (data) => {
      // Invalidar queries relacionadas aos planos após sucesso
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      queryClient.invalidateQueries({ queryKey: ["current-plan"] });
    },
  });
};

export const useCreatePixPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPixPayment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      queryClient.invalidateQueries({ queryKey: ["current-plan"] });
    },
  });
};
