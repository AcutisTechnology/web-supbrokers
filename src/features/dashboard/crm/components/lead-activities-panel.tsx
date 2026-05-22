"use client";

import { useState } from "react";
import { Calendar, CheckCircle2, Clock, RotateCcw, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  CRM_ACTIVITY_TYPES,
  CRM_ACTIVITY_TYPE_LABELS,
  useCreateCrmLeadActivity,
  useDeleteCrmLeadActivity,
  useMarkDoneCrmLeadActivity,
  useReopenCrmLeadActivity,
  type CrmActivityType,
  type CrmLeadActivity,
} from "../services/crm-service";

interface Props {
  leadId: number;
  activities: CrmLeadActivity[];
}

const toLocalInputValue = (iso?: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const formatDateTime = (iso?: string | null) => {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(iso));
  } catch {
    return iso;
  }
};

export function LeadActivitiesPanel({ leadId, activities }: Props) {
  const [type, setType] = useState<CrmActivityType>("call");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledFor, setScheduledFor] = useState(() => toLocalInputValue(new Date().toISOString()));

  const createMutation = useCreateCrmLeadActivity();
  const deleteMutation = useDeleteCrmLeadActivity();
  const markDoneMutation = useMarkDoneCrmLeadActivity();
  const reopenMutation = useReopenCrmLeadActivity();

  const handleSubmit = async () => {
    if (!title.trim() || !scheduledFor) return;
    await createMutation.mutateAsync({
      lead_id: leadId,
      type,
      title: title.trim(),
      description: description.trim() || null,
      scheduled_for: new Date(scheduledFor).toISOString(),
    });
    setTitle("");
    setDescription("");
  };

  const pending = activities.filter((a) => !a.is_done);
  const done = activities.filter((a) => a.is_done);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="border border-gray-100 shadow-sm rounded-2xl lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Atividades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pending.length > 0 && (
              <div className="text-xs uppercase tracking-wide text-[#777777]">Pendentes</div>
            )}
            {pending.map((a) => (
              <div
                key={a.id}
                className={`p-4 rounded-2xl border ${
                  a.is_overdue ? "border-rose-200 bg-rose-50/50" : "border-gray-100"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className="bg-[#9747FF]/10 text-[#9747FF] border border-[#9747FF]/20">
                        {CRM_ACTIVITY_TYPE_LABELS[a.type]}
                      </Badge>
                      {a.is_overdue && (
                        <Badge className="bg-rose-100 text-rose-800 border border-rose-200 gap-1">
                          <Clock className="h-3 w-3" />
                          Atrasada
                        </Badge>
                      )}
                    </div>
                    <div className="font-semibold text-[#141414] mt-2">{a.title}</div>
                    {a.description && (
                      <div className="text-sm text-[#777777] mt-1 whitespace-pre-wrap">{a.description}</div>
                    )}
                    <div className="text-xs text-[#777777] mt-2 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDateTime(a.scheduled_for)}
                      {a.responsible?.name ? ` • ${a.responsible.name}` : ""}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-emerald-700 hover:text-emerald-800"
                      onClick={() => markDoneMutation.mutate({ id: a.id, leadId })}
                      disabled={markDoneMutation.isPending}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Concluir
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => deleteMutation.mutate({ id: a.id, leadId })}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remover
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {done.length > 0 && (
              <div className="text-xs uppercase tracking-wide text-[#777777] mt-4">Concluídas</div>
            )}
            {done.map((a) => (
              <div key={a.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Concluída
                      </Badge>
                      <Badge className="bg-gray-100 text-[#777777] border border-gray-200">
                        {CRM_ACTIVITY_TYPE_LABELS[a.type]}
                      </Badge>
                    </div>
                    <div className="font-semibold text-[#141414] mt-2 line-through opacity-70">{a.title}</div>
                    <div className="text-xs text-[#777777] mt-2">
                      Concluída em {formatDateTime(a.done_at)}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => reopenMutation.mutate({ id: a.id, leadId })}
                    disabled={reopenMutation.isPending}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reabrir
                  </Button>
                </div>
              </div>
            ))}

            {activities.length === 0 && (
              <div className="text-sm text-[#777777] py-6 text-center">Nenhuma atividade.</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-100 shadow-sm rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Agendar atividade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={type} onValueChange={(v) => setType(v as CrmActivityType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CRM_ACTIVITY_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {CRM_ACTIVITY_TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Título</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Ligar para alinhar visita"
              />
            </div>

            <div className="space-y-2">
              <Label>Quando</Label>
              <Input
                type="datetime-local"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Descrição (opcional)</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Contexto, próximos passos..."
                className="min-h-[80px]"
              />
            </div>

            <Button
              type="button"
              className="w-full"
              onClick={handleSubmit}
              disabled={createMutation.isPending || !title.trim() || !scheduledFor}
            >
              Agendar atividade
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
