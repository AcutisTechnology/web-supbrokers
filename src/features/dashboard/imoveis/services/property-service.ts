import { PropertyFormValues } from "../novo/schemas/property-schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/shared/configs/api";
import { useToast } from "@/hooks/use-toast"
import { PROPERTY_CHARACTERISTICS_LABELS } from "@/lib/property";

// Interface para os dados de um imóvel
export interface Property {
  id: number;
  title: string;
  description: string;
  slug: string;
  property_type: string | null;
  street: string;
  neighborhood: string;
  city: string | null;
  state: string | null;
  zipcode: string | null;
  complement?: string;
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
  condominium_value: string;
  code: string;
  qr_code: string;
  active: boolean;
  highlighted: boolean;
  characteristics: { text: string }[];
  attachments: { name: string; url: string }[];
  created_at: string;
}

// Interface para a resposta da API ao criar um imóvel
export interface PropertyResponse {
  data: Property;
  message?: string;
}

// Interface para a resposta paginada da API
export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export type PropertiesFilters = {
  search?: string;
  neighborhood?: { id: number | null; name: string };
  city?: { id: number | null; name: string };
  min_value?: number | null;
  max_value?: number | null;
  min_size?: number | null;
  max_size?: number | null;
};

const buildFiltersQuery = (filters?: PropertiesFilters): string => {
  if (!filters) return "";

  const params = new URLSearchParams();

  const search = filters.search?.trim();
  if (search) params.set("search", search);

  // O modelo Property armazena cidade e bairro como texto simples (sem FK),
  // portanto sempre enviamos o nome para busca LIKE no backend.
  const cityName = filters.city?.name?.trim();
  if (cityName) params.set("city_search", cityName);

  const neighborhoodName = filters.neighborhood?.name?.trim();
  if (neighborhoodName) params.set("neighborhood_search", neighborhoodName);

  if (filters.min_value != null) params.set("min_value", String(filters.min_value));
  if (filters.max_value != null) params.set("max_value", String(filters.max_value));
  if (filters.min_size != null) params.set("min_size", String(filters.min_size));
  if (filters.max_size != null) params.set("max_size", String(filters.max_size));

  const qs = params.toString();
  return qs ? `&${qs}` : "";
};

// Hook para buscar imóveis com paginação
export function useProperties(page = 1, filters?: PropertiesFilters) {
  const filtersQuery = buildFiltersQuery(filters);

  return useQuery({
    queryKey: ["properties", page, filters ?? {}],
    queryFn: async () => {
      const response = await api
        .get(`properties?page=${page}${filtersQuery}`)
        .json<PaginatedResponse<Property>>();
      return response;
    },
  });
}

// Hook para buscar um imóvel específico pelo slug
export function useProperty(slug: string) {
  return useQuery({
    queryKey: ["property", slug],
    queryFn: async () => {
      // A API retorna os dados do imóvel dentro de um objeto 'data'
      const response = await api
        .get(`properties/${slug}`)
        .json<{ data: Property }>();
      return response;
    },
    enabled: !!slug,
  });
}

export function useCreateProperty() {
  const { toast } = useToast();

  return useMutation<PropertyResponse, Error, PropertyFormValues>({
    mutationFn: async (data: PropertyFormValues) => {
      try {
        // Criar um FormData para enviar arquivos
        const formData = new FormData();

        // Adicionar todos os campos de texto ao FormData
        Object.entries(data).forEach(([key, value]) => {
          if (
            key !== "attachments" &&
            key !== "characteristics" &&
            key !== "purpose" &&
            value !== undefined &&
            value !== null
          ) {
            formData.append(key, String(value));
          }
        });

        if (data.characteristics && data.characteristics.length > 0) {
          data.characteristics.forEach((characteristic, index) => {
            const label = PROPERTY_CHARACTERISTICS_LABELS[characteristic] ?? characteristic;
            formData.append(`characteristics[${index}][text]`, label);
          });
        } else {
          formData.append("characteristics[0][text]", "");
        }

        // Adicionar imagens (máximo 5) - apenas novos arquivos
        if (data.attachments && Array.isArray(data.attachments)) {
          const newFiles = data.attachments.filter(
            (a): a is File => a instanceof File
          );
          newFiles.slice(0, 5).forEach((file) => {
            formData.append("attachments[]", file);
          });
        }

        const response = await api
          .post("properties", {
            body: formData,
          })
          .json<PropertyResponse>();

        return response;
      } catch (error) {
        console.error("Erro ao criar imóvel:", error);
        toast({
          title: "Erro ao criar imóvel",
          description: "Ocorreu um erro ao criar o imóvel. Tente novamente.",
          variant: "destructive",
        })
        throw error;
      }
    },
  });
}

// Hook para atualizar um imóvel existente
export function useUpdateProperty() {
  return useMutation({
    mutationFn: async ({
      slug,
      data,
    }: {
      slug: string;
      data: PropertyFormValues;
    }) => {
      try {
        // Criar um FormData para enviar arquivos
        const formData = new FormData();

        // Adicionar todos os campos de texto ao FormData
        Object.entries(data).forEach(([key, value]) => {
          if (
            key !== "attachments" &&
            key !== "characteristics" &&
            key !== "purpose" &&
            value !== undefined &&
            value !== null
          ) {
            formData.append(key, String(value));
          }
        });

        // Adicionar características no formato correto com o campo "text"
        if (data.characteristics && data.characteristics.length > 0) {
          data.characteristics.forEach((characteristic, index) => {
            formData.append(`characteristics[${index}][text]`, characteristic);
          });
        } else {
          // Garantir que pelo menos uma característica vazia seja enviada
          formData.append("characteristics[0][text]", "");
        }

        // Adicionar imagens (máximo 5) - apenas novos arquivos.
        // Anexos já existentes vêm como objetos { url, ... } e são preservados
        // no backend, portanto não devem ser reenviados.
        if (data.attachments && Array.isArray(data.attachments)) {
          const newFiles = data.attachments.filter(
            (a): a is File => a instanceof File
          );
          newFiles.slice(0, 5).forEach((file) => {
            formData.append("attachments[]", file);
          });
        }

        // Para debug - mostrar o conteúdo do FormData
        console.log("FormData enviado para atualização:");
        for (const pair of formData.entries()) {
          console.log(pair[0], pair[1]);
        }

        // Adicionar método _method para simular PUT
        formData.append("_method", "PUT");

        const response = await api
          .post(`properties/${slug}`, {
            body: formData,
          })
          .json();

        return response;
      } catch (error) {
        console.error("Erro ao atualizar imóvel:", error);
        throw error;
      }
    },
  });
}

// Hook para excluir um imóvel
export function useDeleteProperty() {
  return useMutation({
    mutationFn: async (slug: string) => {
      try {
        const formData = new FormData();
        formData.append("_method", "DELETE");

        const response = await api
          .post(`properties/${slug}`, {
            body: formData,
          })
          .json();

        return response;
      } catch (error) {
        console.error("Erro ao excluir imóvel:", error);
        throw error;
      }
    },
  });
}
