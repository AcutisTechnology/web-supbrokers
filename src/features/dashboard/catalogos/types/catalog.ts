export interface Catalog {
  id: string;
  name: string;
  description: string;
  target_audience: string;
  color: string;
  icon: string;
  properties_count: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface CatalogProperty {
  id: string;
  catalog_id: string;
  property_id: string;
  position: number;
  added_at: string;
}

export interface CreateCatalogRequest {
  name: string;
  description: string;
  target_audience: string;
  color: string;
  icon: string;
}

export interface UpdateCatalogRequest extends Partial<CreateCatalogRequest> {
  is_active?: boolean;
}

export interface CatalogWithProperties extends Catalog {
  properties: CatalogProperty[]; // Usar o tipo Property quando disponível
}

export interface PaginatedCatalogResponse {
  data: Catalog[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}