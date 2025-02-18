"use client";

import { useSignInMutation } from "@/features/login/hooks/use-sign-in";
import { IAuthenticateUserDTO, IUserDTO } from "@/types/auth";
import { destroyCookie, setCookie } from "nookies";
import { useRouter } from "next/navigation";
import React, { createContext, useState, ReactNode } from "react";
import { useSignUpMutation } from "@/features/signup/hooks/use-sign-up";
import { useToast } from "@/hooks/use-toast";

interface AuthContextProps {
  user: IUserDTO | null;
  isAuthenticated: boolean;
  signin: (values: { email: string; password: string }) => Promise<void>;
  signup: (values: {
    email: string;
    password: string;
    password_confirmation: string;
    phone: string;
  }) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUserDTO | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const { mutateAsync: signInMutate } = useSignInMutation();
  const { mutateAsync: signUpMutate } = useSignUpMutation();

  const signin = async (values: { email: string; password: string }) => {
    setLoading(true);

    try {
      const userData = await signInMutate(values);
      setUser(userData as IUserDTO);
      setCookie(null, "token", (userData as IAuthenticateUserDTO).accessToken, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to sign in:", error);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (values: {
    email: string;
    password: string;
    password_confirmation: string;
    phone: string;
  }) => {
    setLoading(true);

    try {
      await signUpMutate(values);
      toast({
        variant: "default",
        title: "Cadastro realizado com sucesso!",
        description: "Você será redirecionado para a página de login.",
      });
      router.push("/login");
    } catch (error) {
      console.error("Failed to sign in:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log("aqui");
    destroyCookie(null, "token");
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
