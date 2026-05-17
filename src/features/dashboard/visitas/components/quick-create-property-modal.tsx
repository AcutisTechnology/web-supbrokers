"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import {
  quickPropertySchema,
  QuickPropertyFormValues,
  VISIT_PROPERTY_TYPES,
} from "../schemas/visit-schema";
import { quickCreateProperty } from "../services/visits-service";
import { PropertySearchResult } from "../types/visit";
import { PROPERTY_TYPE_LABELS } from "../utils/visit-labels";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialName?: string;
  onCreated: (property: PropertySearchResult) => void;
};

export function QuickCreatePropertyModal({
  open,
  onOpenChange,
  initialName = "",
  onCreated,
}: Props) {
  const form = useForm<QuickPropertyFormValues>({
    resolver: zodResolver(quickPropertySchema),
    defaultValues: {
      property_type: "casa",
      street: initialName,
      neighborhood: "",
      condo_value: undefined,
      value: undefined,
      notes: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        property_type: "casa",
        street: initialName,
        neighborhood: "",
        condo_value: undefined,
        value: undefined,
        notes: "",
      });
    }
  }, [open, initialName, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const property = await quickCreateProperty({
        property_type: values.property_type,
        street: values.street,
        neighborhood: values.neighborhood,
        condo_value: values.condo_value ?? null,
        value: values.value ?? null,
        notes: values.notes || null,
      });
      toast.success("Imóvel cadastrado e selecionado.");
      onCreated(property);
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível cadastrar o imóvel.");
    }
  });

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Imóvel rápido</DialogTitle>
          <DialogDescription>
            Salve apenas os dados essenciais. Você pode completar depois em Meus imóveis.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>
              Tipo do imóvel <span className="text-red-500">*</span>
            </Label>
            <Controller
              control={form.control}
              name="property_type"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
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
            {form.formState.errors.property_type?.message && (
              <p className="text-sm text-red-600">{form.formState.errors.property_type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="qp-street">
              Endereço <span className="text-red-500">*</span>
            </Label>
            <Input id="qp-street" {...form.register("street")} placeholder="Rua, número" />
            {form.formState.errors.street?.message && (
              <p className="text-sm text-red-600">{form.formState.errors.street.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="qp-neighborhood">
              Bairro <span className="text-red-500">*</span>
            </Label>
            <Input id="qp-neighborhood" {...form.register("neighborhood")} placeholder="Bairro" />
            {form.formState.errors.neighborhood?.message && (
              <p className="text-sm text-red-600">
                {form.formState.errors.neighborhood.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="qp-condo">Condomínio (R$)</Label>
              <Input
                id="qp-condo"
                type="number"
                step="0.01"
                {...form.register("condo_value")}
                placeholder="0,00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qp-value">Valor (R$)</Label>
              <Input
                id="qp-value"
                type="number"
                step="0.01"
                {...form.register("value")}
                placeholder="0,00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="qp-notes">Observações</Label>
            <Textarea
              id="qp-notes"
              {...form.register("notes")}
              placeholder="Observações sobre o imóvel"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Salvar e selecionar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
