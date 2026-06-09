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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import {
  PROPERTY_TYPES_UI,
  PROPERTY_TYPE_LABELS,
  PropertyFormValues,
} from "../../schemas/property-schema";
import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/configs/api";

type Broker = { id: number; name: string; user_type?: string | null };

interface BasicInfoStepProps {
  form: UseFormReturn<PropertyFormValues>;
}

export function BasicInfoStep({ form }: BasicInfoStepProps) {
  const { isBroker, isManager, user } = useCurrentUser();

  const { data: brokersData } = useQuery({
    queryKey: ["brokers", "list"],
    queryFn: () => api.get("users").json<{ data: Broker[] }>(),
    enabled: isManager,
  });

  const brokers = (brokersData?.data ?? []).filter(
    (b) => b.user_type === "corretor" || b.user_type === "admin"
  );

  const selectedResponsibleId = form.watch("responsible_user_id");

  // Função para gerar código aleatório
  const generateRandomCode = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    
    let code = '';
    
    // Adicionar 2 letras
    for (let i = 0; i < 2; i++) {
      code += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    
    // Adicionar 3 números
    for (let i = 0; i < 3; i++) {
      code += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    
    form.setValue('code', code);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Nome do imóvel
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Ex: Apartamento 3 quartos no Centro"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Descrição
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva as principais características do imóvel, localização, diferenciais..."
                  className="min-h-[120px] bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-3">
          <FormField
            control={form.control}
            name="purpose"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  Finalidade
                  <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Selecione a finalidade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sell">Venda</SelectItem>
                    <SelectItem value="rent">Aluguel</SelectItem>
                    <SelectItem value="both">Venda e Aluguel</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="property_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  Tipo do imóvel
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? undefined}
                >
                  <FormControl>
                    <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PROPERTY_TYPES_UI.map((type) => (
                      <SelectItem key={type} value={type}>
                        {PROPERTY_TYPE_LABELS[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  Código do imóvel
                  <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Input
                      className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Ex: AB123"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={generateRandomCode}
                      title="Gerar código aleatório"
                      className="shrink-0"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {(isBroker || isManager) && (
            <FormItem>
              <FormLabel className="text-base font-medium">Responsável</FormLabel>
              <FormControl>
                {isBroker ? (
                  <div className="flex h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                    {user?.name ?? "—"}
                  </div>
                ) : (
                  <Select
                    value={selectedResponsibleId != null ? String(selectedResponsibleId) : "none"}
                    onValueChange={(val) =>
                      form.setValue(
                        "responsible_user_id",
                        val === "none" ? null : Number(val)
                      )
                    }
                  >
                    <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Selecione o responsável" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum</SelectItem>
                      {brokers.map((b) => (
                        <SelectItem key={b.id} value={String(b.id)}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">💡 Dicas para uma boa descrição:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Destaque os principais diferenciais do imóvel</li>
          <li>• Mencione a localização e proximidade de pontos importantes</li>
          <li>• Inclua informações sobre o estado de conservação</li>
          <li>• Seja claro e objetivo, evite exageros</li>
        </ul>
      </div>
    </div>
  );
}