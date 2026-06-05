"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { X, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { CurrencyInput } from "@/components/ui/currency-input";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

import { demandaSchema, DemandaFormValues, demandaDefaultValues } from "../types/demanda-schema";
import {
  useDemanda, useCreateDemanda, useUpdateDemanda, useSearchClients,
} from "../services/demandas-service";
import {
  PROPERTY_TYPES, DEMANDA_STATUS_LABELS, DemandaStatus,
} from "../types/demanda";

const CHARACTERISTICS = [
  "Piscina", "Academia", "Mobiliado", "Internet", "Área de serviço",
  "Elevador", "Condomínio fechado", "Portaria", "Permitido animais",
  "Aquecimento", "Ar-condicionado", "Churrasqueira", "Playground",
  "Salão de festas", "Segurança 24h", "Varanda", "Jardim",
  "Quarto de serviço", "Despensa", "Closet",
];

const STATUSES = Object.entries(DEMANDA_STATUS_LABELS) as [DemandaStatus, string][];

interface DemandaFormProps {
  demandaId?: number;
}

export function DemandaForm({ demandaId }: DemandaFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditing = typeof demandaId === "number" && demandaId > 0;

  const { data: demandaResp } = useDemanda(demandaId ?? null);
  const createMutation = useCreateDemanda();
  const updateMutation = useUpdateDemanda();

  const [neighborhoodInput, setNeighborhoodInput] = useState("");
  const [clientSearch, setClientSearch] = useState("");
  const { data: clientsData } = useSearchClients(clientSearch);

  const form = useForm<DemandaFormValues>({
    resolver: zodResolver(demandaSchema),
    defaultValues: demandaDefaultValues,
  });

  useEffect(() => {
    if (!isEditing || !demandaResp?.data) return;
    const d = demandaResp.data;
    form.reset({
      client_id: d.client?.id ?? null,
      title: d.title,
      property_type: d.property_type ?? null,
      city: d.city ?? null,
      state: d.state ?? null,
      sale: d.sale,
      rent: d.rent,
      min_value: d.min_value ?? null,
      max_value: d.max_value ?? null,
      min_size: d.min_size ?? null,
      max_size: d.max_size ?? null,
      min_bedrooms: d.min_bedrooms ?? null,
      min_suites: d.min_suites ?? null,
      min_bathrooms: d.min_bathrooms ?? null,
      min_garages: d.min_garages ?? null,
      neighborhoods: d.neighborhoods ?? [],
      required_characteristics: d.required_characteristics ?? [],
      desired_characteristics: d.desired_characteristics ?? [],
      description: d.description ?? null,
      status: (d.status as DemandaFormValues['status']) || 'nova',
    });
    setClientSearch(d.client?.name ?? "");
  }, [demandaResp?.data, isEditing, form]);

  async function onSubmit(values: DemandaFormValues) {
    if (isEditing) {
      await updateMutation.mutateAsync({ id: demandaId!, data: values });
      queryClient.invalidateQueries({ queryKey: ["demanda", demandaId] });
    } else {
      await createMutation.mutateAsync(values);
    }
    queryClient.invalidateQueries({ queryKey: ["demandas"] });
    router.push("/dashboard/demandas");
  }

  const addNeighborhood = () => {
    const trimmed = neighborhoodInput.trim();
    if (!trimmed) return;
    const current = form.getValues("neighborhoods");
    if (!current.includes(trimmed)) {
      form.setValue("neighborhoods", [...current, trimmed]);
    }
    setNeighborhoodInput("");
  };

  const removeNeighborhood = (n: string) => {
    form.setValue("neighborhoods", form.getValues("neighborhoods").filter(x => x !== n));
  };

  const toggleCharacteristic = (
    field: "required_characteristics" | "desired_characteristics",
    char: string,
    checked: boolean
  ) => {
    const current = form.getValues(field);
    if (checked) {
      if (!current.includes(char)) form.setValue(field, [...current, char]);
    } else {
      form.setValue(field, current.filter(x => x !== char));
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* Cliente */}
        <Card className="p-4 sm:p-8 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-[#9747ff]">Cliente</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FormField name="client_id" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Selecionar cliente</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Buscar cliente pelo nome..."
                      value={clientSearch}
                      onChange={e => setClientSearch(e.target.value)}
                    />
                    {clientsData?.data && clientsData.data.length > 0 && clientSearch.length >= 2 && (
                      <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-md max-h-48 overflow-y-auto">
                        {clientsData.data.map(c => (
                          <button
                            key={c.id}
                            type="button"
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                            onClick={() => {
                              field.onChange(c.id);
                              setClientSearch(c.name);
                            }}
                          >
                            {c.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </FormControl>
                {field.value && (
                  <button
                    type="button"
                    className="text-xs text-red-500 underline mt-1"
                    onClick={() => { field.onChange(null); setClientSearch(""); }}
                  >
                    Remover cliente
                  </button>
                )}
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="status" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Status da demanda</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {STATUSES.map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </Card>

        {/* Informações Gerais */}
        <Card className="p-4 sm:p-8 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-[#9747ff]">Informações Gerais</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FormField name="title" control={form.control} render={({ field }) => (
              <FormItem className="lg:col-span-2">
                <FormLabel>Título *</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} placeholder="Ex: Apartamento Vista Mar — João Silva" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="property_type" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo do imóvel</FormLabel>
                <Select value={field.value ?? "_none"} onValueChange={v => field.onChange(v === "_none" ? null : v)}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="_none">Qualquer</SelectItem>
                    {PROPERTY_TYPES.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            {/* Finalidade */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Finalidade</span>
              <div className="flex gap-6">
                <FormField name="sale" control={form.control} render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0 font-normal">Comprar</FormLabel>
                  </FormItem>
                )} />
                <FormField name="rent" control={form.control} render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0 font-normal">Alugar</FormLabel>
                  </FormItem>
                )} />
              </div>
            </div>
          </div>
        </Card>

        {/* Localização */}
        <Card className="p-4 sm:p-8 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-[#9747ff]">Localização</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FormField name="city" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} placeholder="Ex: João Pessoa" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="state" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} placeholder="Ex: PB" maxLength={2} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Bairros */}
            <FormField name="neighborhoods" control={form.control} render={({ field }) => (
              <FormItem className="lg:col-span-2">
                <FormLabel>Bairros desejados</FormLabel>
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite um bairro e pressione Adicionar"
                    value={neighborhoodInput}
                    onChange={e => setNeighborhoodInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addNeighborhood(); } }}
                  />
                  <Button type="button" variant="outline" onClick={addNeighborhood}>
                    <Plus className="w-4 h-4 mr-1" /> Adicionar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(field.value ?? []).map(n => (
                    <span key={n} className="flex items-center gap-1 bg-[#9747ff]/10 text-[#9747ff] text-sm px-2 py-1 rounded-full">
                      {n}
                      <button type="button" onClick={() => removeNeighborhood(n)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </Card>

        {/* Faixa de Valor e Área */}
        <Card className="p-4 sm:p-8 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-[#9747ff]">Faixa de Valor e Área</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormField name="min_value" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Valor mínimo</FormLabel>
                <FormControl>
                  <CurrencyInput
                    value={field.value ?? 0}
                    onChange={(_, v) => field.onChange(v?.floatValue ?? null)}
                    placeholder="R$ 0,00"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="max_value" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Valor máximo</FormLabel>
                <FormControl>
                  <CurrencyInput
                    value={field.value ?? 0}
                    onChange={(_, v) => field.onChange(v?.floatValue ?? null)}
                    placeholder="R$ 0,00"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="min_size" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Área mínima (m²)</FormLabel>
                <FormControl>
                  <Input
                    type="number" min="0"
                    value={field.value ?? ""}
                    onChange={e => field.onChange(e.target.value ? Number(e.target.value) : null)}
                    placeholder="Ex: 80"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="max_size" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Área máxima (m²)</FormLabel>
                <FormControl>
                  <Input
                    type="number" min="0"
                    value={field.value ?? ""}
                    onChange={e => field.onChange(e.target.value ? Number(e.target.value) : null)}
                    placeholder="Ex: 200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </Card>

        {/* Características Básicas */}
        <Card className="p-4 sm:p-8 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-[#9747ff]">Características Básicas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(["min_bedrooms","min_suites","min_bathrooms","min_garages"] as const).map(field => {
              const labels: Record<string, string> = {
                min_bedrooms: "Quartos mínimos",
                min_suites: "Suítes mínimas",
                min_bathrooms: "Banheiros mínimos",
                min_garages: "Vagas mínimas",
              };
              return (
                <FormField key={field} name={field} control={form.control} render={({ field: f }) => (
                  <FormItem>
                    <FormLabel>{labels[field]}</FormLabel>
                    <FormControl>
                      <Input
                        type="number" min="0"
                        value={f.value ?? ""}
                        onChange={e => f.onChange(e.target.value ? Number(e.target.value) : null)}
                        placeholder="0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              );
            })}
          </div>
        </Card>

        {/* Características do Imóvel */}
        <Card className="p-4 sm:p-8 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-[#9747ff]">Características do Imóvel</h2>
          <p className="text-sm text-gray-500 mb-4">
            Marque as características desejadas e defina se são <strong>obrigatórias</strong> ou <strong>desejáveis</strong>.
          </p>
          <FormField name="required_characteristics" control={form.control} render={() => (
            <FormField name="desired_characteristics" control={form.control} render={() => (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {CHARACTERISTICS.map(char => {
                  const required = form.watch("required_characteristics").includes(char);
                  const desired = form.watch("desired_characteristics").includes(char);
                  const isSelected = required || desired;

                  return (
                    <div
                      key={char}
                      className={`border rounded-lg p-3 transition-colors ${isSelected ? "border-[#9747ff] bg-[#9747ff]/5" : "border-gray-200"}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{char}</span>
                      </div>
                      <div className="flex gap-3 text-xs">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <Checkbox
                            checked={required}
                            onCheckedChange={checked => {
                              toggleCharacteristic("required_characteristics", char, !!checked);
                              if (checked) toggleCharacteristic("desired_characteristics", char, false);
                            }}
                          />
                          <span className="text-red-600 font-medium">Obrigatória</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <Checkbox
                            checked={desired}
                            onCheckedChange={checked => {
                              toggleCharacteristic("desired_characteristics", char, !!checked);
                              if (checked) toggleCharacteristic("required_characteristics", char, false);
                            }}
                          />
                          <span className="text-[#9747ff] font-medium">Desejável</span>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            )} />
          )} />
        </Card>

        {/* Observações */}
        <Card className="p-4 sm:p-8 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-[#9747ff]">Observações</h2>
          <FormField name="description" control={form.control} render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  placeholder="Ex: Cliente prefere prédio mais antigo próximo da praia. Aceita imóvel para reforma."
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/demandas")}>
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-[#9747ff] hover:bg-[#7c2ae8] text-white"
          >
            {isPending ? "Salvando..." : isEditing ? "Salvar alterações" : "Criar demanda"}
          </Button>
        </div>

      </form>
    </Form>
  );
}
