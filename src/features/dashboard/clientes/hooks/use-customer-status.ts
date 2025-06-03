import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchCustomerStatuses,
  createCustomerStatus,
  fetchAvailableSteps,
  fetchAvailableStatuses,
  updateCustomerStatus,
} from '../services/customer-status-service';
import { CustomerStatusStep, CustomerStatusType } from '../types/status';

export function useCustomerStatuses(customerId: number) {
  return useQuery({
    queryKey: ['customer-statuses', customerId],
    queryFn: () => fetchCustomerStatuses(customerId),
    enabled: !!customerId,
  });
}

export function useCreateCustomerStatus(customerId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { step: CustomerStatusStep; status: CustomerStatusType; notes?: string }) =>
      createCustomerStatus(customerId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-statuses', customerId] });
    },
  });
}

export function useAvailableSteps() {
  return useQuery({
    queryKey: ['customer-status-available-steps'],
    queryFn: fetchAvailableSteps,
  });
}

export function useAvailableStatuses() {
  return useQuery({
    queryKey: ['customer-status-available-statuses'],
    queryFn: fetchAvailableStatuses,
  });
}

export function useUpdateCustomerStatus(customerId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ statusId, status, notes }: { statusId: number; status: CustomerStatusType; notes?: string }) =>
      updateCustomerStatus(customerId, statusId, { status, notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-statuses', customerId] });
    },
  });
} 