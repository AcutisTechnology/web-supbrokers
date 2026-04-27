"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { captacaoSchema, CaptacaoFormValues, defaultCaptacaoValues } from "../schemas/captacao-schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AutocompleteInput, AutocompleteValue } from "@/components/ui/autocomplete-input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/shared/configs/api";
import { useCaptacao, useCreateCaptacao, useUpdateCaptacao } from "../services/captacoes-service";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type ApiCatalogOption = { id: number; name: string };

const toAutocompleteValue = (value: AutocompleteValue): { id: number | null; name: string } => {
  const id = value.id ? Number(value.id) : null;
  return { id: Number.isFinite(id) ? id : null, name: value.name };
};

const STATUS_OPTIONS = ["Prospecção", "Em captação", "Negociação", "Aprovado", "Descartado"] as const;

export function CaptacaoForm({ captacaoId }: { captacaoId?: number }) {
  const router = useRouter();
  const createMutation = useCreateCaptacao();
  const updateMutation = useUpdateCaptacao(captacaoId ?? 0);
  const isEditing = typeof captacaoId === "number" && Number.isFinite(captacaoId) && captacaoId > 0;
  const { data: captacaoResponse } = useCaptacao(captacaoId ?? 0);

  const form = useForm<CaptacaoFormValues>({
    resolver: zodResolver(captacaoSchema),
    defaultValues: defaultCaptacaoValues,
  });

  useEffect(() => {
    if (!isEditing) return;
    const captacao = captacaoResponse?.data;
    if (!captacao) return;

    form.reset({
      building_name: captacao.building_name ?? "",
      builder: captacao.builder ? { id: captacao.builder.id, name: captacao.builder.name } : { id: null, name: "" },
      city: captacao.city_ref ? { id: captacao.city_ref.id, name: captacao.city_ref.name } : { id: null, name: "" },
      neighborhood: captacao.neighborhood_ref
        ? { id: captacao.neighborhood_ref.id, name: captacao.neighborhood_ref.name }
        : { id: null, name: "" },
      min_size: captacao.min_size ?? null,
      max_size: captacao.max_size ?? null,
      min_value: captacao.min_value ?? null,
      max_value: captacao.max_value ?? null,
      status: captacao.status ?? null,
      drive_url: captacao.drive_url ?? null,
      description: captacao.description ?? null,
    });
  }, [captacaoResponse?.data, form, isEditing]);

  const searchBuilders = async (query: string) => {
    const response = await api
      .get(`builders?search=${encodeURIComponent(query)}`)
      .json<{ data: ApiCatalogOption[] }>();

    return (response.data ?? []).map((i) => ({ id: String(i.id), name: i.name }));
  };

  const searchCities = async (query: string) => {
    const response = await api
      .get(`locations?type=cidade&search=${encodeURIComponent(query)}`)
      .json<{ data: ApiCatalogOption[] }>();

    return (response.data ?? []).map((i) => ({ id: String(i.id), name: i.name }));
  };

  const searchNeighborhoods = async (query: string) => {
    const response = await api
      .get(`locations?type=bairro&search=${encodeURIComponent(query)}`)
      .json<{ data: ApiCatalogOption[] }>();

    return (response.data ?? []).map((i) => ({ id: String(i.id), name: i.name }));
  };

  const onSubmit = async (values: CaptacaoFormValues) => {
    if (isEditing) {
      await updateMutation.mutateAsync(values);
    } else {
      await createMutation.mutateAsync(values);
    }

    router.push("/dashboard/captacoes");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="border border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle>Cadastrar Novo Imóvel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="building_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Prédio *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do Prédio" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="builder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Construtora *</FormLabel>
                    <FormControl>
                      <AutocompleteInput
                        value={{ id: field.value?.id ? String(field.value.id) : null, name: field.value?.name ?? "" }}
                        onChange={(v) => field.onChange(toAutocompleteValue(v))}
                        onSearch={searchBuilders}
                        placeholder="Construtora"
                        debounceMs={300}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="min_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Menor Tamanho (m²)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Menor Tamanho (m²)"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          field.onChange(v === "" ? null : Number(v));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maior Tamanho (m²)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Maior Tamanho (m²)"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          field.onChange(v === "" ? null : Number(v));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="min_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Mínimo (R$)</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        value={field.value ?? 0}
                        onChange={(v) => field.onChange(v === 0 ? null : v)}
                        placeholder="Ex: 350.000"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Máximo (R$)</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        value={field.value ?? 0}
                        onChange={(v) => field.onChange(v === 0 ? null : v)}
                        placeholder="Ex: 750.000"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="neighborhood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro *</FormLabel>
                    <FormControl>
                      <AutocompleteInput
                        value={{ id: field.value?.id ? String(field.value.id) : null, name: field.value?.name ?? "" }}
                        onChange={(v) => field.onChange(toAutocompleteValue(v))}
                        onSearch={searchNeighborhoods}
                        placeholder="Bairro"
                        debounceMs={300}
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
                    <FormLabel>Cidade *</FormLabel>
                    <FormControl>
                      <AutocompleteInput
                        value={{ id: field.value?.id ? String(field.value.id) : null, name: field.value?.name ?? "" }}
                        onChange={(v) => field.onChange(toAutocompleteValue(v))}
                        onSearch={searchCities}
                        placeholder="Cidade"
                        debounceMs={300}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado Atual</FormLabel>
                  <FormControl>
                    <Select value={field.value ?? ""} onValueChange={(v) => field.onChange(v || null)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="drive_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link do Drive</FormLabel>
                  <FormControl>
                    <Input placeholder="Link do Drive" {...field} value={field.value ?? ""} />
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
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descrição do imóvel" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/captacoes")}>
            Cancelar
          </Button>
          <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
            {createMutation.isPending || updateMutation.isPending ? "Salvando..." : "Salvar captação"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
