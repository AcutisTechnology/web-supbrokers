import { api } from '@/shared/configs/api';
import { CustomerStatus, AvailableSteps, AvailableStatuses, CustomerStatusStep, CustomerStatusType } from '../types/status';

export async function fetchCustomerStatuses(customerId: number): Promise<CustomerStatus[]> {
  const res = await api.get(`customers/${customerId}/statuses`);
  const data = await res.json<{ data: CustomerStatus[] }>();
  return data.data;
}

export async function createCustomerStatus(
  customerId: number,
  payload: { step: CustomerStatusStep; status: CustomerStatusType; notes?: string }
): Promise<CustomerStatus> {
  const res = await api.post(`customers/${customerId}/statuses`, { json: payload });
  const data = await res.json<{ data: CustomerStatus }>();
  return data.data;
}

export async function fetchAvailableSteps(): Promise<AvailableSteps> {
  const res = await api.get('customers/statuses/available-steps');
  const data = await res.json<{ data: AvailableSteps }>();
  return data.data;
}

export async function fetchAvailableStatuses(): Promise<AvailableStatuses> {
  const res = await api.get('customers/statuses/available-statuses');
  const data = await res.json<{ data: AvailableStatuses }>();
  return data.data;
}

export async function updateCustomerStatus(
  customerId: number,
  statusId: number,
  payload: { status: CustomerStatusType; notes?: string }
): Promise<CustomerStatus> {
  const res = await api.patch(`customers/${customerId}/statuses/${statusId}`, { json: payload });
  const data = await res.json<{ data: CustomerStatus }>();
  return data.data;
} 