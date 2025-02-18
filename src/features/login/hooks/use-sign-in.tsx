import { api } from "@/shared/configs/api";
import { useMutation } from "@tanstack/react-query";

export default async function authenticateUser(credentials: {
  email: string;
  password: string;
}) {
  return await api
    .post("login", {
      json: {
        email: credentials.email,
        password: credentials.password,
      },
    })
    .json();
}

function useSignInMutation() {
  return useMutation({
    mutationFn: authenticateUser,
    onError: () => {
      throw new Error("Houve um erro ao realizar o login, tente novamente.");
    },
  });
}

export { useSignInMutation };
