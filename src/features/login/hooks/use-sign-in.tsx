import { api } from "@/shared/configs/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

// Interface para o erro da API
interface ApiError {
  response?: {
    status: number;
  };
  message?: string;
}

export default async function authenticateUser(credentials: {
  email: string;
  password: string;
}) {
  try {
    return await api
      .post("login", {
        json: {
          email: credentials.email,
          password: credentials.password,
        },
      })
      .json();
  } catch (error: unknown) {
    // Captura erros de API (como 401 Unauthorized)
    const apiError = error as ApiError;
    if (apiError.response && apiError.response.status === 401) {
      throw new Error("Credenciais inválidas. Verifique seu email e senha.");
    }
    throw error;
  }
}

function useSignInMutation() {
  return useMutation({
    mutationFn: authenticateUser,
    onSuccess: () => {
      toast({
        title: "Login realizado com sucesso",
        description: "Você foi autenticado com sucesso!",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao realizar login",
        description: error.message || "Houve um erro ao realizar o login, tente novamente.",
        variant: "destructive",
      });
      
      throw error;
    },
  });
}

export { useSignInMutation };
