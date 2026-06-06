"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus } from "lucide-react";
import { api } from "@/shared/configs/api";
import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { useQuery } from "@tanstack/react-query";
import {
  useCreateCrmLead,
  useCrmLeadSources,
  useCrmPipelineStages,
  useCrmTags,
} from "@/features/dashboard/crm/services/crm-service";

type Broker = { id: number; name: string; user_type?: string | null };

const schema = z.object({
  name:               z.string().min(1, "Informe o nome"),
  phone:              z.string().min(1, "Informe o telefone"),
  email:              z.string().email("E-mail inválido").optional().or(z.literal("")),
  source_id:          z.string().optional(),
  value:              z.string().optional(),
  priority:           z.enum(["1", "2", "3"]).default("2"),
  assigned_user_id:   z.string().optional(),
  pipeline_stage_id:  z.string().min(1, "Selecione a etapa"),
  notes:              z.string().optional(),
  tag_ids:            z.array(z.number()).optional(),
});

type FormValues = z.infer<typeof schema>;

interface NewLeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewLeadModal({ open, onOpenChange }: NewLeadModalProps) {
  const { isBroker, user: currentUser, userId: currentUserId } = useCurrentUser();

  const { data: stagesData } = useCrmPipelineStages();
  const { data: tagsData }   = useCrmTags();
  const { data: sourcesData } = useCrmLeadSources();
  const { data: brokersData } = useQuery({
    queryKey: ["brokers", "list"],
    queryFn: async () => {
      const res = await api.get("users").json<{ data: Broker[] }>();
      const users = Array.isArray(res.data) ? res.data : [];
      return users.filter((u) => u.user_type === "corretor" || u.user_type === "admin");
    },
  });

  const stages  = stagesData ?? [];
  const tags    = tagsData   ?? [];
  const sources = sourcesData ?? [];
  const brokers = brokersData ?? [];

  const createMutation = useCreateCrmLead();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "", phone: "", email: "", source_id: "", value: "",
      priority: "2", assigned_user_id: "", pipeline_stage_id: "",
      notes: "", tag_ids: [],
    },
  });

  // Pré-seleciona a primeira etapa
  useEffect(() => {
    if (!form.getValues("pipeline_stage_id") && stages[0]?.id) {
      form.setValue("pipeline_stage_id", String(stages[0].id), { shouldValidate: true });
    }
  }, [form, stages]);

  // Corretor é sempre o responsável
  useEffect(() => {
    if (isBroker && currentUserId && open) {
      form.setValue("assigned_user_id", String(currentUserId));
    }
  }, [isBroker, currentUserId, open, form]);

  const handleOpenChange = (next: boolean) => {
    if (!next) form.reset();
    onOpenChange(next);
  };

  const onSubmit = form.handleSubmit((values) => {
    const parseValue = () => {
      const raw = (values.value ?? "").trim();
      if (!raw) return null;
      const cleaned = raw.replace(/\./g, "").replace(",", ".");
      const n = Number(cleaned);
      return Number.isFinite(n) ? n : null;
    };

    createMutation.mutate(
      {
        name:             values.name.trim(),
        phone:            values.phone.trim(),
        email:            values.email?.trim() || null,
        source_id:        values.source_id ? Number(values.source_id) : null,
        value:            parseValue(),
        priority:         Number(values.priority) as 1 | 2 | 3,
        assigned_user_id: values.assigned_user_id ? Number(values.assigned_user_id) : null,
        pipeline_stage_id: Number(values.pipeline_stage_id),
        notes:            values.notes?.trim() || null,
        tag_ids:          values.tag_ids ?? [],
      },
      {
        onSuccess: () => {
          handleOpenChange(false);
        },
      },
    );
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl" onKeyDown={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Novo lead</DialogTitle>
        </DialogHeader>

        <form className="grid grid-cols-1 gap-4" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input {...form.register("name")} placeholder="Nome do lead" />
              {form.formState.errors.name?.message && (
                <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Telefone (WhatsApp)</Label>
              <Input {...form.register("phone")} placeholder="(00) 00000-0000" />
              {form.formState.errors.phone?.message && (
                <p className="text-sm text-red-600">{form.formState.errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>E-mail (opcional)</Label>
              <Input type="email" {...form.register("email")} placeholder="cliente@email.com" />
            </div>
            <div className="space-y-2">
              <Label>Valor estimado</Label>
              <Input {...form.register("value")} placeholder="0,00" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Origem</Label>
              <Select
                value={form.watch("source_id") || "none"}
                onValueChange={(v) => form.setValue("source_id", v === "none" ? "" : v)}
              >
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem origem</SelectItem>
                  {sources.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Etapa</Label>
              <Select
                value={form.watch("pipeline_stage_id")}
                onValueChange={(v) => form.setValue("pipeline_stage_id", v)}
              >
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {stages.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.pipeline_stage_id?.message && (
                <p className="text-sm text-red-600">{form.formState.errors.pipeline_stage_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select
                value={form.watch("priority")}
                onValueChange={(v) => form.setValue("priority", v as "1" | "2" | "3")}
              >
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Alta</SelectItem>
                  <SelectItem value="2">Média</SelectItem>
                  <SelectItem value="3">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Responsável</Label>
              {isBroker ? (
                <div className="flex h-9 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground">
                  {currentUser?.name ?? "Você"}
                </div>
              ) : (
                <Select
                  value={form.watch("assigned_user_id") || "none"}
                  onValueChange={(v) => form.setValue("assigned_user_id", v === "none" ? "" : v)}
                >
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sem responsável</SelectItem>
                    {brokers.map((b) => (
                      <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {tags.length > 0 && (
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => {
                  const selected = (form.watch("tag_ids") ?? []).includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      className={`px-3 py-1 rounded-full border text-xs transition-colors ${
                        selected
                          ? "bg-[#9747FF]/10 border-[#9747FF]/20 text-[#9747FF]"
                          : "bg-white border-gray-200 text-[#777777] hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        const current = form.getValues("tag_ids") ?? [];
                        const next = selected ? current.filter((id) => id !== t.id) : [...current, t.id];
                        form.setValue("tag_ids", next);
                      }}
                    >
                      {t.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea {...form.register("notes")} placeholder="Contexto, preferências, próximas ações..." />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createMutation.isPending} className="gap-2">
              {createMutation.isPending
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <Plus className="h-4 w-4" />}
              Criar lead
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
