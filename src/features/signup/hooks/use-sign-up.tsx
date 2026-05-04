import { api } from "@/shared/configs/api";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { HTTPError } from "ky";

interface ValidationErrorResponse {
  message?: string;
  data?: Record<string, string[]>;
}

const getSignupErrorMessage = async (error: unknown) => {
  if (!(error instanceof HTTPError)) {
    return "Houve um erro ao realizar o cadastro. Tente novamente.";
  }

  let payload: ValidationErrorResponse | undefined;

  try {
    payload = (await error.response.clone().json()) as ValidationErrorResponse;
  } catch {
    return "Houve um erro ao realizar o cadastro. Tente novamente.";
  }

  const firstValidationMessage = payload?.data
    ? Object.values(payload.data).flat().find(Boolean)
    : undefined;

  return firstValidationMessage || payload?.message || "Houve um erro ao realizar o cadastro. Tente novamente.";
};

export default async function authenticateUser(credentials: {
  name: string;
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  cpf: string;
  discovery_source: string;
  user_type: string;
}) {
  return await api
    .post("register", {
      json: {
        name: credentials.name,
        username: credentials.username,
        email: credentials.email,
        password: credentials.password,
        password_confirmation: credentials.password_confirmation,
        phone: credentials.phone,
        cpfCnpj: credentials.cpf,
        discovery_source: credentials.discovery_source,
        user_type: credentials.user_type,
      },
    })
    .json()
}

function useSignUpMutation() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: authenticateUser,
    onSuccess: () => {
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Sua conta foi criada com sucesso!",
      });
    },
    onError: async (error: unknown) => {
      const description = await getSignupErrorMessage(error);

      toast({
        variant: "destructive",
        title: "Erro ao realizar cadastro",
        description,
      });
    },
  });
}

export { useSignUpMutation };
