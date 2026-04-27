export type ProposalStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELED";

export interface ProposalProponent {
  id?: number;
  type?: "principal" | "conjuge" | "adicional";
  lead_id?: number | null;
  name: string;
  email?: string | null;
  phone?: string | null;
  cpf?: string | null;
  birth_date?: string | null;
  nationality?: string | null;
  marital_status?: string | null;
  profession?: string | null;
  rg?: string | null;
  address?: string | null;
}

export interface ProposalCondition {
  id?: string | number;
  type: "percentage" | "value";
  description: string;
  value: number;
  start_date?: string | null;
  end_date?: string | null;
  installments?: number;
  period?: string | null;
  installment_value?: number | null;
  total_value?: number | null;
  order?: number | null;
}

export interface ProposalIntermediator {
  id?: number;
  broker_id?: number | null;
  name?: string | null;
  creci?: string | null;
  phone?: string | null;
  document?: string | null;
  email?: string | null;
  address?: string | null;
  company_name?: string | null;
}

export interface ProposalPropertyAttachment {
  name?: string;
  url: string;
}

export interface ProposalProperty {
  id: number;
  title?: string;
  description?: string;
  slug?: string;
  street?: string;
  neighborhood?: string;
  value?: string;
  code?: string;
  attachments?: ProposalPropertyAttachment[];
}

export interface Proposal {
  id: number;
  uuid?: string;
  code: string;
  property_id: number;
  property?: ProposalProperty;
  status: ProposalStatus;
  proponents: ProposalProponent[];
  conditions: ProposalCondition[];
  intermediator?: ProposalIntermediator;
  property_description?: string | null;
  property_value?: number | null;
  property_address?: string | null;
  property_complement?: string | null;
  property_builder_name?: string | null;
  total_value: number;
  total_percentage?: number | null;
  difference_value?: number | null;
  notes?: string | null;
  views_count: number;
  public_token?: string;
  token?: string;
  accepted_at?: string | null;
  rejected_at?: string | null;
  expiration_date?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateProposalDTO {
  property_id: number;
  property_description?: string | null;
  property_value?: number | null;
  property_address?: string | null;
  property_complement?: string | null;
  proponents: ProposalProponent[];
  conditions: ProposalCondition[];
  intermediator?: ProposalIntermediator | null;
  total_value: number;
  total_percentage?: number | null;
  difference_value?: number | null;
  notes?: string | null;
}

export interface UpdateProposalDTO extends Partial<CreateProposalDTO> {
  status?: ProposalStatus;
}
