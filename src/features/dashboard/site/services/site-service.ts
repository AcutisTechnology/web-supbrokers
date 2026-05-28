import { api } from "@/shared/configs/api";

export const SOCIAL_PLATFORMS = [
  "instagram",
  "facebook",
  "linkedin",
  "youtube",
  "tiktok",
  "whatsapp",
  "twitter",
  "custom",
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export interface SiteFooter {
  id: number;
  site_setting_id: number;
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
  created_at: string;
  updated_at: string;
}

export interface SiteSocialLink {
  id: number;
  platform: SocialPlatform;
  url: string;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteSetting {
  id: number;
  user_id: number;
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
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  listing_page_size: number | null;
  listing_default_sort: string | null;
  created_at: string;
  updated_at: string;
  footer?: SiteFooter | null;
  social_links?: SiteSocialLink[];
}

export interface UpdateSiteSettingPayload {
  primary_color?: string | null;
  secondary_color?: string | null;
  brand_image?: string | null;
  favicon?: string | null;
  site_title?: string | null;
  site_subtitle?: string | null;
  hero_eyebrow?: string | null;
  hero_title_line_1?: string | null;
  hero_title_line_2?: string | null;
  hero_background_url?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  og_image_url?: string | null;
  listing_page_size?: number | null;
  listing_default_sort?: string | null;
}

export interface UpdateSiteFooterPayload {
  company_name?: string | null;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  address?: string | null;
  address_number?: string | null;
  district?: string | null;
  city?: string | null;
  state?: string | null;
  zipcode?: string | null;
  creci?: string | null;
  footer_text?: string | null;
  show_social_links?: boolean;
}

export interface StoreSiteSocialLinkPayload {
  platform: SocialPlatform;
  url: string;
  icon?: string | null;
  sort_order?: number;
  is_active?: boolean;
}

export interface UpdateSiteSocialLinkPayload {
  platform?: SocialPlatform;
  url?: string;
  icon?: string | null;
  sort_order?: number;
  is_active?: boolean;
}

type ResourceResponse<T> = { data: T };

export async function fetchSiteSettings(): Promise<SiteSetting> {
  const response = await api.get("site/settings").json<ResourceResponse<SiteSetting>>();
  return response.data;
}

export async function updateSiteSettings(payload: UpdateSiteSettingPayload): Promise<SiteSetting> {
  const response = await api.put("site/settings", { json: payload }).json<ResourceResponse<SiteSetting>>();
  return response.data;
}

export async function fetchSiteFooter(): Promise<SiteFooter> {
  const response = await api.get("site/footer").json<ResourceResponse<SiteFooter>>();
  return response.data;
}

export async function updateSiteFooter(payload: UpdateSiteFooterPayload): Promise<SiteFooter> {
  const response = await api.put("site/footer", { json: payload }).json<ResourceResponse<SiteFooter>>();
  return response.data;
}

export async function fetchSiteSocialLinks(): Promise<SiteSocialLink[]> {
  const response = await api.get("site/social-links").json<ResourceResponse<SiteSocialLink[]>>();
  return response.data;
}

export async function createSiteSocialLink(payload: StoreSiteSocialLinkPayload): Promise<SiteSocialLink> {
  const response = await api.post("site/social-links", { json: payload }).json<ResourceResponse<SiteSocialLink>>();
  return response.data;
}

export async function updateSiteSocialLink(
  id: number,
  payload: UpdateSiteSocialLinkPayload
): Promise<SiteSocialLink> {
  const response = await api
    .put(`site/social-links/${id}`, { json: payload })
    .json<ResourceResponse<SiteSocialLink>>();
  return response.data;
}

export async function deleteSiteSocialLink(id: number): Promise<void> {
  await api.delete(`site/social-links/${id}`);
}
