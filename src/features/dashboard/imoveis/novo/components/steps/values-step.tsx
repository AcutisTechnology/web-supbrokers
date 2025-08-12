"use client";

import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CurrencyInput } from "@/components/ui/currency-input";
import { DollarSign, FileText, Building } from "lucide-react";
import { PropertyFormValues } from "../../schemas/property-schema";

interface ValuesStepProps {
  form: UseFormReturn<PropertyFormValues>;
}

export function ValuesStep({ form }: ValuesStepProps) {
  const purpose = form.watch("purpose");
  const isRent = purpose === "rent";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-medium">
          Valores do imóvel {isRent ? "(Aluguel)" : "(Venda)"}
        </h3>
      </div>

      <div className="grid gap-6">
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                {isRent ? "Valor do aluguel" : "Valor de venda"}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <CurrencyInput
                  placeholder={isRent ? "Ex: R$ 2.500,00" : "Ex: R$ 450.000,00"}
                  value={field.value}
                  onChange={field.onChange}
                  className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="iptu_value"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Valor do IPTU {isRent ? "(mensal)" : "(anual)"}
                </FormLabel>
                <FormControl>
                  <CurrencyInput
                    placeholder={isRent ? "Ex: R$ 150,00" : "Ex: R$ 1.800,00"}
                    value={field.value}
                    onChange={field.onChange}
                    className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="condo_value"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Valor do condomínio
                </FormLabel>
                <FormControl>
                  <CurrencyInput
                    placeholder="Ex: R$ 350,00"
                    value={field.value}
                    onChange={field.onChange}
                    className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="font-medium text-purple-900 mb-2">💰 Informações sobre valores:</h3>
        <ul className="text-sm text-purple-800 space-y-1">
          {isRent ? (
            <>
              <li>• <strong>Aluguel:</strong> Valor mensal que será cobrado do inquilino</li>
              <li>• <strong>IPTU:</strong> Valor mensal (se for responsabilidade do inquilino)</li>
              <li>• <strong>Condomínio:</strong> Valor mensal das taxas condominiais</li>
            </>
          ) : (
            <>
              <li>• <strong>Venda:</strong> Valor total de venda do imóvel</li>
              <li>• <strong>IPTU:</strong> Valor anual do imposto predial</li>
              <li>• <strong>Condomínio:</strong> Valor mensal das taxas condominiais</li>
            </>
          )}
          <li>• Valores transparentes geram mais confiança dos interessados</li>
        </ul>
      </div>
    </div>
  );
}