"use client";

import { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "@/components/ui/masked-input";
import { SignupFormData } from "../signup-wizard";

interface PersonalDataStepProps {
  form: UseFormReturn<SignupFormData>;
  onNext: () => void;
}

export function PersonalDataStep({ form }: PersonalDataStepProps) {
  const { register, setValue, watch } = form;
  const phone = watch('phone');
  const cpf = watch('cpf');
  const username = watch('username');

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove caracteres especiais, espaços e converte para lowercase
    // Permite apenas letras, números e hífens
    const sanitizedValue = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/^-+|-+$/g, '') // Remove hífens no início e fim
      .replace(/-{2,}/g, '-'); // Remove hífens consecutivos
    
    setValue('username', sanitizedValue);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-[#141414] font-display">
          Seus dados pessoais
        </h2>
        <p className="text-[#989898] text-sm">
          Informe seus dados para continuar
        </p>
      </div>

      <div className="space-y-4">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="space-y-2"
        >
          <label htmlFor="username" className="text-[#141414] text-sm font-medium">
            Nome de usuário
          </label>
          <div className="flex items-center h-12 border border-[#D8D8D8] rounded-md focus-within:border-[#9747FF] focus-within:ring-1 focus-within:ring-[#9747FF]/20 transition-colors">
            <span className="pl-3 text-[#989898] text-sm font-medium whitespace-nowrap mt-0.5">
              imoobile.com.br/
            </span>
            <input
              id="username"
              type="text"
              placeholder="seu-nome"
              value={username || ''}
              onChange={handleUsernameChange}
              className="flex-1 h-full bg-transparent border-0 outline-none text-sm"
            />
          </div>
          <p className="text-xs text-[#989898]">
            Apenas letras, números e hífens. Máximo 30 caracteres.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="space-y-2"
        >
          <label htmlFor="cpf" className="text-[#141414] text-sm font-medium">
            CPF
          </label>
          <MaskedInput
            id="cpf"
            mask="###.###.###-##"
            placeholder="000.000.000-00"
            required
            value={cpf}
            className="h-12 border-[#D8D8D8] focus:border-[#9747FF] focus:ring-[#9747FF]/20"
            onChange={(value) => setValue('cpf', value)}
          />
          <p className="text-xs text-[#989898]">
            Seu CPF será usado para identificação
          </p>
        </motion.div>

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
            onChange={(value) => setValue('phone', value)}
          />
          <p className="text-xs text-[#989898]">
            Receba novidades antes de todos!
          </p>
        </motion.div>
      </div>
    </div>
  );
}