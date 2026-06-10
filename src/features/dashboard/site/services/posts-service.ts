import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/configs/api";
import { useToast } from "@/hooks/use-toast";

export interface SitePost {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;
  category: string | null;
  tags: string[];
  excerpt: string | null;
  body: string | null;
  image_url: string | null;
  thumbnail_url: string | null;
  link_url: string | null;
  reading_time: string | null;
  published_at: string | null;
  is_published: boolean;
  is_featured: boolean;
  is_visible: boolean;
  views: number;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  agent_profile_id: number | null;
  author_name: string | null;
  sort_order: number;
  editable: boolean;
}

export interface SitePostPayload {
  title: string;
  subtitle?: string | null;
  category?: string | null;
  tags?: string[];
  excerpt?: string | null;
  body?: string | null;
  image_url?: string | null;
  thumbnail_url?: string | null;
  link_url?: string | null;
  reading_time?: string | null;
  published_at?: string | null;
  is_published?: boolean;
  is_featured?: boolean;
  is_visible?: boolean;
  seo_title?: string | null;
  seo_description?: string | null;
  og_image_url?: string | null;
  agent_profile_id?: number | null;
  sort_order?: number;
}

export interface SitePostVisibilityPayload {
  is_visible: boolean;
}

type ResourceResponse<T> = { data: T };

const QUERY_KEY = ["site", "posts"] as const;

export async function fetchPosts(): Promise<SitePost[]> {
  const response = await api.get("site/posts").json<ResourceResponse<SitePost[]>>();
  return response.data;
}

export async function createPost(payload: SitePostPayload): Promise<SitePost> {
  const response = await api.post("site/posts", { json: payload }).json<ResourceResponse<SitePost>>();
  return response.data;
}

export async function updatePost(
  id: number,
  payload: Partial<SitePostPayload> | SitePostVisibilityPayload,
): Promise<SitePost> {
  const response = await api.put(`site/posts/${id}`, { json: payload }).json<ResourceResponse<SitePost>>();
  return response.data;
}

export async function deletePost(id: number): Promise<void> {
  await api.delete(`site/posts/${id}`);
}

export async function reorderPosts(items: { id: number; sort_order: number }[]): Promise<void> {
  await api.post("site/posts/reorder", { json: { items } });
}

export function usePosts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({ queryKey: QUERY_KEY, queryFn: fetchPosts });

  const create = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      toast({ title: "Post adicionado." });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: () => toast({ title: "Erro ao adicionar post", variant: "destructive" }),
  });

  const update = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<SitePostPayload> | SitePostVisibilityPayload;
    }) => updatePost(id, payload),
    onSuccess: () => {
      toast({ title: "Post atualizado." });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: () => toast({ title: "Erro ao atualizar post", variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      toast({ title: "Post removido." });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: () => toast({ title: "Erro ao remover post", variant: "destructive" }),
  });

  const reorder = useMutation({
    mutationFn: reorderPosts,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  return {
    posts: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
    create: create.mutateAsync,
    update: update.mutateAsync,
    remove: remove.mutateAsync,
    reorder: reorder.mutateAsync,
    isCreating: create.isPending,
    isUpdating: update.isPending,
    isRemoving: remove.isPending,
    isReordering: reorder.isPending,
  };
}
