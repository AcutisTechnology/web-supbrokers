import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/shared/configs/api";

// Interface para os dados do perfil
export interface ProfileData {
  id: number;
  name: string | null;
  email: string;
  phone: string;
  email_verified_at: string | null;
  users: []; // Podemos tipar melhor se soubermos a estrutura
}

// Interface para a resposta da API
export interface ProfileResponse {
  data: ProfileData;
  success: boolean;
}

// Hook para buscar os dados do perfil
export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await api.get("profile").json<ProfileResponse>();
      return response;
    },
  });
}

// Interface para os dados de atualização do perfil
export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  password_confirmation?: string;
}

// Hook para atualizar os dados do perfil
export function useUpdateProfile() {
  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      const response = await api
        .put("profile", { json: data })
        .json<ProfileResponse>();
      return response;
    },
  });
}
