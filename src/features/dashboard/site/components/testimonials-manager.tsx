"use client";

import { useState } from "react";
import Image from "next/image";
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
import { Textarea } from "@/components/ui/textarea";
import { LoadingState } from "@/components/ui/loading-state";
import { ArrowDown, ArrowUp, Check, MessageSquareQuote, Pencil, Plus, Star, Trash2, UserCircle2 } from "lucide-react";
import { ImageUpload } from "./image-upload";
import {
  type SiteTestimonial,
  type SiteTestimonialPayload,
  useTestimonials,
} from "../services/testimonials-service";

const EMPTY: SiteTestimonialPayload = {
  name: "",
  role: "",
  avatar_url: "",
  rating: 5,
  message: "",
  is_active: true,
};

export function TestimonialsManager() {
  const {
    testimonials,
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
  } = useTestimonials();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<SiteTestimonialPayload>(EMPTY);
  const [confirmDelete, setConfirmDelete] = useState<SiteTestimonial | null>(null);

  const startCreate = () => {
    setEditingId(null);
    setDraft(EMPTY);
    setShowForm(true);
  };

  const startEdit = (t: SiteTestimonial) => {
    setEditingId(t.id);
    setDraft({
      name: t.name,
      role: t.role ?? "",
      avatar_url: t.avatar_url ?? "",
      rating: t.rating,
      message: t.message,
      is_active: t.is_active,
    });
    setShowForm(true);
  };

  const cancel = () => {
    setShowForm(false);
    setEditingId(null);
    setDraft(EMPTY);
  };

  const submit = async () => {
    if (!draft.name.trim() || !draft.message.trim()) return;
    const payload: SiteTestimonialPayload = {
      ...draft,
      name: draft.name.trim(),
      role: draft.role?.trim() || null,
      avatar_url: draft.avatar_url?.trim() || null,
      message: draft.message.trim(),
    };
    if (editingId) await update({ id: editingId, payload });
    else await create(payload);
    cancel();
  };

  const move = async (index: number, dir: "up" | "down") => {
    const target = dir === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= testimonials.length) return;
    const next = [...testimonials];
    const tmp = next[target];
    next[target] = next[index];
    next[index] = tmp;
    await reorder(next.map((t, i) => ({ id: t.id, sort_order: i })));
  };

  return (
    <>
      <LoadingState isLoading={isLoading} isError={isError} error={error ?? undefined} onRetry={() => refetch()} />

      {!isLoading && !isError && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#777777]">
              {testimonials.length === 0
                ? "Nenhum depoimento cadastrado"
                : `${testimonials.length} depoimento(s)`}
            </p>
            {!showForm && (
              <Button
                onClick={startCreate}
                className="bg-gradient-to-r from-[#9747FF] to-[#7C3AED] hover:from-[#9747FF]/90 hover:to-[#7C3AED]/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo depoimento
              </Button>
            )}
          </div>

          {showForm && (
            <div className="bg-[#FAFAF7] border border-gray-200 rounded-2xl p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-4">
                <div className="space-y-1">
                  <Label className="text-xs">Foto</Label>
                  <ImageUpload
                    value={draft.avatar_url ?? ""}
                    onChange={url => setDraft(d => ({ ...d, avatar_url: url }))}
                  />
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Nome</Label>
                      <Input
                        value={draft.name}
                        onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                        placeholder="Ex: Roberto Silveira"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Cargo / empresa</Label>
                      <Input
                        value={draft.role ?? ""}
                        onChange={e => setDraft(d => ({ ...d, role: e.target.value }))}
                        placeholder="Ex: CEO, TechGlobal"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Avaliação</Label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setDraft(d => ({ ...d, rating: n }))}
                          aria-label={`${n} estrelas`}
                        >
                          <Star
                            className={`w-5 h-5 ${
                              n <= (draft.rating ?? 5)
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Depoimento</Label>
                <Textarea
                  value={draft.message}
                  onChange={e => setDraft(d => ({ ...d, message: e.target.value }))}
                  rows={3}
                  maxLength={1000}
                  placeholder="O que o cliente disse…"
                />
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
                    disabled={isCreating || isUpdating || !draft.name.trim() || !draft.message.trim()}
                    className="bg-gradient-to-r from-[#9747FF] to-[#7C3AED] hover:from-[#9747FF]/90 hover:to-[#7C3AED]/90"
                  >
                    <Check className="w-4 h-4 mr-1.5" />
                    {editingId ? "Atualizar" : "Adicionar"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {testimonials.length === 0 && !showForm ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <MessageSquareQuote className="w-10 h-10 text-[#9747FF]/60 mx-auto mb-3" />
              <p className="text-sm font-medium text-[#141414]">
                Adicione depoimentos de clientes
              </p>
              <Button onClick={startCreate} className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Novo depoimento
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {testimonials.map((t, i) => (
                <div
                  key={t.id}
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
                      disabled={i === testimonials.length - 1 || isReordering}
                      aria-label="Descer"
                      className="w-6 h-6 rounded border border-gray-200 text-[#777777] hover:text-[#9747FF] disabled:opacity-30 inline-flex items-center justify-center"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="relative w-11 h-11 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                    {t.avatar_url ? (
                      <Image src={t.avatar_url} alt={t.name} fill sizes="44px" className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#9747FF]/60">
                        <UserCircle2 className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-[#141414] truncate">{t.name}</p>
                      <span className="inline-flex">
                        {Array.from({ length: t.rating }).map((_, idx) => (
                          <Star key={idx} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </span>
                      {!t.is_active && (
                        <Badge className="bg-gray-100 text-gray-600 border border-gray-200 text-[10px]">
                          Oculto
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-[#777777] truncate">{t.message}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => startEdit(t)}>
                      <Pencil className="w-4 h-4 mr-1.5" />
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfirmDelete(t)}
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
            <AlertDialogTitle>Remover depoimento</AlertDialogTitle>
            <AlertDialogDescription>
              Remover o depoimento de <strong>{confirmDelete?.name}</strong>?
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
