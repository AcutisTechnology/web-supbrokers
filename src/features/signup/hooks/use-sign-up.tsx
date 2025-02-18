import { api } from "@/shared/configs/api";
import { useMutation } from "@tanstack/react-query";

export default async function authenticateUser(credentials: {
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
}) {
  return await api
    .post("register", {
      json: {
        email: credentials.email,
        password: credentials.password,
        password_confirmation: credentials.password_confirmation,
        phone: credentials.phone,
      },
    })
    .json();
}

function useSignUpMutation() {
  return useMutation({
    mutationFn: authenticateUser,
    onError: () => {
      throw new Error("Houve um erro ao realizar o cadastro, tente novamente.");
    },
  });
}

export { useSignUpMutation };
