import { api } from "@/shared/configs/api";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default async function authenticateUser(credentials: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  cpf: string;
}) {
  return await api
    .post("register", {
      json: {
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        password_confirmation: credentials.password_confirmation,
        phone: credentials.phone,
        cpfCnpj: credentials.cpf,
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
