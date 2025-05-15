import { PropertyFormValues } from "../novo/schemas/property-schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/shared/configs/api";
import { useToast } from "@/hooks/use-toast"

// Interface para os dados de um imóvel
export interface Property {
  title: string;
  description: string;
  slug: string;
  street: string;
  neighborhood: string;
  size: number;
  bedrooms: number;
  garages: number;
  rent: boolean;
  sale: boolean;
  value: string;
  iptu_value: string;
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

// Hook para buscar imóveis com paginação
export function useProperties(page = 1) {
  return useQuery({
    queryKey: ["properties", page],
    queryFn: async () => {
      const response = await api
        .get(`properties?page=${page}`)
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

        // Adicionar características no formato correto com o campo "text"
        if (data.characteristics && data.characteristics.length > 0) {
          data.characteristics.forEach((characteristic, index) => {
            // Garantir que não haja problemas de codificação
            formData.append(`characteristics[${index}][text]`, characteristic);
          });
        } else {
          // Garantir que pelo menos uma característica vazia seja enviada
          formData.append("characteristics[0][text]", "");
        }

        // Adicionar imagens (máximo 5)
        if (data.attachments && Array.isArray(data.attachments) && data.attachments.length > 0) {
          // Garantir o máximo de 5 arquivos
          const limitedAttachments = data.attachments.slice(0, 5);
          limitedAttachments.forEach((attachment) => {
            formData.append("attachments[]", attachment);
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

        // Adicionar imagens (máximo 5)
        if (data.attachments && Array.isArray(data.attachments) && data.attachments.length > 0) {
          // Garantir o máximo de 5 arquivos
          const limitedAttachments = data.attachments.slice(0, 5);
          limitedAttachments.forEach((attachment) => {
            formData.append("attachments[]", attachment);
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
