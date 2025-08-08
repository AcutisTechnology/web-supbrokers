import { api } from "@/shared/configs/api";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface ResetPasswordRequest {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface ResetPasswordResponse {
  status: string;
}

export async function resetPasswordRequest(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
  try {
    return await api
      .post("reset-password", {
        json: data,
      })
      .json<ResetPasswordResponse>();
  } catch (error: unknown) {
    // Captura erros específicos da API
    if ((error as { response?: unknown }).response) {
      const errorData = await (error as { response: { json: () => Promise<{ email?: string; error?: string }> } }).response.json();
      throw new Error(errorData.email || errorData.error || "Erro ao redefinir senha");
    }
    throw new Error("Erro de conexão. Tente novamente.");
  }
}

export function useResetPasswordMutation() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: resetPasswordRequest,
    onSuccess: () => {
      toast({
        title: "Senha redefinida com sucesso",
        description: "Sua senha foi alterada. Agora você pode fazer login.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro ao redefinir senha",
        description: error.message,
      });
      throw error;
    },
  });
}