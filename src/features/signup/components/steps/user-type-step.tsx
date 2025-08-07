"use client";

import { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";
import { Building, User, Building2 } from "lucide-react";
import { SignupFormData } from "../signup-wizard";

interface UserTypeStepProps {
  form: UseFormReturn<SignupFormData>;
  onNext: () => void;
}

const USER_TYPES = [
  {
    id: 'corretor' as const,
    title: 'Corretor',
    description: 'Profissional autônomo',
    icon: User,
  },
  {
    id: 'imobiliaria' as const,
    title: 'Imobiliária',
    description: 'Empresa do setor imobiliário',
    icon: Building,
  },
  {
    id: 'construtora' as const,
    title: 'Construtora ou Incorporadora',
    description: 'Empresa de construção',
    icon: Building2,
  },
];

export function UserTypeStep({ form, onNext }: UserTypeStepProps) {
  const selectedType = form.watch('userType');

  const handleSelect = (type: 'corretor' | 'imobiliaria' | 'construtora') => {
    form.setValue('userType', type);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-[#141414] font-display">
          Como você vai usar o Imoobile?
        </h2>
        <p className="text-[#989898] text-sm">
          Selecione a opção que melhor descreve seu perfil
        </p>
      </div>

      <div className="space-y-3">
        {USER_TYPES.map((type, index) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          
          return (
            <motion.button
              key={type.id}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => handleSelect(type.id)}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left group hover:scale-[1.02] ${
                isSelected
                  ? 'border-[#9747FF] bg-[#9747FF]/5 shadow-lg'
                  : 'border-[#E5E5E5] bg-white hover:border-[#9747FF]/30 hover:bg-[#9747FF]/2'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`p-3 rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-[#9747FF] text-white'
                      : 'bg-gray-100 text-gray-600 group-hover:bg-[#9747FF]/10 group-hover:text-[#9747FF]'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-medium transition-colors ${
                      isSelected ? 'text-[#9747FF]' : 'text-[#141414]'
                    }`}
                  >
                    {type.title}
                  </h3>
                  <p className="text-sm text-[#989898] mt-1">
                    {type.description}
                  </p>
                </div>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 bg-[#9747FF] rounded-full flex items-center justify-center"
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}