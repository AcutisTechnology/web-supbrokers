"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useResetPasswordMutation } from "./hooks/use-reset-password";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Eye, EyeOff, Lock } from "lucide-react";
import Link from "next/link";

interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

export function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const { mutateAsync: resetPassword, isPending } = useResetPasswordMutation();

  const {
    handleSubmit,
    formState: { errors },
    register,
    watch,
  } = useForm<ResetPasswordFormData>({
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  const password = watch("password");
  const passwordConfirmation = watch("password_confirmation");

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    const emailParam = searchParams.get("email");
    
    if (!tokenParam || !emailParam) {
      router.push("/forgot-password");
      return;
    }
    
    setToken(tokenParam);
    setEmail(emailParam);
  }, [searchParams, router]);

  async function handleResetPassword(data: ResetPasswordFormData) {
    if (!token || !email) {
      return;
    }

    try {
      await resetPassword({
        token,
        email,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });
      setPasswordReset(true);
    } catch (error) {
      // O erro já é tratado no hook
    }
  }

  if (passwordReset) {
    return (
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-medium text-[#141414]">Senha redefinida!</h2>
          <p className="text-[#969696] text-sm">
            Sua senha foi alterada com sucesso. Agora você pode fazer login com sua nova senha.
          </p>
        </div>
        <Button
          asChild
          className="w-full bg-[#9747ff] hover:bg-[#9747ff]/90 text-white py-3 rounded-lg font-medium"
        >
          <Link href="/login">Fazer login</Link>
        </Button>
      </div>
    );
  }

  if (!token || !email) {
    return (
      <div className="text-center space-y-4">
        <p className="text-[#969696] text-sm">
          Link inválido ou expirado. Solicite um novo link de recuperação.
        </p>
        <Button
          asChild
          className="w-full bg-[#9747ff] hover:bg-[#9747ff]/90 text-white py-3 rounded-lg font-medium"
        >
          <Link href="/forgot-password">Solicitar novo link</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-[#141414]"
        >
          Nova senha
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#969696]" />
          <Input
            {...register("password", {
              required: "Senha é obrigatória",
              minLength: {
                value: 8,
                message: "Senha deve ter pelo menos 8 caracteres",
              },
            })}
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Digite sua nova senha"
            className="w-full pl-10 pr-10 py-2 border border-[#d8d8d8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9747ff]"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#969696] hover:text-[#141414]"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password_confirmation"
          className="block text-sm font-medium text-[#141414]"
        >
          Confirmar nova senha
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#969696]" />
          <Input
            {...register("password_confirmation", {
              required: "Confirmação de senha é obrigatória",
              validate: (value) =>
                value === password || "As senhas não coincidem",
            })}
            id="password_confirmation"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirme sua nova senha"
            className="w-full pl-10 pr-10 py-2 border border-[#d8d8d8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9747ff]"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#969696] hover:text-[#141414]"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password_confirmation && (
          <p className="text-red-500 text-xs">{errors.password_confirmation.message}</p>
        )}
      </div>

      {/* Indicador de força da senha */}
      {password && (
        <div className="space-y-1">
          <div className="text-xs text-[#969696]">Força da senha:</div>
          <div className="flex space-x-1">
            <div
              className={`h-1 flex-1 rounded ${
                password.length >= 8 ? "bg-green-500" : "bg-gray-200"
              }`}
            />
            <div
              className={`h-1 flex-1 rounded ${
                password.length >= 8 && /[A-Z]/.test(password)
                  ? "bg-green-500"
                  : "bg-gray-200"
              }`}
            />
            <div
              className={`h-1 flex-1 rounded ${
                password.length >= 8 &&
                /[A-Z]/.test(password) &&
                /[0-9]/.test(password)
                  ? "bg-green-500"
                  : "bg-gray-200"
              }`}
            />
          </div>
          <div className="text-xs text-[#969696]">
            Use pelo menos 8 caracteres com letras maiúsculas e números
          </div>
        </div>
      )}

      <Button
        type="submit"
        disabled={isPending || password !== passwordConfirmation}
        className="w-full bg-[#9747ff] hover:bg-[#9747ff]/90 text-white py-3 rounded-lg font-medium disabled:opacity-50"
      >
        {isPending ? "Redefinindo..." : "Redefinir senha"}
      </Button>
    </form>
  );
}