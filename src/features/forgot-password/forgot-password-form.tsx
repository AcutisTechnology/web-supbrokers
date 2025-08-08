"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useForgotPasswordMutation } from "./hooks/use-forgot-password";
import { CheckCircle, Mail } from "lucide-react";

interface ForgotPasswordFormData {
  email: string;
}

export function ForgotPasswordForm() {
  const [emailSent, setEmailSent] = useState(false);
  const { mutateAsync: forgotPassword, isPending } = useForgotPasswordMutation();

  const {
    handleSubmit,
    formState: { errors },
    register,
    getValues,
  } = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: "",
    },
  });

  async function handleForgotPassword(data: ForgotPasswordFormData) {
    try {
      await forgotPassword(data);
      setEmailSent(true);
    } catch (error) {
      // O erro já é tratado no hook
    }
  }

  if (emailSent) {
    return (
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-medium text-[#141414]">E-mail enviado!</h2>
          <p className="text-[#969696] text-sm">
            Enviamos as instruções de recuperação para{" "}
            <span className="font-medium text-[#141414]">{getValues("email")}</span>
          </p>
          <p className="text-[#969696] text-xs">
            Verifique sua caixa de entrada e spam. O link expira em 60 minutos.
          </p>
        </div>
        <Button
          onClick={() => setEmailSent(false)}
          variant="ghost"
          className="text-[#9747ff] hover:bg-[#f2e8ff]"
        >
          Enviar para outro e-mail
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleForgotPassword)} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-[#141414]"
        >
          E-mail
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#969696]" />
          <Input
            {...register("email", {
              required: "E-mail é obrigatório",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "E-mail inválido",
              },
            })}
            id="email"
            type="email"
            placeholder="seuemail@voce.com"
            className="w-full pl-10 pr-3 py-2 border border-[#d8d8d8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9747ff]"
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-[#9747ff] hover:bg-[#9747ff]/90 text-white py-3 rounded-lg font-medium"
      >
        {isPending ? "Enviando..." : "Enviar instruções"}
      </Button>
    </form>
  );
}