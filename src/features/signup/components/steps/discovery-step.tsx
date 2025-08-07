"use client";

import { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SignupFormData } from "../signup-wizard";

interface DiscoveryStepProps {
  form: UseFormReturn<SignupFormData>;
  onNext: () => void;
}

const DISCOVERY_OPTIONS = [
  { value: 'google', label: 'Pesquisa no Google' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'indicacao', label: 'Indicação de amigo/colega' },
  { value: 'evento', label: 'Evento do setor' },
  { value: 'blog', label: 'Blog ou artigo' },
  { value: 'podcast', label: 'Podcast' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'outro', label: 'Outro' },
];

export function DiscoveryStep({ form }: DiscoveryStepProps) {
  const { setValue, watch } = form;
  const discoverySource = watch('discoverySource');

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-[#141414] font-display">
          Como você ficou sabendo do Imoobile?
        </h2>
        <p className="text-[#989898] text-sm">
          Nos ajude a entender como você nos encontrou
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="space-y-2"
      >
        <label className="text-[#141414] text-sm font-medium">
          Selecione uma opção
        </label>
        <Select
          value={discoverySource}
          onValueChange={(value) => setValue('discoverySource', value)}
        >
          <SelectTrigger className="h-12 border-[#D8D8D8] focus:border-[#9747FF] focus:ring-[#9747FF]/20">
            <SelectValue placeholder="Selecione uma opção" />
          </SelectTrigger>
          <SelectContent>
            {DISCOVERY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {discoverySource && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 bg-[#9747FF]/5 rounded-lg border border-[#9747FF]/20"
        >
          <p className="text-sm text-[#9747FF] font-medium">
            Obrigado por nos contar! 🎉
          </p>
          <p className="text-xs text-[#989898] mt-1">
            Essa informação nos ajuda a melhorar nossos canais de comunicação.
          </p>
        </motion.div>
      )}
    </div>
  );
}