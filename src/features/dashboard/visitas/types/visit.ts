export type VisitStatus = "agendada" | "em_andamento" | "finalizada" | "cancelada";

export type VisitPropertyType = "casa" | "apartamento" | "terreno" | "sala_loja" | "outro";

export type VisitInterestType = "compra" | "aluguel" | "permuta";

export type VisitSource =
  | "instagram"
  | "site"
  | "plataforma"
  | "indicacao"
  | "placa"
  | "outro";

export interface VisitFileItem {
  id: number;
  name: string | null;
  url: string | null;
  mime_type: string | null;
  file_size: number | null;
  created_at: string;
}

export interface VisitListItem {
  id: number;
  user_id: number;
  lead_id: number | null;
  property_id: number | null;
  visitor_name: string;
  visitor_phone: string;
  visitor_email: string | null;
  property_name: string | null;
  property_address: string | null;
  property_type: VisitPropertyType | null;
  interest_type: VisitInterestType | null;
  source: VisitSource | null;
  customer_notes: string | null;
  broker_notes: string | null;
  broker_notes_private: boolean;
  has_partner_broker: boolean;
  partner_broker_name: string | null;
  partner_broker_creci: string | null;
  partner_broker_phone: string | null;
  partner_broker_company: string | null;
  signature_url: string | null;
  signed_at: string | null;
  has_signature: boolean;
  status: VisitStatus;
  visited_at: string | null;
  created_at: string;
  updated_at: string;
  user?: { id: number; name: string | null } | null;
  lead?: { id: number; name: string; phone: string; email: string | null } | null;
  property?: {
    id: number;
    title: string;
    slug: string;
    code: string;
    street: string;
    neighborhood: string;
  } | null;
  files_count?: number;
  files?: VisitFileItem[];
}

export interface VisitsFilters {
  search?: string;
  lead_id?: number;
  property_id?: number;
  status?: VisitStatus;
  user_id?: number;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
  };
}

export interface LeadSearchResult {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  cpf: string | null;
}

export interface PropertySearchResult {
  id: number;
  title: string;
  slug: string;
  code: string;
  street: string;
  neighborhood: string;
}
