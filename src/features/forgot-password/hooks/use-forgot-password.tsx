import { api } from "@/shared/configs/api";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface ForgotPasswordRequest {
  email: string;
}

interface ForgotPasswordResponse {
  status: string;
}

export async function forgotPasswordRequest(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
  try {
    return await api
      .post("forgot-password", {
        json: data,
      })
      .json<ForgotPasswordResponse>();
  } catch (error: unknown) {
    // Captura erros específicos da API
    if ((error as { response?: unknown }).response) {
      const errorData = await (error as { response: { json: () => Promise<{ email?: string; error?: string }> } }).response.json();
      throw new Error(errorData.email || errorData.error || "Erro ao enviar e-mail de recuperação");
    }
    throw new Error("Erro de conexão. Tente novamente.");
  }
}

export function useForgotPasswordMutation() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: forgotPasswordRequest,
    onSuccess: () => {
      toast({
        title: "E-mail enviado com sucesso",
        description: "Verifique sua caixa de entrada para as instruções de recuperação.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro ao enviar e-mail",
        description: error.message,
      });
      throw error;
    },
  });
}