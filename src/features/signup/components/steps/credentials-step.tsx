"use client";

import { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { SignupFormData, StepSharedProps } from "../signup-wizard";
import { useState } from "react";
import { CheckCircle, XCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { api } from "@/shared/configs/api";

interface CredentialsStepProps extends StepSharedProps {
  form: UseFormReturn<SignupFormData>;
  onNext: () => void;
}

type CheckState = "idle" | "checking" | "available" | "taken" | "invalid";

export function CredentialsStep({
  form,
  agreedToTerms = false,
  onTermsChange,
  emailAvailable,
  onEmailAvailableChange,
  onEmailVerifiedChange,
}: CredentialsStepProps) {
  const { register, watch } = form;
  const password = watch("password");
  const passwordConfirmation = watch("password_confirmation");
  const email = watch("email");

  const [emailState, setEmailState] = useState<CheckState>(
    emailAvailable === true ? "available" : emailAvailable === false ? "taken" : "idle"
  );
  const [emailMessage, setEmailMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const passwordsMatch =
    password && passwordConfirmation && password === passwordConfirmation;

  const handleEmailBlur = async () => {
    const value = (email ?? "").trim();
    if (!value) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailState("invalid");
      setEmailMessage("E-mail inválido.");
      onEmailAvailableChange?.(false);
      return;
    }

    setEmailState("checking");
    setEmailMessage(null);

    try {
      const res = await api
        .get("check-unique", { searchParams: { field: "email", value } })
        .json<{ available: boolean; message?: string }>();

      if (res.available) {
        setEmailState("available");
        setEmailMessage(null);
        onEmailAvailableChange?.(true);
      } else {
        setEmailState("taken");
        setEmailMessage(res.message ?? "Este e-mail já está cadastrado.");
        onEmailAvailableChange?.(false);
      }
    } catch {
      setEmailState("idle");
      setEmailMessage(null);
      onEmailAvailableChange?.(null);
    }
  };

  const emailBorderClass =
    emailState === "available"
      ? "border-green-500 focus:border-green-500"
      : emailState === "taken" || emailState === "invalid"
      ? "border-red-400 focus:border-red-500"
      : "border-[#D8D8D8] focus:border-[#9747FF]";

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-[#141414] font-display">
          Suas credenciais de acesso
        </h2>
        <p className="text-[#989898] text-sm">
          Crie seu email e senha para acessar a plataforma
        </p>
      </div>

      <div className="space-y-4">
        {/* Email */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-2"
        >
          <label htmlFor="email" className="text-[#141414] text-sm font-medium">
            Email
          </label>
          <div className="relative">
            <Input
              {...register("email", {
                onChange: () => {
                  // Trocar o e-mail invalida a verificação anterior.
                  onEmailVerifiedChange?.(false);
                  if (emailState !== "idle") {
                    setEmailState("idle");
                    onEmailAvailableChange?.(null);
                  }
                },
              })}
              id="email"
              type="email"
              placeholder="imoobile@email.com"
              onBlur={handleEmailBlur}
              className={`h-12 pr-10 ${emailBorderClass} focus:ring-[#9747FF]/20`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {emailState === "checking" && (
                <Loader2 className="w-4 h-4 text-[#9747FF] animate-spin" />
              )}
              {emailState === "available" && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
              {(emailState === "taken" || emailState === "invalid") && (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
            </div>
          </div>
          {emailMessage ? (
            <p className="text-xs text-red-500">{emailMessage}</p>
          ) : emailState === "available" ? (
            <p className="text-xs text-green-600">E-mail disponível.</p>
          ) : null}
        </motion.div>

        {/* Senha */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="space-y-2"
        >
          <label htmlFor="password" className="text-[#141414] text-sm font-medium">
            Senha
          </label>
          <div className="relative">
            <Input
              {...register("password")}
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="h-12 pr-10 border-[#D8D8D8] focus:border-[#9747FF] focus:ring-[#9747FF]/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#989898] hover:text-[#141414] transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-[#989898]">
            A senha deve conter pelo menos 8 caracteres.
          </p>
        </motion.div>

        {/* Confirmar senha */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="space-y-2"
        >
          <label
            htmlFor="password_confirmation"
            className="text-[#141414] text-sm font-medium"
          >
            Confirmar senha
          </label>
          <div className="relative">
            <Input
              {...register("password_confirmation")}
              id="password_confirmation"
              type={showPasswordConfirmation ? "text" : "password"}
              placeholder="••••••••"
              className={`h-12 pr-10 border-[#D8D8D8] focus:border-[#9747FF] focus:ring-[#9747FF]/20 ${
                passwordConfirmation && !passwordsMatch
                  ? "border-red-300 focus:border-red-500"
                  : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPasswordConfirmation((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#989898] hover:text-[#141414] transition-colors"
              tabIndex={-1}
            >
              {showPasswordConfirmation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {passwordConfirmation && !passwordsMatch && (
            <p className="text-xs text-red-500">As senhas não coincidem</p>
          )}
        </motion.div>

        {/* Termos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="space-y-4"
        >
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => onTermsChange?.(checked as boolean)}
              className="mt-1"
            />
            <label htmlFor="terms" className="text-sm text-[#989898] leading-relaxed">
              Eu li e concordo com os{" "}
              <Link href="#" className="text-[#9747FF] hover:underline font-medium">
                Termos de Uso
              </Link>{" "}
              e{" "}
              <Link href="#" className="text-[#9747FF] hover:underline font-medium">
                Políticas de Privacidade
              </Link>
            </label>
          </div>
          {!agreedToTerms && (
            <p className="text-xs text-[#989898]">
              Você precisa aceitar os termos para continuar.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
