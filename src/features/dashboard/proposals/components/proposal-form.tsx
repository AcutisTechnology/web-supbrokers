"use client";

import { useForm, useFieldArray, useWatch, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { proposalSchema, ProposalFormValues, defaultProposalValues } from "../schemas/proposal-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, UserPlus, Calculator, Users, Building2, Wallet, FileText, ChevronDown } from "lucide-react";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Property } from "@/features/dashboard/imoveis/services/property-service";
import { useMemo, useEffect, useState } from "react";
import { useCreateProposal, useUpdateProposal } from "../hooks/use-proposals";
import { useRouter } from "next/navigation";
import { MaskedInput } from "@/components/ui/masked-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/configs/api";
import { useToast } from "@/hooks/use-toast";

type Lead = {
  id: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  profession?: string | null;
};

type Broker = {
  id: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  creci?: string | null;
  user_type?: string | null;
};

interface ProposalFormProps {
  property: Property;
  initialData?: unknown;
  isEditing?: boolean;
}

export function ProposalForm({ property, initialData, isEditing }: ProposalFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const createProposal = useCreateProposal();
  const updateProposal = useUpdateProposal((initialData as { id?: number } | undefined)?.id ?? 0);

  const parseCurrencyToNumber = (value: string | number | null | undefined) => {
    if (typeof value === "number") return value;
    if (!value) return 0;
    const cleanedValue = value.replace(/\./g, "").replace(",", ".");
    return parseFloat(cleanedValue) || 0;
  };

  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalSchema),
    defaultValues: initialData || {
      ...defaultProposalValues,
      property_id: property.id,
      property_description: property.description,
      property_value: parseCurrencyToNumber(property.value),
      property_address: `${property.street}, ${property.neighborhood}`,
      total_value: parseCurrencyToNumber(property.value),
    },
  });

  const { fields: proponents, append: addProponent, remove: removeProponent } = useFieldArray({
    control: form.control,
    name: "proponents",
  });

  const { fields: conditions, append: addCondition, remove: removeCondition } = useFieldArray({
    control: form.control,
    name: "conditions",
  });

  // Buscar Leads para Autocomplete
  const { data: leadsData } = useQuery({
    queryKey: ["leads", "list"],
    queryFn: async () => {
      try {
        const response = await api.get("leads").json<{ data: Lead[] }>();
        return Array.isArray(response.data) ? response.data : ([] as Lead[]);
      } catch (error) {
        console.error("Erro ao buscar leads:", error);
        return [] as Lead[];
      }
    },
  });

  // Buscar Corretores para Autocomplete
  const { data: brokersData } = useQuery({
    queryKey: ["brokers", "list"],
    queryFn: async () => {
      try {
        const response = await api.get("users").json<{ data: Broker[] }>();
        const users = Array.isArray(response.data) ? response.data : ([] as Broker[]);
        return users.filter((u) => u.user_type === "corretor" || u.user_type === "admin");
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        return [] as Broker[];
      }
    },
  });

  // Buscar Imóveis para o Seletor
  const { data: propertiesData } = useQuery({
    queryKey: ["properties", "list"],
    queryFn: async () => {
      try {
        const response = await api.get("properties").json<{ data: Property[] }>();
        return Array.isArray(response.data) ? response.data : ([] as Property[]);
      } catch (error) {
        console.error("Erro ao buscar imóveis:", error);
        return [] as Property[];
      }
    },
  });

  const handleSelectProperty = (propertyId: string) => {
    const properties = Array.isArray(propertiesData) ? propertiesData : [];
    const selectedProperty = properties.find(p => String(p.id) === propertyId);
    if (selectedProperty) {
      form.setValue("property_id", selectedProperty.id);
      form.setValue("property_description", selectedProperty.description || "");
      form.setValue("property_value", parseCurrencyToNumber(selectedProperty.value));
      form.setValue("property_address", `${selectedProperty.street || ""}, ${selectedProperty.neighborhood || ""}`);
      form.setValue("property_complement", selectedProperty.complement || "");
    }
  };

  const handleSelectLead = (index: number, leadId: string) => {
    const leads = Array.isArray(leadsData) ? leadsData : ([] as Lead[]);
    const lead = leads.find((l) => String(l.id) === leadId);
    if (lead) {
      form.setValue(`proponents.${index}.name`, lead.name);
      form.setValue(`proponents.${index}.email`, lead.email || "");
      form.setValue(`proponents.${index}.phone`, lead.phone || "");
      form.setValue(`proponents.${index}.lead_id`, lead.id);
    }
  };

  const handleSelectBroker = (brokerId: string) => {
    const brokers = Array.isArray(brokersData) ? brokersData : ([] as Broker[]);
    const broker = brokers.find((b) => String(b.id) === brokerId);
    if (broker) {
      form.setValue("intermediator.broker_id", broker.id);
      form.setValue("intermediator.name", broker.name);
      form.setValue("intermediator.email", broker.email || "");
      form.setValue("intermediator.phone", broker.phone || "");
      form.setValue("intermediator.creci", broker.creci || "");
    }
  };

  // Cálculos automáticos da tabela
  const watchedPropertyValue = useWatch({
    control: form.control,
    name: "property_value",
  });
  
  const propertyValue = useMemo(() => parseCurrencyToNumber(watchedPropertyValue), [watchedPropertyValue]);
  
  const watchedConditions = useWatch({
    control: form.control,
    name: "conditions",
  });

  const totalProposalValue = useMemo(() => {
    if (!watchedConditions) return 0;
    return watchedConditions.reduce((acc, curr) => {
      const val = Number(curr?.value) || 0;
      const installments = Number(curr?.installments) || 1;
      const rowType = curr?.type;
      
      const baseValue = rowType === "percentage" ? (val / 100) * propertyValue : val;
      return acc + (baseValue * installments);
    }, 0);
  }, [watchedConditions, propertyValue]);

  const difference = totalProposalValue - propertyValue;
  const isMatch = Math.abs(difference) < 0.01;
  const differencePercentage = propertyValue > 0 ? (totalProposalValue / propertyValue) * 100 : 0;

  useEffect(() => {
    form.setValue("total_value", totalProposalValue);
    form.setValue("total_percentage", differencePercentage);
    form.setValue("difference_value", difference);
  }, [totalProposalValue, differencePercentage, difference, form]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
  };

  const onSubmit = async (values: ProposalFormValues) => {
    try {
      console.log("Submetendo proposta:", values);
      if (isEditing) {
        const payload = {
          ...values,
          status: (values as { status?: unknown }).status as unknown,
        } as unknown as import("../types/proposal").UpdateProposalDTO;

        await updateProposal.mutateAsync(payload);
      } else {
        await createProposal.mutateAsync(values);
      }
      router.push("/dashboard/propostas");
    } catch (error) {
      console.error("Erro ao salvar proposta:", error);
      // O toast de erro já é tratado pelo hook useCreateProposal/useUpdateProposal
    }
  };

  const onInvalid = (errors: FieldErrors<ProposalFormValues>) => {
    console.error("Erros de validação no formulário:", errors);
    
    // Lista os campos com erro no console para facilitar o debug
    const errorFields: string[] = [];
    const keys = Object.keys(errors) as Array<keyof FieldErrors<ProposalFormValues>>;

    const asArray = (val: unknown): unknown[] => (Array.isArray(val) ? val : []);

    keys.forEach((key) => {
      if (key === "proponents") {
        asArray(errors.proponents as unknown).forEach((err, idx) => {
          if (err) errorFields.push(`Proponente ${idx + 1}`);
        });
        return;
      }

      if (key === "conditions") {
        asArray(errors.conditions as unknown).forEach((err, idx) => {
          if (err) errorFields.push(`Condição ${idx + 1}`);
        });
        return;
      }

      errorFields.push(String(key));
    });

    toast({
      variant: "destructive",
      title: "Erro na validação",
      description: `Por favor, corrija os seguintes campos: ${errorFields.join(", ")}`,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-10 pb-20 max-w-6xl mx-auto">
        {/* Header Fixo/Topo */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="cursor-pointer hover:text-[#4A316A]" onClick={() => router.push("/dashboard/propostas")}>Propostas</span>
            <span>/</span>
            <span className="font-medium text-[#4A316A]">{isEditing ? "Editar Proposta" : "Nova Proposta"}</span>
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()} className="rounded-lg h-11 px-6">
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-lg h-11 px-8 font-semibold">
              {form.formState.isSubmitting ? "Salvando..." : "Salvar proposta"}
            </Button>
          </div>
        </div>

        <div className="space-y-12">
          {/* 1. DADOS DO(S) PROPONENTE(S) */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b pb-2">
              <Users className="w-5 h-5 text-[#4A316A]" />
              <h2 className="text-lg font-bold text-[#4A316A]">Dados do(s) Proponente(s)</h2>
            </div>

            {proponents.map((field, index) => (
              <div key={field.id} className="space-y-6 p-6 border rounded-xl bg-white shadow-sm relative">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-[#4A316A]">
                    {field.type === "principal" ? "Proponente Principal" : field.type === "conjuge" ? "Cônjuge" : "Proponente Adicional"}
                  </h3>
                  {index > 0 && (
                    <Button type="button" variant="ghost" size="sm" className="text-red-500" onClick={() => removeProponent(index)}>
                      <Trash2 className="w-4 h-4 mr-2" /> Remover
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-4">
                    <FormLabel className="text-xs uppercase text-gray-500 font-bold">Selecionar Lead Cadastrado (Opcional)</FormLabel>
                    <Select onValueChange={(val) => handleSelectLead(index, val)}>
                      <SelectTrigger className="mt-1 bg-gray-50 border-gray-200">
                        <SelectValue placeholder="Selecionar Lead Cadastrado (Opcional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(leadsData) && leadsData.map(lead => (
                          <SelectItem key={lead.id} value={String(lead.id)}>{lead.name} ({lead.email})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <FormField
                    control={form.control}
                    name={`proponents.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="md:col-span-3">
                        <FormLabel className="text-xs uppercase text-gray-500 font-bold">Nome completo</FormLabel>
                        <FormControl><Input {...field} placeholder="Nome completo" className="bg-gray-50" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`proponents.${index}.phone`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase text-gray-500 font-bold">Telefone</FormLabel>
                        <FormControl><MaskedInput {...field} value={field.value ?? ""} mask="(##) #####-####" placeholder="Telefone" className="bg-gray-50" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`proponents.${index}.cpf`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase text-gray-500 font-bold">CPF</FormLabel>
                        <FormControl><MaskedInput {...field} value={field.value ?? ""} mask="###.###.###-##" placeholder="CPF" className="bg-gray-50" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`proponents.${index}.birth_date`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase text-gray-500 font-bold">Data de nascimento</FormLabel>
                        <FormControl><Input {...field} value={field.value ?? ""} type="date" className="bg-gray-50" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`proponents.${index}.nationality`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase text-gray-500 font-bold">Nacionalidade</FormLabel>
                        <FormControl><Input {...field} value={field.value ?? ""} placeholder="Nacionalidade" className="bg-gray-50" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`proponents.${index}.marital_status`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase text-gray-500 font-bold">Estado Civil</FormLabel>
                        <FormControl><Input {...field} value={field.value ?? ""} placeholder="Estado Civil" className="bg-gray-50" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`proponents.${index}.profession`}
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-xs uppercase text-gray-500 font-bold">Profissão</FormLabel>
                        <FormControl><Input {...field} value={field.value ?? ""} placeholder="Profissão" className="bg-gray-50" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`proponents.${index}.rg`}
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-xs uppercase text-gray-500 font-bold">RG</FormLabel>
                        <FormControl><Input {...field} value={field.value ?? ""} placeholder="RG" className="bg-gray-50" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`proponents.${index}.email`}
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-xs uppercase text-gray-500 font-bold">E-mail</FormLabel>
                        <FormControl><Input {...field} value={field.value ?? ""} type="email" placeholder="E-mail" className="bg-gray-50" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`proponents.${index}.address`}
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-xs uppercase text-gray-500 font-bold">Endereço</FormLabel>
                        <FormControl><Input {...field} value={field.value ?? ""} placeholder="Endereço" className="bg-gray-50" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}

            <div className="flex gap-4">
              <Button type="button" variant="outline" size="sm" className="text-[#4A316A] border-[#4A316A]" onClick={() => addProponent({ name: "", type: "adicional" })}>
                <Plus className="w-4 h-4 mr-2" /> Adicionar Proponente
              </Button>
              <Button type="button" variant="outline" size="sm" className="text-[#4A316A] border-[#4A316A]" onClick={() => addProponent({ name: "", type: "conjuge" })}>
                <Plus className="w-4 h-4 mr-2" /> Adicionar Cônjuge
              </Button>
            </div>
          </section>

          {/* 2. DADOS DO IMÓVEL */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b pb-2">
              <Building2 className="w-5 h-5 text-[#4A316A]" />
              <h2 className="text-lg font-bold text-[#4A316A]">Dados do Imóvel</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <FormLabel className="text-xs uppercase text-gray-500 font-bold">Selecionar Imóvel</FormLabel>
                <FormField
                  control={form.control}
                  name="property_id"
                  render={({ field }) => (
                    <FormItem>
                      <Select 
                        onValueChange={handleSelectProperty} 
                        value={field.value ? String(field.value) : ""}
                      >
                        <FormControl>
                          <SelectTrigger className="mt-1 bg-gray-50 border-gray-200 h-11">
                            <SelectValue placeholder="Selecione o imóvel para a proposta" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.isArray(propertiesData) && propertiesData.map(p => (
                            <SelectItem key={p.id} value={String(p.id)}>
                              {p.title || p.description?.substring(0, 50)}... ({formatCurrency(parseCurrencyToNumber(p.value))})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="property_description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-xs uppercase text-gray-500 font-bold">Descrição do Imóvel</FormLabel>
                    <FormControl><Textarea {...field} value={field.value || ""} className="bg-gray-50 min-h-[80px]" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="property_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase text-gray-500 font-bold">Valor do Imóvel</FormLabel>
                    <FormControl><CurrencyInput value={field.value ?? 0} onChange={(val) => field.onChange(val)} className="bg-gray-50" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="property_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase text-gray-500 font-bold">Endereço do Imóvel</FormLabel>
                    <FormControl><Input {...field} value={field.value || ""} className="bg-gray-50" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="property_complement"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-xs uppercase text-gray-500 font-bold">Complemento do Imóvel</FormLabel>
                    <FormControl><Input {...field} value={field.value || ""} placeholder="Complemento do imóvel" className="bg-gray-50" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          {/* 3. DADOS DO(A) INTERMEDIADOR(A) */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b pb-2">
              <Users className="w-5 h-5 text-[#4A316A]" />
              <h2 className="text-lg font-bold text-[#4A316A]">Dados do(a) Intermediador(a)</h2>
            </div>

            <div className="p-6 border rounded-xl bg-white shadow-sm space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-4">
                  <FormLabel className="text-xs uppercase text-gray-500 font-bold">Selecionar Corretor Associado (Opcional)</FormLabel>
                  <Select onValueChange={handleSelectBroker}>
                    <SelectTrigger className="mt-1 bg-gray-50 border-gray-200">
                      <SelectValue placeholder="Selecionar Corretor Associado (Opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(brokersData) && brokersData.map(broker => (
                        <SelectItem key={broker.id} value={String(broker.id)}>{broker.name} ({broker.creci || 'Sem CRECI'})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <FormField
                  control={form.control}
                  name="intermediator.name"
                  render={({ field }) => (
                    <FormItem className="md:col-span-3">
                      <FormLabel className="text-xs uppercase text-gray-500 font-bold">Nome da Imobiliária / Corretor(a)</FormLabel>
                      <FormControl><Input {...field} value={field.value ?? ""} placeholder="Nome da Imobiliária / Corretor(a)" className="bg-gray-50" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="intermediator.creci"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase text-gray-500 font-bold">CRECI</FormLabel>
                      <FormControl><Input {...field} value={field.value ?? ""} placeholder="CRECI" className="bg-gray-50" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="intermediator.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase text-gray-500 font-bold">Telefone</FormLabel>
                      <FormControl><MaskedInput {...field} value={field.value ?? ""} mask="(##) #####-####" placeholder="Telefone" className="bg-gray-50" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="intermediator.document"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase text-gray-500 font-bold">CNPJ/CPF</FormLabel>
                      <FormControl><Input {...field} value={field.value ?? ""} placeholder="CNPJ/CPF" className="bg-gray-50" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="intermediator.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase text-gray-500 font-bold">E-mail</FormLabel>
                      <FormControl><Input {...field} value={field.value ?? ""} type="email" placeholder="E-mail" className="bg-gray-50" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="intermediator.address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase text-gray-500 font-bold">Endereço</FormLabel>
                      <FormControl><Input {...field} value={field.value ?? ""} placeholder="Endereço" className="bg-gray-50" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </section>

          {/* 4. CONDIÇÕES DE PAGAMENTO */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#4A316A]" />
                <h2 className="text-lg font-bold text-[#4A316A]">Condições de Pagamento</h2>
              </div>
              <Button type="button" variant="outline" size="sm" className="text-[#4A316A] border-[#4A316A]" onClick={() => addCondition({ description: "", value: 0, type: "value", installments: 1, period: "UNICA" })}>
                <Plus className="w-4 h-4 mr-2" /> Adicionar condição
              </Button>
            </div>

            <div className="overflow-x-auto border rounded-xl shadow-sm bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b text-gray-500 uppercase text-[10px] font-bold">
                    <th className="p-4 text-left w-20">Tipo</th>
                    <th className="p-4 text-left w-32">Valor</th>
                    <th className="p-4 text-left">Descrição</th>
                    <th className="p-4 text-left w-32">Início</th>
                    <th className="p-4 text-left w-32">Fim</th>
                    <th className="p-4 text-left w-20">Parc.</th>
                    <th className="p-4 text-left w-28">Período</th>
                    <th className="p-4 text-right w-32">Vl Parcela</th>
                    <th className="p-4 text-right w-32">Total</th>
                    <th className="p-4 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {conditions.map((field, index) => {
                    const rowValue = watchedConditions?.[index]?.value || 0;
                    const rowInstallments = watchedConditions?.[index]?.installments || 1;
                    const rowType = watchedConditions?.[index]?.type || "value";
                    
                    const baseValue = rowType === "percentage" ? (rowValue / 100) * propertyValue : rowValue;
                    const calculatedTotal = baseValue * rowInstallments;
                    const calculatedInstallment = baseValue;

                    return (
                      <tr key={field.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-3">
                          <Select 
                            onValueChange={(val) => form.setValue(`conditions.${index}.type`, val as ProposalFormValues["conditions"][number]["type"], { shouldValidate: true })} 
                            defaultValue={field.type}
                          >
                            <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="value">$</SelectItem>
                              <SelectItem value="percentage">%</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-3">
                          <CurrencyInput 
                            value={rowValue} 
                            onChange={(val) => form.setValue(`conditions.${index}.value`, val, { shouldValidate: true })} 
                            className="h-9 text-xs" 
                            prefix={rowType === "percentage" ? "" : "R$ "}
                            suffix={rowType === "percentage" ? "%" : ""}
                          />
                        </td>
                        <td className="p-3">
                          <Input {...form.register(`conditions.${index}.description`)} className="h-9 text-xs" placeholder="Ex: Entrada" />
                        </td>
                        <td className="p-3">
                          <Input {...form.register(`conditions.${index}.start_date`)} type="date" className="h-9 text-xs" />
                        </td>
                        <td className="p-3">
                          <Input {...form.register(`conditions.${index}.end_date`)} type="date" className="h-9 text-xs" />
                        </td>
                        <td className="p-3">
                          <Input {...form.register(`conditions.${index}.installments`)} type="number" className="h-9 text-xs" />
                        </td>
                        <td className="p-3">
                          <Select onValueChange={(val) => form.setValue(`conditions.${index}.period`, val)} defaultValue={field.period ?? undefined}>
                            <SelectTrigger className="h-9 text-xs uppercase"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="UNICA">UNICA</SelectItem>
                              <SelectItem value="MENSAL">MENSAL</SelectItem>
                              <SelectItem value="ANUAL">ANUAL</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-3 text-right font-medium text-gray-600">
                          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                            calculatedInstallment
                          )}
                        </td>
                        <td className="p-3 text-right font-bold text-[#4A316A]">
                          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                            calculatedTotal
                          )}
                        </td>
                        <td className="p-3">
                          {index > 0 && (
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-red-400" onClick={() => removeCondition(index)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col items-end gap-2 pt-4">
              <div className="flex justify-between w-full md:w-80 text-sm">
                <span className="text-gray-500">Valor do Imóvel:</span>
                <span className="font-bold text-gray-700">
                  {formatCurrency(propertyValue)}
                </span>
              </div>
              <div className="flex justify-between w-full md:w-80 text-sm">
                <span className="text-gray-500">Percentuais: <span className={isMatch ? "text-green-600" : "text-red-500"}>{Math.round(differencePercentage)}%</span></span>
                <span className="font-bold text-gray-700">
                  {formatCurrency(totalProposalValue)}
                </span>
              </div>
              <div className="flex justify-between w-full md:w-80 text-lg border-t pt-2">
                <span className="font-extrabold text-[#4A316A]">TOTAL A SER PAGO:</span>
                <span className={isMatch ? "font-extrabold text-green-600" : "font-extrabold text-red-500"}>
                  {formatCurrency(propertyValue)}
                </span>
              </div>
              
              {isMatch ? (
                <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-600"></span>
                  Valores conferem ✓
                </p>
              ) : (
                <p className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Diferença: {formatCurrency(difference)}
                </p>
              )}
            </div>

            {!isMatch && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex gap-3 text-amber-800 text-sm">
                <Calculator className="w-5 h-5 flex-shrink-0" />
                <p>O total a ser pago ({formatCurrency(totalProposalValue)}) não corresponde ao valor líquido do imóvel ({formatCurrency(propertyValue)}). Ajuste os valores antes de publicar.</p>
              </div>
            )}
          </section>

          {/* 5. OBSERVAÇÕES COMPLEMENTARES */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b pb-2">
              <FileText className="w-5 h-5 text-[#4A316A]" />
              <h2 className="text-lg font-bold text-[#4A316A]">Observações Complementares</h2>
            </div>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase text-gray-500 font-bold">Observações</FormLabel>
                  <FormControl><Textarea {...field} value={field.value ?? ""} placeholder="Insira suas observações" className="bg-gray-50 min-h-[120px]" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>
        </div>

        {/* Botão Salvar Mobile/Sticky */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg z-50">
          <Button type="submit" className="w-full bg-[#6366F1] hover:bg-[#4F46E5] h-12 rounded-xl font-bold">
            Salvar proposta
          </Button>
        </div>
      </form>
    </Form>
  );
}
