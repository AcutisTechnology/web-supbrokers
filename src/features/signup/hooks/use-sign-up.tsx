import { api } from "@/shared/configs/api";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

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
    onError: (error: unknown) => {
      toast({
        variant: "destructive",
        title: "Erro ao realizar cadastro",
        description: "Talvez o CPF ou e-mail já estejam cadastrados.",
      });
    },
  });
}

export { useSignUpMutation };
