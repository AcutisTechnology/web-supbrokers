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
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
}) {
  try {
    return await api
      .post("register", {
        json: {
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
          password_confirmation: credentials.password_confirmation,
          phone: credentials.phone,
        },
      })
      .json();
  } catch (error: unknown) {
    // Captura erros de API
    const apiError = error as ApiError;
    if (apiError.response && apiError.response.status === 422) {
      throw new Error("Dados inválidos. Verifique as informações fornecidas.");
    }
    throw error;
  }
}

function useSignUpMutation() {
  return useMutation({
    mutationFn: authenticateUser,
    onSuccess: () => {
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Sua conta foi criada com sucesso!",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao realizar cadastro",
        description: error.message || "Houve um erro ao realizar o cadastro, tente novamente.",
        variant: "destructive",
      });
      
      throw error;
    },
  });
}

export { useSignUpMutation };
