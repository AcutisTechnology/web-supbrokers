export type CustomerStatusStep =
  | 'interest_shown'
  | 'first_contact'
  | 'visit_scheduled'
  | 'negotiation'
  | 'document_analysis'
  | 'approval'
  | 'contract_signature';

export type CustomerStatusType = 'started' | 'completed' | 'reopened';

export interface CustomerStatus {
  id: number;
  customer_id: number;
  step: CustomerStatusStep;
  status: CustomerStatusType;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type AvailableSteps = Record<CustomerStatusStep, string>;
export type AvailableStatuses = Record<CustomerStatusType, string>; 