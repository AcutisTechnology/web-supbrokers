import { api } from "@/shared/configs/api";

export const PAGE_TYPES = ["home", "properties", "blog", "about", "team", "contact", "privacy", "custom"] as const;
export type SitePageType = (typeof PAGE_TYPES)[number];

/**
 * Slug padrão sugerido ao selecionar o tipo (usado no formulário).
 */
export const PAGE_TYPE_DEFAULT_SLUGS: Partial<Record<SitePageType, string>> = {
  home: "/",
  properties: "imoveis",
  blog: "blog",
  about: "quem-somos",
  team: "equipe",
  contact: "contato",
  privacy: "politica-de-privacidade",
};

/**
 * Tipos que redirecionam para rotas de sistema do site público
 * (não passam pelo /p/…).
 */
export const PAGE_TYPE_SYSTEM_ROUTES: Partial<Record<SitePageType, string>> = {
  home: "/",
  properties: "imoveis",
  blog: "blog",
  team: "equipe",
  contact: "contato",
  privacy: "politica-de-privacidade",
};

export interface SitePage {
  id: number;
  user_id: number;
  title: string;
  slug: string;
  page_type: SitePageType;
  hero_title: string | null;
  hero_subtitle: string | null;
  content: string | null;
  featured_image: string | null;
  is_home: boolean;
  is_published: boolean;
  show_in_menu: boolean;
  menu_order: number;
  created_at: string;
  updated_at: string;
}

export interface StoreSitePagePayload {
  title: string;
  slug: string;
  page_type?: SitePageType;
  hero_title?: string | null;
  hero_subtitle?: string | null;
  content?: string | null;
  featured_image?: string | null;
  is_home?: boolean;
  is_published?: boolean;
  show_in_menu?: boolean;
  menu_order?: number;
}

export interface UpdateSitePagePayload {
  title?: string;
  slug?: string;
  page_type?: SitePageType;
  hero_title?: string | null;
  hero_subtitle?: string | null;
  content?: string | null;
  featured_image?: string | null;
  is_published?: boolean;
  show_in_menu?: boolean;
  menu_order?: number;
}

type ResourceResponse<T> = { data: T };

export async function fetchSitePages(): Promise<SitePage[]> {
  const response = await api.get("site/pages").json<ResourceResponse<SitePage[]>>();
  return response.data;
}

export async function fetchSitePage(id: number): Promise<SitePage> {
  const response = await api.get(`site/pages/${id}`).json<ResourceResponse<SitePage>>();
  return response.data;
}

export async function createSitePage(payload: StoreSitePagePayload): Promise<SitePage> {
  const response = await api.post("site/pages", { json: payload }).json<ResourceResponse<SitePage>>();
  return response.data;
}

export async function updateSitePage(id: number, payload: UpdateSitePagePayload): Promise<SitePage> {
  const response = await api.put(`site/pages/${id}`, { json: payload }).json<ResourceResponse<SitePage>>();
  return response.data;
}

export async function deleteSitePage(id: number): Promise<void> {
  await api.delete(`site/pages/${id}`);
}

export async function setSitePageAsHome(id: number): Promise<SitePage> {
  const response = await api
    .post(`site/pages/${id}/set-home`)
    .json<ResourceResponse<SitePage>>();
  return response.data;
}

export async function toggleSitePagePublish(id: number): Promise<SitePage> {
  const response = await api
    .post(`site/pages/${id}/toggle-publish`)
    .json<ResourceResponse<SitePage>>();
  return response.data;
}

// Endpoints públicos (consumidos pelo site público).
export async function fetchPublicSitePages(brokerSlug: string): Promise<SitePage[]> {
  const response = await api.get(`${brokerSlug}/site/pages`).json<ResourceResponse<SitePage[]>>();
  return response.data;
}

export async function fetchPublicSiteMenu(brokerSlug: string): Promise<SitePage[]> {
  const response = await api.get(`${brokerSlug}/site/menu`).json<ResourceResponse<SitePage[]>>();
  return response.data;
}

export async function fetchPublicSitePage(brokerSlug: string, pageSlug: string): Promise<SitePage> {
  const normalized = pageSlug === "" || pageSlug === "/" ? "/" : pageSlug.replace(/^\//, "");
  const path = normalized === "/" ? `${brokerSlug}/site/pages/` : `${brokerSlug}/site/pages/${normalized}`;
  const response = await api.get(path).json<ResourceResponse<SitePage>>();
  return response.data;
}

export const PAGE_TYPE_LABELS: Record<SitePageType, string> = {
  home: "Home",
  properties: "Imóveis",
  blog: "Blog",
  about: "Quem Somos",
  team: "Equipe",
  contact: "Contato",
  privacy: "Política de Privacidade",
  custom: "Personalizada",
};
