import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/configs/api';

export interface BlogPostCard {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;
  category: string | null;
  tags: string[];
  excerpt: string | null;
  image_url: string | null;
  thumbnail_url: string | null;
  link_url: string | null;
  reading_time: string | null;
  published_at: string | null;
  is_featured: boolean;
  views: number;
  author_name: string | null;
  author_photo: string | null;
}

export interface BlogAuthor {
  slug: string;
  name: string;
  role_title: string | null;
  specialty: string | null;
  mini_bio: string | null;
  full_bio: string | null;
  photo_url: string | null;
  whatsapp: string | null;
  phone: string | null;
  email: string | null;
  instagram: string | null;
  facebook: string | null;
  linkedin: string | null;
}

export interface BlogPostDetail extends BlogPostCard {
  body: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  author: BlogAuthor | null;
  related: BlogPostCard[];
}

export interface PostsMeta {
  categories: { name: string; count: number }[];
  popular_tags: { name: string; count: number }[];
}

export type BlogSort = 'recent' | 'most_read' | 'featured';

export interface BlogFilters {
  category?: string;
  tag?: string;
  q?: string;
  sort?: BlogSort;
  page?: number;
  per_page?: number;
}

export interface PaginatedPosts {
  data: BlogPostCard[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

function buildQuery(filters: BlogFilters = {}): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    params.append(key, String(value));
  });
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export function usePublicPosts(slug: string, filters: BlogFilters = {}) {
  const query = buildQuery(filters);
  return useQuery({
    queryKey: ['blog-posts', slug, query],
    queryFn: () => api.get(`${slug}/posts${query}`).json<PaginatedPosts>(),
    enabled: !!slug,
    placeholderData: prev => prev,
  });
}

export function usePublicPost(slug: string, postSlug: string) {
  return useQuery({
    queryKey: ['blog-post', slug, postSlug],
    queryFn: async () => {
      const res = await api
        .get(`${slug}/posts/${postSlug}`)
        .json<{ data: BlogPostDetail }>();
      return res.data;
    },
    enabled: !!slug && !!postSlug,
  });
}

export function usePostsMeta(slug: string) {
  return useQuery({
    queryKey: ['blog-posts-meta', slug],
    queryFn: () => api.get(`${slug}/posts-meta`).json<PostsMeta>(),
    enabled: !!slug,
  });
}
