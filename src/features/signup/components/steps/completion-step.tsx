"use client";

import { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";
import { CheckCircle, Sparkles, ArrowRight } from "lucide-react";
import { SignupFormData } from "../signup-wizard";

interface CompletionStepProps {
  form: UseFormReturn<SignupFormData>;
  onNext: () => void;
}

export function CompletionStep({ form }: CompletionStepProps) {
  const name = form.watch('name');
  const userType = form.watch('userType');

  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case 'corretor':
        return 'Corretor';
      case 'imobiliaria':
        return 'Imobiliária';
      case 'construtora':
        return 'Construtora';
      default:
        return 'Usuário';
    }
  };

  return (
    <div className="space-y-6 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
        className="flex justify-center"
      >
        <div className="relative">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="w-6 h-6 text-[#9747FF]" />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-3"
      >
        <h2 className="text-2xl font-bold text-[#141414] font-display">
          Tudo pronto, {name?.split(' ')[0]}! 🎉
        </h2>
        <p className="text-[#989898] text-sm leading-relaxed">
          Sua conta como <span className="font-medium text-[#9747FF]">{getUserTypeLabel(userType)}</span> foi criada com sucesso.
          <br />
          Você já pode começar a usar todas as funcionalidades do iMoobile!
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gradient-to-r from-[#9747FF]/10 to-[#9747FF]/5 rounded-xl p-6 space-y-4"
      >
        <h3 className="font-semibold text-[#141414] text-lg">
          Próximos passos:
        </h3>
        <div className="space-y-3 text-left">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-[#9747FF] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">1</span>
            </div>
            <p className="text-sm text-[#989898]">
              Complete seu perfil com mais informações
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-[#9747FF] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">2</span>
            </div>
            <p className="text-sm text-[#989898]">
              Adicione seus primeiros imóveis
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-[#9747FF] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">3</span>
            </div>
            <p className="text-sm text-[#989898]">
              Explore todas as funcionalidades da plataforma
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="pt-4"
      >
        <p className="text-xs text-[#989898]">
          Você receberá um email de confirmação em breve.
        </p>
      </motion.div>
    </div>
  );
}