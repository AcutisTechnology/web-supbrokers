"use client";

import { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { SignupFormData } from "../signup-wizard";
import { useState } from "react";

interface CredentialsStepProps {
  form: UseFormReturn<SignupFormData>;
  onNext: () => void;
}

export function CredentialsStep({ form }: CredentialsStepProps) {
  const { register, watch } = form;
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const password = watch('password');
  const passwordConfirmation = watch('password_confirmation');

  const passwordsMatch = password && passwordConfirmation && password === passwordConfirmation;
  const passwordValid = password && password.length >= 6;

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-2"
        >
          <label htmlFor="email" className="text-[#141414] text-sm font-medium">
            Email
          </label>
          <Input
            {...register("email")}
            id="email"
            type="email"
            placeholder="imoobile@email.com"
            className="h-12 border-[#D8D8D8] focus:border-[#9747FF] focus:ring-[#9747FF]/20"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="space-y-2"
        >
          <label htmlFor="password" className="text-[#141414] text-sm font-medium">
            Senha
          </label>
          <Input
            {...register("password")}
            id="password"
            type="password"
            placeholder="••••••••"
            className="h-12 border-[#D8D8D8] focus:border-[#9747FF] focus:ring-[#9747FF]/20"
          />
          <p className="text-xs text-[#989898]">
            A senha deve conter pelo menos 6 caracteres.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="space-y-2"
        >
          <label htmlFor="password_confirmation" className="text-[#141414] text-sm font-medium">
            Confirmar senha
          </label>
          <Input
            {...register("password_confirmation")}
            id="password_confirmation"
            type="password"
            placeholder="••••••••"
            className={`h-12 border-[#D8D8D8] focus:border-[#9747FF] focus:ring-[#9747FF]/20 ${
              passwordConfirmation && !passwordsMatch ? 'border-red-300 focus:border-red-500' : ''
            }`}
          />
          {passwordConfirmation && !passwordsMatch && (
            <p className="text-xs text-red-500">
              As senhas não coincidem
            </p>
          )}
        </motion.div>

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
              onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
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
        </motion.div>
      </div>
    </div>
  );
}