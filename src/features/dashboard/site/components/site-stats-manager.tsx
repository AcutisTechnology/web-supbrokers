"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingState } from "@/components/ui/loading-state";
import { ArrowDown, ArrowUp, Award, BarChart3, Building2, Check, Crown, Heart, Home, Pencil, Plus, ShieldCheck, Sparkles, Star, Trash2, TrendingUp, Users, type LucideIcon } from "lucide-react";
import {
  type SiteStat,
  type SiteStatPayload,
  SITE_STAT_ICONS,
  useSiteStats,
} from "../services/site-stats-service";

const ICON_MAP: Record<string, LucideIcon> = {
  Award,
  Building2,
  Crown,
  Users,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Home,
  Star,
  Heart,
};

function renderIcon(name: string | null | undefined) {
  if (!name) return <BarChart3 className="w-4 h-4" />;
  const Icon = ICON_MAP[name] ?? BarChart3;
  return <Icon className="w-4 h-4" />;
}

const EMPTY_DRAFT: SiteStatPayload = {
  label: "",
  value: 0,
  prefix: "",
  suffix: "",
  icon: "Award",
  is_active: true,
};

export function SiteStatsManager() {
  const {
    stats,
    isLoading,
    isError,
    error,
    refetch,
    create,
    update,
    remove,
    reorder,
    isCreating,
    isUpdating,
    isRemoving,
    isReordering,
  } = useSiteStats();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<SiteStatPayload>(EMPTY_DRAFT);
  const [showAddForm, setShowAddForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<SiteStat | null>(null);

  const startCreate = () => {
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
    setShowAddForm(true);
  };

  const startEdit = (stat: SiteStat) => {
    setEditingId(stat.id);
    setDraft({
      label: stat.label,
      value: stat.value,
      prefix: stat.prefix ?? "",
      suffix: stat.suffix ?? "",
      icon: stat.icon ?? "Award",
      is_active: stat.is_active,
    });
    setShowAddForm(true);
  };

  const cancel = () => {
    setShowAddForm(false);
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
  };

  const submit = async () => {
    if (!draft.label.trim()) return;
    const payload: SiteStatPayload = {
      ...draft,
      label: draft.label.trim(),
      prefix: draft.prefix?.trim() || null,
      suffix: draft.suffix?.trim() || null,
    };
    if (editingId) {
      await update({ id: editingId, payload });
    } else {
      await create(payload);
    }
    cancel();
  };

  const move = async (index: number, dir: "up" | "down") => {
    const target = dir === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= stats.length) return;
    const next = [...stats];
    const tmp = next[target];
    next[target] = next[index];
    next[index] = tmp;
    await reorder(next.map((s, i) => ({ id: s.id, sort_order: i })));
  };

  return (
    <>
      <LoadingState isLoading={isLoading} isError={isError} error={error ?? undefined} onRetry={() => refetch()} />

      {!isLoading && !isError && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#141414]">
                {stats.length === 0
                  ? "Nenhuma estatística cadastrada"
                  : `${stats.length} ${stats.length === 1 ? "estatística cadastrada" : "estatísticas cadastradas"}`}
              </p>
              <p className="text-xs text-[#777777]">
                Aparecem na faixa de números da home. Recomendado de 3 a 5.
              </p>
            </div>
            {!showAddForm && (
              <Button
                onClick={startCreate}
                className="bg-gradient-to-r from-[#9747FF] to-[#7C3AED] hover:from-[#9747FF]/90 hover:to-[#7C3AED]/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova estatística
              </Button>
            )}
          </div>

          {showAddForm && (
            <div className="bg-[#FAFAF7] border border-gray-200 rounded-2xl p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-5 space-y-1">
                  <Label className="text-xs">Rótulo</Label>
                  <Input
                    value={draft.label}
                    onChange={e => setDraft(d => ({ ...d, label: e.target.value }))}
                    placeholder="Ex: Anos de Mercado"
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <Label className="text-xs">Valor</Label>
                  <Input
                    type="number"
                    min={0}
                    value={draft.value}
                    onChange={e => setDraft(d => ({ ...d, value: Number(e.target.value) || 0 }))}
                  />
                </div>
                <div className="md:col-span-1 space-y-1">
                  <Label className="text-xs">Prefixo</Label>
                  <Input
                    value={draft.prefix ?? ""}
                    onChange={e => setDraft(d => ({ ...d, prefix: e.target.value }))}
                    placeholder="R$"
                  />
                </div>
                <div className="md:col-span-1 space-y-1">
                  <Label className="text-xs">Sufixo</Label>
                  <Input
                    value={draft.suffix ?? ""}
                    onChange={e => setDraft(d => ({ ...d, suffix: e.target.value }))}
                    placeholder="+"
                  />
                </div>
                <div className="md:col-span-3 space-y-1">
                  <Label className="text-xs">Ícone</Label>
                  <Select
                    value={draft.icon ?? "Award"}
                    onValueChange={v => setDraft(d => ({ ...d, icon: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SITE_STAT_ICONS.map(name => {
                        const Icon = ICON_MAP[name] ?? BarChart3;
                        return (
                          <SelectItem key={name} value={name}>
                            <span className="inline-flex items-center gap-2">
                              <Icon className="w-3.5 h-3.5" />
                              {name}
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <label className="inline-flex items-center gap-2 text-sm text-[#141414]">
                  <Switch
                    checked={draft.is_active ?? true}
                    onCheckedChange={v => setDraft(d => ({ ...d, is_active: v }))}
                  />
                  Exibir no site
                </label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={cancel}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={submit}
                    disabled={isCreating || isUpdating || !draft.label.trim()}
                    className="bg-gradient-to-r from-[#9747FF] to-[#7C3AED] hover:from-[#9747FF]/90 hover:to-[#7C3AED]/90"
                  >
                    <Check className="w-4 h-4 mr-1.5" />
                    {editingId ? "Atualizar" : "Adicionar"}
                  </Button>
                </div>
              </div>

              {/* Preview */}
              <div className="pt-3 border-t border-gray-200">
                <Label className="text-xs text-[#777777]">Pré-visualização</Label>
                <div className="mt-2 inline-flex items-center gap-3 bg-white border border-gray-200 rounded-2xl p-4">
                  <div className="w-9 h-9 rounded-lg bg-[#0F0820] flex items-center justify-center text-amber-300">
                    {renderIcon(draft.icon)}
                  </div>
                  <div>
                    <div className="font-display text-2xl text-[#0F0820]">
                      {draft.prefix}
                      {draft.value.toLocaleString("pt-BR")}
                      {draft.suffix}
                    </div>
                    <div className="text-xs text-[#777777]">{draft.label || "Rótulo da estatística"}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {stats.length === 0 && !showAddForm ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <BarChart3 className="w-10 h-10 text-[#9747FF]/60 mx-auto mb-3" />
              <p className="text-sm font-medium text-[#141414]">
                Comece adicionando as métricas da sua imobiliária
              </p>
              <p className="text-xs text-[#777777] mt-1">
                Anos de mercado, imóveis vendidos, ativos geridos, etc.
              </p>
              <Button onClick={startCreate} className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Nova estatística
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {stats.map((stat, i) => (
                <div
                  key={stat.id}
                  className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-3 hover:border-[#9747FF]/30 transition-colors"
                >
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => move(i, "up")}
                      disabled={i === 0 || isReordering}
                      aria-label="Subir"
                      className="w-6 h-6 rounded border border-gray-200 text-[#777777] hover:text-[#9747FF] disabled:opacity-30 inline-flex items-center justify-center"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, "down")}
                      disabled={i === stats.length - 1 || isReordering}
                      aria-label="Descer"
                      className="w-6 h-6 rounded border border-gray-200 text-[#777777] hover:text-[#9747FF] disabled:opacity-30 inline-flex items-center justify-center"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-[#0F0820] flex items-center justify-center text-amber-300 shrink-0">
                    {renderIcon(stat.icon)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-lg text-[#141414]">
                        {stat.prefix}
                        {stat.value.toLocaleString("pt-BR")}
                        {stat.suffix}
                      </span>
                      <span className="text-sm text-[#777777] truncate">— {stat.label}</span>
                      {!stat.is_active && (
                        <Badge className="bg-gray-100 text-gray-600 border border-gray-200 text-[10px]">
                          Oculto
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => startEdit(stat)}>
                      <Pencil className="w-4 h-4 mr-1.5" />
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfirmDelete(stat)}
                      disabled={isRemoving}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <AlertDialog open={!!confirmDelete} onOpenChange={open => !open && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover estatística</AlertDialogTitle>
            <AlertDialogDescription>
              Remover <strong>{confirmDelete?.label}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (confirmDelete) await remove(confirmDelete.id);
                setConfirmDelete(null);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
