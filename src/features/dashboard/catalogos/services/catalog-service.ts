import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/configs/api";
import { useToast } from "@/hooks/use-toast";
import {
  Catalog,
  CreateCatalogRequest,
  UpdateCatalogRequest,
  CatalogWithProperties,
  PaginatedCatalogResponse,
  CatalogProperty
} from "../types/catalog";

// Hook para buscar todos os catálogos
export function useCatalogs(page = 1) {
  return useQuery({
    queryKey: ["catalogs", page],
    queryFn: async () => {
      const response = await api
        .get(`catalogs?page=${page}`)
        .json<PaginatedCatalogResponse>();
      return response;
    },
  });
}

// Hook para buscar um catálogo específico
export function useCatalog(id: string) {
  return useQuery({
    queryKey: ["catalog", id],
    queryFn: async () => {
      const response = await api
        .get(`catalogs/${id}`)
        .json<{ data: CatalogWithProperties }>();
      return response;
    },
    enabled: !!id,
  });
}

// Hook para criar um novo catálogo
export function useCreateCatalog() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<{ data: Catalog }, Error, CreateCatalogRequest>({
    mutationFn: async (data: CreateCatalogRequest) => {
      const response = await api
        .post("catalogs", {
          json: data,
        })
        .json<{ data: Catalog }>();
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogs"] });
      toast({
        title: "Catálogo criado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar catálogo",
        description: "Ocorreu um erro ao criar o catálogo. Tente novamente.",
        variant: "destructive",
      });
    },
  });
}

// Hook para atualizar um catálogo
export function useUpdateCatalog() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<{ data: Catalog }, Error, { id: string; data: UpdateCatalogRequest }>({
    mutationFn: async ({ id, data }) => {
      const response = await api
        .put(`catalogs/${id}`, {
          json: data,
        })
        .json<{ data: Catalog }>();
      return response;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["catalogs"] });
      queryClient.invalidateQueries({ queryKey: ["catalog", id] });
      toast({
        title: "Catálogo atualizado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar catálogo",
        description: "Ocorreu um erro ao atualizar o catálogo. Tente novamente.",
        variant: "destructive",
      });
    },
  });
}

// Hook para excluir um catálogo
export function useDeleteCatalog() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await api.delete(`catalogs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogs"] });
      toast({
        title: "Catálogo excluído com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir catálogo",
        description: "Ocorreu um erro ao excluir o catálogo. Tente novamente.",
        variant: "destructive",
      });
    },
  });
}

// Hook para adicionar imóvel ao catálogo
export function useAddPropertyToCatalog() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { catalogId: string; propertyId: string }>({
    mutationFn: async ({ catalogId, propertyId }) => {
      await api.post(`catalogs/${catalogId}/properties`, {
        json: { property_id: propertyId },
      });
    },
    onSuccess: (_, { catalogId }) => {
      queryClient.invalidateQueries({ queryKey: ["catalog", catalogId] });
      queryClient.invalidateQueries({ queryKey: ["catalogs"] });
      toast({
        title: "Imóvel adicionado ao catálogo!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao adicionar imóvel",
        description: "Ocorreu um erro ao adicionar o imóvel ao catálogo.",
        variant: "destructive",
      });
    },
  });
}

// Hook para remover imóvel do catálogo
export function useRemovePropertyFromCatalog() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { catalogId: string; propertyId: string }>({
    mutationFn: async ({ catalogId, propertyId }) => {
      await api.delete(`catalogs/${catalogId}/properties/${propertyId}`);
    },
    onSuccess: (_, { catalogId }) => {
      queryClient.invalidateQueries({ queryKey: ["catalog", catalogId] });
      queryClient.invalidateQueries({ queryKey: ["catalogs"] });
      toast({
        title: "Imóvel removido do catálogo!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao remover imóvel",
        description: "Ocorreu um erro ao remover o imóvel do catálogo.",
        variant: "destructive",
      });
    },
  });
}