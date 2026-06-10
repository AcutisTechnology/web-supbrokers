"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import {
  visitSchema,
  VisitFormValues,
  VISIT_INTEREST_TYPES,
  VISIT_PROPERTY_TYPES,
  VISIT_SOURCES,
  VISIT_STATUSES,
} from "../schemas/visit-schema";
import {
  useCreateVisit,
  useUpdateVisit,
} from "../services/visits-service";
import {
  LeadSearchResult,
  PropertySearchResult,
  VisitListItem,
} from "../types/visit";
import {
  INTEREST_TYPE_LABELS,
  PROPERTY_TYPE_LABELS,
  SOURCE_LABELS,
  STATUS_LABELS,
} from "../utils/visit-labels";
import { LeadAutocomplete } from "./lead-autocomplete";
import { PhotoUploader } from "./photo-uploader";
import { PropertyAutocomplete } from "./property-autocomplete";
import { SignaturePad } from "./signature-pad";

type Props = {
  initialVisit?: VisitListItem;
  mode: "create" | "edit";
};

function buildDefaultValues(visit?: VisitListItem): VisitFormValues {
  return {
    lead_id: visit?.lead_id ?? null,
    property_id: visit?.property_id ?? null,
    visitor_name: visit?.visitor_name ?? "",
    visitor_phone: visit?.visitor_phone ?? "",
    visitor_email: visit?.visitor_email ?? "",
    property_name: visit?.property_name ?? "",
    property_address: visit?.property_address ?? "",
    property_type: visit?.property_type ?? null,
    interest_type: visit?.interest_type ?? null,
    source: visit?.source ?? null,
    customer_notes: visit?.customer_notes ?? "",
    broker_notes: visit?.broker_notes ?? "",
    broker_notes_private: visit?.broker_notes_private ?? false,
    has_partner_broker: visit?.has_partner_broker ?? false,
    partner_broker_name: visit?.partner_broker_name ?? "",
    partner_broker_creci: visit?.partner_broker_creci ?? "",
    partner_broker_phone: visit?.partner_broker_phone ?? "",
    partner_broker_company: visit?.partner_broker_company ?? "",
    signature: null,
    status: visit?.status ?? "agendada",
    visited_at: visit?.visited_at
      ? new Date(visit.visited_at).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
  };
}

export function VisitForm({ initialVisit, mode }: Props) {
  const router = useRouter();
  const createMutation = useCreateVisit();
  const updateMutation = useUpdateVisit();

  const [files, setFiles] = useState<File[]>([]);
  const [removedFileIds, setRemovedFileIds] = useState<number[]>([]);
  const [leadName, setLeadName] = useState<string>(initialVisit?.lead?.name ?? "");
  const [propertyLabel, setPropertyLabel] = useState<string>(
    initialVisit?.property_name ?? initialVisit?.property?.title ?? "",
  );

  const defaultValues = useMemo(() => buildDefaultValues(initialVisit), [initialVisit]);

  const form = useForm<VisitFormValues>({
    resolver: zodResolver(visitSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
    setLeadName(initialVisit?.lead?.name ?? initialVisit?.visitor_name ?? "");
    setPropertyLabel(initialVisit?.property_name ?? initialVisit?.property?.title ?? "");
  }, [defaultValues, initialVisit, form]);

  const hasPartnerBroker = form.watch("has_partner_broker");
  const brokerNotesPrivate = form.watch("broker_notes_private");

  const handleLeadSelect = (lead: LeadSearchResult | null, fallbackName?: string) => {
    if (lead) {
      form.setValue("lead_id", lead.id);
      form.setValue("visitor_name", lead.name);
      form.setValue("visitor_phone", lead.phone);
      form.setValue("visitor_email", lead.email ?? "");
      setLeadName(lead.name);
    } else {
      form.setValue("lead_id", null);
      if (fallbackName !== undefined) {
        form.setValue("visitor_name", fallbackName);
        setLeadName(fallbackName);
      }
    }
  };

  const handlePropertySelect = (
    property: PropertySearchResult | null,
    fallbackName?: string,
  ) => {
    if (property) {
      form.setValue("property_id", property.id);
      form.setValue("property_name", property.title);
      form.setValue(
        "property_address",
        `${property.street}${property.neighborhood ? " - " + property.neighborhood : ""}`,
      );
      setPropertyLabel(`${property.code} — ${property.title}`);
    } else {
      form.setValue("property_id", null);
      if (fallbackName !== undefined) {
        form.setValue("property_name", fallbackName);
        setPropertyLabel(fallbackName);
      }
    }
  };

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (mode === "create") {
        const visit = await createMutation.mutateAsync({ values, files });
        toast.success("Visita registrada com sucesso!");
        router.push(`/dashboard/visitas/${visit.id}`);
      } else if (initialVisit) {
        await updateMutation.mutateAsync({
          id: initialVisit.id,
          values,
          files,
          removeFileIds: removedFileIds,
        });
        toast.success("Visita atualizada com sucesso!");
        router.push(`/dashboard/visitas/${initialVisit.id}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível salvar a visita.");
    }
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={onSubmit} className="space-y-6 pb-24 md:pb-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <Link
            href="/dashboard/visitas"
            className="inline-flex items-center text-sm text-[#777777] hover:text-[#9747FF] transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </Link>
          <h1 className="text-2xl font-bold text-[#141414] mt-2">
            {mode === "create" ? "Nova visita" : "Editar visita"}
          </h1>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} className="gap-2">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Salvar visita
          </Button>
        </div>
      </div>

      {/* SEÇÃO — CLIENTE */}
      <Card className="border border-gray-100 shadow-sm rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Buscar lead</Label>
            <LeadAutocomplete
              leadId={form.watch("lead_id") ?? null}
              leadName={leadName}
              onSelect={handleLeadSelect}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="visitor_name">
                Nome <span className="text-red-500">*</span>
              </Label>
              <Input id="visitor_name" {...form.register("visitor_name")} />
              {form.formState.errors.visitor_name?.message && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.visitor_name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="visitor_phone">
                Telefone <span className="text-red-500">*</span>
              </Label>
              <Input id="visitor_phone" {...form.register("visitor_phone")} />
              {form.formState.errors.visitor_phone?.message && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.visitor_phone.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="visitor_email">E-mail</Label>
            <Input id="visitor_email" type="email" {...form.register("visitor_email")} />
          </div>
        </CardContent>
      </Card>

      {/* SEÇÃO — IMÓVEL */}
      <Card className="border border-gray-100 shadow-sm rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Imóvel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Buscar imóvel</Label>
            <PropertyAutocomplete
              propertyId={form.watch("property_id") ?? null}
              propertyLabel={propertyLabel}
              onSelect={handlePropertySelect}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="property_name">Nome / Empreendimento</Label>
              <Input id="property_name" {...form.register("property_name")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="property_address">Endereço</Label>
              <Input id="property_address" {...form.register("property_address")} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEÇÃO — DADOS DA VISITA */}
      <Card className="border border-gray-100 shadow-sm rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Dados da visita</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label>Tipo do imóvel</Label>
              <Controller
                control={form.control}
                name="property_type"
                render={({ field }) => (
                  <Select
                    value={field.value ?? undefined}
                    onValueChange={(v) => field.onChange(v as VisitFormValues["property_type"])}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {VISIT_PROPERTY_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {PROPERTY_TYPE_LABELS[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>Interesse</Label>
              <Controller
                control={form.control}
                name="interest_type"
                render={({ field }) => (
                  <Select
                    value={field.value ?? undefined}
                    onValueChange={(v) => field.onChange(v as VisitFormValues["interest_type"])}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {VISIT_INTEREST_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {INTEREST_TYPE_LABELS[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>Como conheceu</Label>
              <Controller
                control={form.control}
                name="source"
                render={({ field }) => (
                  <Select
                    value={field.value ?? undefined}
                    onValueChange={(v) => field.onChange(v as VisitFormValues["source"])}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {VISIT_SOURCES.map((source) => (
                        <SelectItem key={source} value={source}>
                          {SOURCE_LABELS[source]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="visited_at">Data da visita</Label>
              <Input
                id="visited_at"
                type="datetime-local"
                {...form.register("visited_at")}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Controller
                control={form.control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VISIT_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {STATUS_LABELS[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEÇÃO — OBSERVAÇÕES */}
      <Card className="border border-gray-100 shadow-sm rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Observações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer_notes">Observações do cliente</Label>
            <Textarea
              id="customer_notes"
              {...form.register("customer_notes")}
              rows={3}
              placeholder="O que o cliente comentou, dúvidas, etc."
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="broker_notes">Observações do corretor</Label>
              <label className="flex items-center gap-2 text-xs text-[#777777]">
                Privado da imobiliária
                <Switch
                  checked={brokerNotesPrivate}
                  onCheckedChange={(checked) => form.setValue("broker_notes_private", checked)}
                />
              </label>
            </div>
            <Textarea
              id="broker_notes"
              {...form.register("broker_notes")}
              rows={3}
              placeholder="Notas internas sobre a visita"
            />
          </div>
        </CardContent>
      </Card>

      {/* SEÇÃO — CORRETOR PARCEIRO */}
      <Card className="border border-gray-100 shadow-sm rounded-2xl">
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Corretor parceiro</CardTitle>
          <label className="flex items-center gap-2 text-sm text-[#777777]">
            Possui parceiro?
            <Switch
              checked={hasPartnerBroker}
              onCheckedChange={(checked) => form.setValue("has_partner_broker", checked)}
            />
          </label>
        </CardHeader>
        {hasPartnerBroker ? (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="partner_broker_name">Nome</Label>
                <Input id="partner_broker_name" {...form.register("partner_broker_name")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="partner_broker_creci">CRECI</Label>
                <Input id="partner_broker_creci" {...form.register("partner_broker_creci")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="partner_broker_phone">Telefone</Label>
                <Input id="partner_broker_phone" {...form.register("partner_broker_phone")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="partner_broker_company">Imobiliária</Label>
                <Input
                  id="partner_broker_company"
                  {...form.register("partner_broker_company")}
                />
              </div>
            </div>
          </CardContent>
        ) : null}
      </Card>

      {/* SEÇÃO — ASSINATURA */}
      <Card className="border border-gray-100 shadow-sm rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Assinatura / Rubrica</CardTitle>
        </CardHeader>
        <CardContent>
          {initialVisit?.signature_url && !form.watch("signature") ? (
            <div className="mb-3 rounded-xl border border-gray-200 bg-white p-3">
              <p className="mb-2 text-xs text-[#777777]">Assinatura atual</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={initialVisit.signature_url}
                alt="Assinatura"
                className="max-h-32 object-contain"
              />
            </div>
          ) : null}
          <Controller
            control={form.control}
            name="signature"
            render={({ field }) => (
              <SignaturePad value={field.value ?? null} onChange={field.onChange} />
            )}
          />
        </CardContent>
      </Card>

      {/* SEÇÃO — FOTOS */}
      <Card className="border border-gray-100 shadow-sm rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Fotos da visita</CardTitle>
        </CardHeader>
        <CardContent>
          <PhotoUploader
            files={files}
            onChange={setFiles}
            existingFiles={initialVisit?.files ?? []}
            removedIds={removedFileIds}
            onRemoveExisting={(id) =>
              setRemovedFileIds((current) =>
                current.includes(id) ? current : [...current, id],
              )
            }
          />
        </CardContent>
      </Card>

      {/* Barra fixa de submit em mobile */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-end gap-2 border-t border-gray-100 bg-white p-4 shadow-lg md:hidden">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting} className="gap-2 flex-1">
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Salvar visita
        </Button>
      </div>
    </form>
  );
}
