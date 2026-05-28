import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/configs/api";

// Interface para os dados do imóvel
export interface Property {
  title: string;
  description: string;
  slug: string;
  property_type: string | null;
  street: string;
  neighborhood: string;
  city: string | null;
  state: string | null;
  zipcode: string | null;
  size: number;
  bedrooms: number;
  suites: number;
  bathrooms: number;
  garages: number;
  rent: boolean;
  sale: boolean;
  value: string;
  value_raw?: number;
  iptu_value: string;
  condominium_value?: string;
  code: string;
  qr_code: string;
  active: boolean;
  highlighted: boolean;
  characteristics: { text: string }[];
  attachments: { name: string; url: string }[];
  created_at: string;
}

export interface PublicSiteFooter {
  company_name: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  address_number: string | null;
  district: string | null;
  city: string | null;
  state: string | null;
  zipcode: string | null;
  creci: string | null;
  footer_text: string | null;
  show_social_links: boolean;
}

export interface PublicSocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string | null;
  sort_order: number;
}

export interface PublicSite {
  primary_color: string | null;
  secondary_color: string | null;
  brand_image: string | null;
  favicon: string | null;
  site_title: string | null;
  site_subtitle: string | null;
  hero_eyebrow: string | null;
  hero_title_line_1: string | null;
  hero_title_line_2: string | null;
  hero_background_url: string | null;
  home_layout: { key: string; enabled: boolean }[];
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  listing_page_size: number | null;
  listing_default_sort: string | null;
  footer: PublicSiteFooter | null;
  social_links: PublicSocialLink[];
}

export interface PublicSiteStat {
  id: number;
  label: string;
  value: number;
  prefix: string | null;
  suffix: string | null;
  icon: string | null;
  sort_order: number;
}

export interface PublicWhatsappTemplate {
  key: string;
  message: string;
}

export interface PublicInstitutionalDifferential {
  icon: string;
  title: string;
  text: string;
}

export interface PublicInstitutional {
  eyebrow: string | null;
  title: string | null;
  body: string | null;
  image_url: string | null;
  values: string[];
  differentials: PublicInstitutionalDifferential[];
}

export interface PublicTestimonial {
  id: number;
  name: string;
  role: string | null;
  avatar_url: string | null;
  rating: number;
  message: string;
}

// Interface para os dados do corretor
export interface User {
  name: string;
  phone: string;
  site?: PublicSite | null;
}

// Interface para os dados retornados pela API
export interface BrokerPropertiesResponse {
  data: {
    highlighted: Property[];
    all: Property[];
    sale: Property[];
    rent: Property[];
    stats: PublicSiteStat[];
    whatsapp_templates: PublicWhatsappTemplate[];
    institutional: PublicInstitutional | null;
    testimonials: PublicTestimonial[];
    user: User;
  };
}

export interface BrokerSearchFilters {
  q?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  property_type?: string | string[];
  purpose?: "sale" | "rent" | "both";
  bedrooms_min?: number;
  suites_min?: number;
  bathrooms_min?: number;
  garages_min?: number;
  size_min?: number;
  size_max?: number;
  price_min?: number;
  price_max?: number;
  code?: string;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc" | "size_desc";
}

function buildFilterQuery(filters: BrokerSearchFilters = {}): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      if (value.length === 0) return;
      params.append(key, value.join(","));
    } else {
      params.append(key, String(value));
    }
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

/**
 * Hook para buscar os imóveis de um corretor com filtros opcionais.
 * Os filtros são serializados em query string e enviados ao endpoint público,
 * que aplica filtros server-side em todos os buckets (all/highlighted/sale/rent).
 *
 * @param slug Slug do corretor
 * @param filters Filtros opcionais
 */
export function useBrokerProperties(
  slug: string,
  filters: BrokerSearchFilters = {}
) {
  const query = buildFilterQuery(filters);
  return useQuery({
    queryKey: ["broker-properties", slug, query],
    queryFn: async () => {
      const response = await api
        .get(`${slug}/properties${query}`)
        .json<BrokerPropertiesResponse>();
      return response;
    },
    enabled: !!slug,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
