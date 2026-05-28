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
import { ArrowDown, ArrowUp, Check, ImageIcon, Newspaper, Pencil, Plus, Trash2 } from "lucide-react";
import { ImageUpload } from "./image-upload";
import { type SitePost, type SitePostPayload, usePosts } from "../services/posts-service";

const EMPTY: SitePostPayload = {
  title: "",
  category: "",
  excerpt: "",
  image_url: "",
  link_url: "",
  reading_time: "",
  published_at: "",
  is_published: true,
};

export function PostsManager() {
  const {
    posts,
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
  } = usePosts();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<SitePostPayload>(EMPTY);
  const [confirmDelete, setConfirmDelete] = useState<SitePost | null>(null);

  const startCreate = () => {
    setEditingId(null);
    setDraft(EMPTY);
    setShowForm(true);
  };

  const startEdit = (p: SitePost) => {
    setEditingId(p.id);
    setDraft({
      title: p.title,
      category: p.category ?? "",
      excerpt: p.excerpt ?? "",
      image_url: p.image_url ?? "",
      link_url: p.link_url ?? "",
      reading_time: p.reading_time ?? "",
      published_at: p.published_at ?? "",
      is_published: p.is_published,
    });
    setShowForm(true);
  };

  const cancel = () => {
    setShowForm(false);
    setEditingId(null);
    setDraft(EMPTY);
  };

  const submit = async () => {
    if (!draft.title.trim()) return;
    const payload: SitePostPayload = {
      ...draft,
      title: draft.title.trim(),
      category: draft.category?.trim() || null,
      excerpt: draft.excerpt?.trim() || null,
      image_url: draft.image_url?.trim() || null,
      link_url: draft.link_url?.trim() || null,
      reading_time: draft.reading_time?.trim() || null,
      published_at: draft.published_at?.trim() || null,
    };
    if (editingId) await update({ id: editingId, payload });
    else await create(payload);
    cancel();
  };

  const move = async (index: number, dir: "up" | "down") => {
    const target = dir === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= posts.length) return;
    const next = [...posts];
    const tmp = next[target];
    next[target] = next[index];
    next[index] = tmp;
    await reorder(next.map((p, i) => ({ id: p.id, sort_order: i })));
  };

  return (
    <>
      <LoadingState isLoading={isLoading} isError={isError} error={error ?? undefined} onRetry={() => refetch()} />

      {!isLoading && !isError && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#777777]">
              {posts.length === 0 ? "Nenhum post cadastrado" : `${posts.length} post(s)`}
            </p>
            {!showForm && (
              <Button
                onClick={startCreate}
                className="bg-gradient-to-r from-[#9747FF] to-[#7C3AED] hover:from-[#9747FF]/90 hover:to-[#7C3AED]/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo post
              </Button>
            )}
          </div>

          {showForm && (
            <div className="bg-[#FAFAF7] border border-gray-200 rounded-2xl p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4">
                <div className="space-y-1">
                  <Label className="text-xs">Imagem de capa</Label>
                  <ImageUpload
                    value={draft.image_url ?? ""}
                    onChange={url => setDraft(d => ({ ...d, image_url: url }))}
                  />
                </div>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Título</Label>
                    <Input
                      value={draft.title}
                      onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
                      placeholder="Ex: O mercado de luxo em 2026"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Categoria</Label>
                      <Input
                        value={draft.category ?? ""}
                        onChange={e => setDraft(d => ({ ...d, category: e.target.value }))}
                        placeholder="Ex: Mercado"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Tempo de leitura</Label>
                      <Input
                        value={draft.reading_time ?? ""}
                        onChange={e => setDraft(d => ({ ...d, reading_time: e.target.value }))}
                        placeholder="Ex: 5 min"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Resumo</Label>
                <Textarea
                  value={draft.excerpt ?? ""}
                  onChange={e => setDraft(d => ({ ...d, excerpt: e.target.value }))}
                  rows={2}
                  maxLength={500}
                  placeholder="Breve chamada do artigo…"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Link do artigo</Label>
                  <Input
                    value={draft.link_url ?? ""}
                    onChange={e => setDraft(d => ({ ...d, link_url: e.target.value }))}
                    placeholder="https://…"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Data de publicação</Label>
                  <Input
                    type="date"
                    value={draft.published_at ?? ""}
                    onChange={e => setDraft(d => ({ ...d, published_at: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <label className="inline-flex items-center gap-2 text-sm text-[#141414]">
                  <Switch
                    checked={draft.is_published ?? true}
                    onCheckedChange={v => setDraft(d => ({ ...d, is_published: v }))}
                  />
                  Exibir no site
                </label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={cancel}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={submit}
                    disabled={isCreating || isUpdating || !draft.title.trim()}
                    className="bg-gradient-to-r from-[#9747FF] to-[#7C3AED] hover:from-[#9747FF]/90 hover:to-[#7C3AED]/90"
                  >
                    <Check className="w-4 h-4 mr-1.5" />
                    {editingId ? "Atualizar" : "Adicionar"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {posts.length === 0 && !showForm ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <Newspaper className="w-10 h-10 text-[#9747FF]/60 mx-auto mb-3" />
              <p className="text-sm font-medium text-[#141414]">
                Adicione posts ao blog do seu site
              </p>
              <Button onClick={startCreate} className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Novo post
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {posts.map((p, i) => (
                <div
                  key={p.id}
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
                      disabled={i === posts.length - 1 || isReordering}
                      aria-label="Descer"
                      className="w-6 h-6 rounded border border-gray-200 text-[#777777] hover:text-[#9747FF] disabled:opacity-30 inline-flex items-center justify-center"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                    {p.image_url ? (
                      <Image src={p.image_url} alt={p.title} fill sizes="64px" className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#9747FF]/60">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-[#141414] truncate">{p.title}</p>
                      {p.category && (
                        <Badge className="bg-[#9747FF]/10 text-[#9747FF] border border-[#9747FF]/20 text-[10px]">
                          {p.category}
                        </Badge>
                      )}
                      {!p.is_published && (
                        <Badge className="bg-gray-100 text-gray-600 border border-gray-200 text-[10px]">
                          Oculto
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-[#777777] truncate">{p.excerpt ?? p.link_url ?? ""}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => startEdit(p)}>
                      <Pencil className="w-4 h-4 mr-1.5" />
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfirmDelete(p)}
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
            <AlertDialogTitle>Remover post</AlertDialogTitle>
            <AlertDialogDescription>
              Remover o post <strong>{confirmDelete?.title}</strong>?
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
