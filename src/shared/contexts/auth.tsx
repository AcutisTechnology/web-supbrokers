"use client";

import { useSignInMutation } from "@/features/login/hooks/use-sign-in";
import { IAuthenticateUserDTO, IUserDTO } from "@/types/auth";
import { destroyCookie, setCookie } from "nookies";
import { useRouter } from "next/navigation";
import React, { createContext, useState, ReactNode, useEffect } from "react";
import { useSignUpMutation } from "@/features/signup/hooks/use-sign-up";
import { useToast } from "@/hooks/use-toast";

interface AuthContextProps {
  user: { user: IUserDTO } | null;
  isAuthenticated: boolean;
  signin: (values: { email: string; password: string }) => Promise<void>;
  signup: (values: {
    name: string;
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone: string;
    cpf: string;
    discovery_source: string;
    user_type: string;
  }) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ user: IUserDTO } | null>(null);
  const [loading, setLoading] = useState(true); // Começa como true para indicar o carregamento inicial

  const router = useRouter();
  const { toast } = useToast();

  const { mutateAsync: signInMutate } = useSignInMutation();
  const { mutateAsync: signUpMutate } = useSignUpMutation();

  // Carrega os dados do usuário do localStorage quando o componente monta
  useEffect(() => {
    const storedUser = localStorage.getItem('@SupBrokers:user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signin = async (values: { email: string; password: string }) => {
    setLoading(true);

    try {
      const userData = await signInMutate(values);
      // Salva o token nos cookies
      setCookie(null, "token", (userData as IAuthenticateUserDTO).accessToken, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
      });

      // Salva os dados do usuário no localStorage
      localStorage.setItem('@SupBrokers:user', JSON.stringify(userData));
      setUser(userData as { user: IUserDTO });

      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: "Verifique suas credenciais e tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const signup = async (values: {
    name: string;
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone: string;
    cpf: string;
    discovery_source: string;
    user_type: string;
  }) => {
    setLoading(true);
    try {
      await signUpMutate(values);
      router.push("/login");
    } catch (error) {
      console.log(error)
      setLoading(false);
      throw error; // Re-throw the error so it can be caught in the component
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    destroyCookie(null, "token");
    localStorage.removeItem('@SupBrokers:user');
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        signin,
        signup,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
