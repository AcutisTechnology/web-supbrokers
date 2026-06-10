"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
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

import { quickLeadSchema, QuickLeadFormValues } from "../schemas/visit-schema";
import { quickCreateLead } from "../services/visits-service";
import { LeadSearchResult } from "../types/visit";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialName?: string;
  onCreated: (lead: LeadSearchResult) => void;
};

export function QuickCreateLeadModal({ open, onOpenChange, initialName = "", onCreated }: Props) {
  const form = useForm<QuickLeadFormValues>({
    resolver: zodResolver(quickLeadSchema),
    defaultValues: {
      name: initialName,
      phone: "",
      email: "",
      cpf: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({ name: initialName, phone: "", email: "", cpf: "" });
    }
  }, [open, initialName, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const lead = await quickCreateLead({
        name: values.name,
        phone: values.phone,
        email: values.email || null,
        cpf: values.cpf || null,
      });
      toast.success("Lead cadastrado e selecionado.");
      onCreated(lead);
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível cadastrar o lead.");
    }
  });

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Novo lead</DialogTitle>
          <DialogDescription>Cadastre rapidamente e vincule à visita.</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lead-name">
              Nome <span className="text-red-500">*</span>
            </Label>
            <Input id="lead-name" {...form.register("name")} placeholder="Nome do cliente" />
            {form.formState.errors.name?.message && (
              <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lead-phone">
              Telefone <span className="text-red-500">*</span>
            </Label>
            <Input id="lead-phone" {...form.register("phone")} placeholder="(00) 00000-0000" />
            {form.formState.errors.phone?.message && (
              <p className="text-sm text-red-600">{form.formState.errors.phone.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="lead-email">E-mail</Label>
              <Input id="lead-email" type="email" {...form.register("email")} placeholder="email@exemplo.com" />
              {form.formState.errors.email?.message && (
                <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-cpf">CPF</Label>
              <Input id="lead-cpf" {...form.register("cpf")} placeholder="000.000.000-00" />
            </div>
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
