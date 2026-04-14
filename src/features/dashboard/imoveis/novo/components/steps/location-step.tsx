"use client";

import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AutocompleteInput, AutocompleteOption, AutocompleteValue } from "@/components/ui/autocomplete-input";
import { api } from "@/shared/configs/api";
import { MapPin } from "lucide-react";
import { PropertyFormValues } from "../../schemas/property-schema";

interface LocationStepProps {
  form: UseFormReturn<PropertyFormValues>;
}

export function LocationStep({ form }: LocationStepProps) {
  const searchCities = async (query: string): Promise<AutocompleteOption[]> => {
    const response = await api
      .get(`locations?type=cidade&search=${encodeURIComponent(query)}`)
      .json<{ data: Array<{ id: number; name: string }> }>();

    return (response.data || []).map((item) => ({ id: String(item.id), name: item.name }));
  };

  const searchNeighborhoods = async (query: string): Promise<AutocompleteOption[]> => {
    const response = await api
      .get(`locations?type=bairro&search=${encodeURIComponent(query)}`)
      .json<{ data: Array<{ id: number; name: string }> }>();

    return (response.data || []).map((item) => ({ id: String(item.id), name: item.name }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-medium">Onde está localizado o imóvel?</h3>
      </div>

      <div className="grid gap-6">
        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Endereço completo
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Ex: Rua das Flores, 123, Apto 45"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Cidade
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <FormControl>
                <AutocompleteInput
                  value={field.value as AutocompleteValue}
                  onChange={(next) => field.onChange(next)}
                  onSearch={searchCities}
                  placeholder="Ex: João Pessoa, São Paulo"
                  inputClassName="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  createLabel={(typed) => `Cadastrar novo: ${typed}`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="neighborhood"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Bairro
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <FormControl>
                <AutocompleteInput
                  value={field.value as AutocompleteValue}
                  onChange={(next) => field.onChange(next)}
                  onSearch={searchNeighborhoods}
                  placeholder="Ex: Centro, Copacabana, Vila Madalena"
                  inputClassName="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  createLabel={(typed) => `Cadastrar novo: ${typed}`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-medium text-green-900 mb-2">📍 Informações importantes:</h3>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Inclua o número e complemento (apartamento, bloco, etc.)</li>
          <li>• Verifique se o endereço está correto para facilitar visitas</li>
          <li>• O bairro ajuda os interessados a encontrar o imóvel</li>
        </ul>
      </div>
    </div>
  );
}
