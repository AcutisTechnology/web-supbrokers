"use client";

import { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "@/components/ui/masked-input";
import { SignupFormData, StepSharedProps } from "../signup-wizard";
import { useState } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { api } from "@/shared/configs/api";

interface PersonalDataStepProps extends StepSharedProps {
  form: UseFormReturn<SignupFormData>;
  onNext: () => void;
}

type CheckState = "idle" | "checking" | "available" | "taken" | "invalid";

export function PersonalDataStep({
  form,
  cpfAvailable,
  onCpfAvailableChange,
}: PersonalDataStepProps) {
  const { register, setValue, watch } = form;
  const phone = watch("phone");
  const cpf = watch("cpf");
  const username = watch("username");

  const [cpfState, setCpfState] = useState<CheckState>(
    cpfAvailable === true ? "available" : cpfAvailable === false ? "taken" : "idle"
  );
  const [cpfMessage, setCpfMessage] = useState<string | null>(null);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const sanitizedValue = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .replace(/^-+|-+$/g, "")
      .replace(/-{2,}/g, "-");
    setValue("username", sanitizedValue);
  };

  const handleCpfBlur = async () => {
    const rawCpf = (cpf ?? "").replace(/\D/g, "");
    if (rawCpf.length !== 11) {
      setCpfState("invalid");
      setCpfMessage("CPF deve ter 11 dígitos.");
      onCpfAvailableChange?.(false);
      return;
    }

    setCpfState("checking");
    setCpfMessage(null);

    try {
      const res = await api
        .get("check-unique", { searchParams: { field: "cpf", value: rawCpf } })
        .json<{ available: boolean; message?: string }>();

      if (res.available) {
        setCpfState("available");
        setCpfMessage(null);
        onCpfAvailableChange?.(true);
      } else {
        setCpfState("taken");
        setCpfMessage(res.message ?? "Este CPF já está cadastrado.");
        onCpfAvailableChange?.(false);
      }
    } catch {
      setCpfState("idle");
      setCpfMessage(null);
      onCpfAvailableChange?.(null);
    }
  };

  const cpfBorderClass =
    cpfState === "available"
      ? "border-green-500 focus:border-green-500"
      : cpfState === "taken" || cpfState === "invalid"
      ? "border-red-400 focus:border-red-500"
      : "border-[#D8D8D8] focus:border-[#9747FF]";

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-[#141414] font-display">
          Seus dados pessoais
        </h2>
        <p className="text-[#989898] text-sm">Informe seus dados para continuar</p>
      </div>

      <div className="space-y-4">
        {/* Nome completo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-2"
        >
          <label htmlFor="name" className="text-[#141414] text-sm font-medium">
            Nome Completo
          </label>
          <Input
            {...register("name")}
            id="name"
            type="text"
            placeholder="Seu nome completo"
            className="h-12 border-[#D8D8D8] focus:border-[#9747FF] focus:ring-[#9747FF]/20"
          />
        </motion.div>

        {/* Link do site */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="space-y-2"
        >
          <label htmlFor="username" className="text-[#141414] text-sm font-medium">
            Link do seu site
          </label>
          <div className="flex items-center h-12 border border-[#D8D8D8] rounded-md focus-within:border-[#9747FF] focus-within:ring-1 focus-within:ring-[#9747FF]/20 transition-colors">
            <span className="pl-3 text-[#989898] text-sm font-medium whitespace-nowrap mt-0.5">
              imoobile.com.br/
            </span>
            <input
              id="username"
              type="text"
              placeholder="seu-nome"
              value={username || ""}
              onChange={handleUsernameChange}
              className="flex-1 h-full bg-transparent border-0 outline-none text-sm"
            />
          </div>
          <p className="text-xs text-[#989898]">
            Este será o endereço público do seu site. Apenas letras, números e hífens. Máximo 30 caracteres.
          </p>
        </motion.div>

        {/* CPF */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="space-y-2"
        >
          <label htmlFor="cpf" className="text-[#141414] text-sm font-medium">
            CPF
          </label>
          <div className="relative">
            <MaskedInput
              id="cpf"
              mask="###.###.###-##"
              placeholder="000.000.000-00"
              required
              value={cpf}
              className={`h-12 pr-10 ${cpfBorderClass} focus:ring-[#9747FF]/20`}
              onChange={(value) => {
                setValue("cpf", value);
                if (cpfState !== "idle") {
                  setCpfState("idle");
                  onCpfAvailableChange?.(null);
                }
              }}
              onBlur={handleCpfBlur}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {cpfState === "checking" && (
                <Loader2 className="w-4 h-4 text-[#9747FF] animate-spin" />
              )}
              {cpfState === "available" && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
              {(cpfState === "taken" || cpfState === "invalid") && (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
            </div>
          </div>
          {cpfMessage ? (
            <p className="text-xs text-red-500">{cpfMessage}</p>
          ) : cpfState === "available" ? (
            <p className="text-xs text-green-600">CPF disponível.</p>
          ) : (
            <p className="text-xs text-[#989898]">Seu CPF será usado para identificação</p>
          )}
        </motion.div>

        {/* WhatsApp */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="space-y-2"
        >
          <label htmlFor="phone" className="text-[#141414] text-sm font-medium">
            WhatsApp
          </label>
          <MaskedInput
            id="phone"
            mask="(##) #####-####"
            placeholder="+55"
            required
            value={phone}
            className="h-12 border-[#D8D8D8] focus:border-[#9747FF] focus:ring-[#9747FF]/20"
            onChange={(value) => setValue("phone", value)}
          />
          <p className="text-xs text-[#989898]">Receba novidades antes de todos!</p>
        </motion.div>
      </div>
    </div>
  );
}
