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
import {
  ArrowDown,
  ArrowUp,
  Check,
  Eye,
  EyeOff,
  ImageIcon,
  Newspaper,
  Pencil,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import { ImageUpload } from "./image-upload";
import { useAgentProfiles } from "../services/agent-profiles-service";
import { type SitePost, type SitePostPayload, usePosts } from "../services/posts-service";

const EMPTY: SitePostPayload = {
  title: "",
  subtitle: "",
  category: "",
  tags: [],
  excerpt: "",
  body: "",
  image_url: "",
  thumbnail_url: "",
  link_url: "",
  reading_time: "",
  published_at: "",
  is_published: true,
  is_featured: false,
  seo_title: "",
  seo_description: "",
  og_image_url: "",
  agent_profile_id: null,
};

type FormTab = "content" | "publish" | "seo";

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
  const { agents } = useAgentProfiles();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<SitePostPayload>(EMPTY);
  const [tagsInput, setTagsInput] = useState("");
  const [formTab, setFormTab] = useState<FormTab>("content");
  const [showPreview, setShowPreview] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<SitePost | null>(null);

  const startCreate = () => {
    setEditingId(null);
    setDraft(EMPTY);
    setTagsInput("");
    setFormTab("content");
    setShowPreview(false);
    setShowForm(true);
  };

  const startEdit = (p: SitePost) => {
    setEditingId(p.id);
    setDraft({
      title: p.title,
      subtitle: p.subtitle ?? "",
      category: p.category ?? "",
      tags: p.tags ?? [],
      excerpt: p.excerpt ?? "",
      body: p.body ?? "",
      image_url: p.image_url ?? "",
      thumbnail_url: p.thumbnail_url ?? "",
      link_url: p.link_url ?? "",
      reading_time: p.reading_time ?? "",
      published_at: p.published_at ?? "",
      is_published: p.is_published,
      is_featured: p.is_featured,
      seo_title: p.seo_title ?? "",
      seo_description: p.seo_description ?? "",
      og_image_url: p.og_image_url ?? "",
      agent_profile_id: p.agent_profile_id,
    });
    setTagsInput((p.tags ?? []).join(", "));
    setFormTab("content");
    setShowPreview(false);
    setShowForm(true);
  };

  const cancel = () => {
    setShowForm(false);
    setEditingId(null);
    setDraft(EMPTY);
    setTagsInput("");
  };

  const submit = async () => {
    if (!draft.title.trim()) return;
    const tags = tagsInput
      .split(",")
      .map(t => t.trim())
      .filter(Boolean);
    const payload: SitePostPayload = {
      ...draft,
      title: draft.title.trim(),
      subtitle: draft.subtitle?.trim() || null,
      category: draft.category?.trim() || null,
      tags,
      excerpt: draft.excerpt?.trim() || null,
      body: draft.body?.trim() || null,
      image_url: draft.image_url?.trim() || null,
      thumbnail_url: draft.thumbnail_url?.trim() || null,
      link_url: draft.link_url?.trim() || null,
      reading_time: draft.reading_time?.trim() || null,
      published_at: draft.published_at?.trim() || null,
      seo_title: draft.seo_title?.trim() || null,
      seo_description: draft.seo_description?.trim() || null,
      og_image_url: draft.og_image_url?.trim() || null,
      agent_profile_id: draft.agent_profile_id || null,
    };
    if (editingId) await update({ id: editingId, payload });
    else await create(payload);
    cancel();
  };

  const toggleVisibility = async (p: SitePost) => {
    await update({ id: p.id, payload: { is_visible: !p.is_visible } });
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

  const tabButton = (key: FormTab, label: string) => (
    <button
      type="button"
      onClick={() => setFormTab(key)}
      className={`px-4 py-2 text-sm rounded-full transition-colors ${
        formTab === key
          ? "bg-[#9747FF] text-white"
          : "text-[#777777] hover:text-[#141414]"
      }`}
    >
      {label}
    </button>
  );

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
            <div className="bg-[#FAFAF7] border border-gray-200 rounded-2xl p-5 space-y-5">
              <div className="flex items-center gap-1 bg-white rounded-full p-1 w-fit border border-gray-200">
                {tabButton("content", "Conteúdo")}
                {tabButton("publish", "Publicação")}
                {tabButton("seo", "SEO")}
              </div>

              {formTab === "content" && (
                <div className="space-y-4">
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
                      <div className="space-y-1">
                        <Label className="text-xs">Subtítulo</Label>
                        <Input
                          value={draft.subtitle ?? ""}
                          onChange={e => setDraft(d => ({ ...d, subtitle: e.target.value }))}
                          placeholder="Chamada complementar do artigo"
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Tags (separadas por vírgula)</Label>
                      <Input
                        value={tagsInput}
                        onChange={e => setTagsInput(e.target.value)}
                        placeholder="Investimento, Lifestyle, Design"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Autor</Label>
                      <select
                        value={draft.agent_profile_id ?? ""}
                        onChange={e =>
                          setDraft(d => ({
                            ...d,
                            agent_profile_id: e.target.value ? Number(e.target.value) : null,
                          }))
                        }
                        className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#9747FF]"
                      >
                        <option value="">Sem autor (marca)</option>
                        {agents.map(a => (
                          <option key={a.id} value={a.id}>
                            {a.name}
                          </option>
                        ))}
                      </select>
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

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Conteúdo (HTML)</Label>
                      <button
                        type="button"
                        onClick={() => setShowPreview(p => !p)}
                        className="text-xs text-[#9747FF] hover:underline"
                      >
                        {showPreview ? "Editar HTML" : "Pré-visualizar"}
                      </button>
                    </div>
                    {showPreview ? (
                      <div
                        className="prose prose-sm max-w-none bg-white border border-gray-200 rounded-md p-4 min-h-[200px]"
                        dangerouslySetInnerHTML={{ __html: draft.body || "<p>Sem conteúdo.</p>" }}
                      />
                    ) : (
                      <Textarea
                        value={draft.body ?? ""}
                        onChange={e => setDraft(d => ({ ...d, body: e.target.value }))}
                        rows={12}
                        className="font-mono text-xs"
                        placeholder="<p>Escreva o artigo em HTML…</p>"
                      />
                    )}
                    <p className="text-[11px] text-[#999]">
                      Suporta HTML: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;blockquote&gt;, &lt;img&gt;…
                    </p>
                  </div>
                </div>
              )}

              {formTab === "publish" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Data de publicação</Label>
                      <Input
                        type="date"
                        value={draft.published_at ?? ""}
                        onChange={e => setDraft(d => ({ ...d, published_at: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Link externo (opcional)</Label>
                      <Input
                        value={draft.link_url ?? ""}
                        onChange={e => setDraft(d => ({ ...d, link_url: e.target.value }))}
                        placeholder="https://… (substitui a página interna)"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 pt-2">
                    <label className="inline-flex items-center gap-2 text-sm text-[#141414]">
                      <Switch
                        checked={draft.is_published ?? true}
                        onCheckedChange={v => setDraft(d => ({ ...d, is_published: v }))}
                      />
                      Publicado (visível no site)
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm text-[#141414]">
                      <Switch
                        checked={draft.is_featured ?? false}
                        onCheckedChange={v => setDraft(d => ({ ...d, is_featured: v }))}
                      />
                      Destaque (artigo principal)
                    </label>
                  </div>
                </div>
              )}

              {formTab === "seo" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-xs">SEO título</Label>
                    <Input
                      value={draft.seo_title ?? ""}
                      onChange={e => setDraft(d => ({ ...d, seo_title: e.target.value }))}
                      placeholder="Título para mecanismos de busca"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">SEO descrição</Label>
                    <Textarea
                      value={draft.seo_description ?? ""}
                      onChange={e => setDraft(d => ({ ...d, seo_description: e.target.value }))}
                      rows={2}
                      maxLength={300}
                      placeholder="Descrição exibida nos resultados de busca e compartilhamentos"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs">Imagem OG</Label>
                      <ImageUpload
                        value={draft.og_image_url ?? ""}
                        onChange={url => setDraft(d => ({ ...d, og_image_url: url }))}
                      />
                    </div>
                    <p className="text-xs text-[#777] self-center">
                      Imagem exibida ao compartilhar o artigo em redes sociais. Se vazia,
                      usa a imagem de capa.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
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
          )}

          {posts.length === 0 && !showForm ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <Newspaper className="w-10 h-10 text-[#9747FF]/60 mx-auto mb-3" />
              <p className="text-sm font-medium text-[#141414]">
                Adicione artigos ao blog do seu site
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
                      disabled={i === 0 || isReordering || !p.editable}
                      aria-label="Subir"
                      className="w-6 h-6 rounded border border-gray-200 text-[#777777] hover:text-[#9747FF] disabled:opacity-30 inline-flex items-center justify-center"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, "down")}
                      disabled={i === posts.length - 1 || isReordering || !p.editable}
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
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-[#141414] truncate">{p.title}</p>
                      {p.is_featured && (
                        <Badge className="bg-amber-100 text-amber-700 border border-amber-200 text-[10px]">
                          <Star className="w-2.5 h-2.5 mr-0.5 fill-amber-500 text-amber-500" />
                          Destaque
                        </Badge>
                      )}
                      {p.category && (
                        <Badge className="bg-[#9747FF]/10 text-[#9747FF] border border-[#9747FF]/20 text-[10px]">
                          {p.category}
                        </Badge>
                      )}
                      {!p.is_published && (
                        <Badge className="bg-gray-100 text-gray-600 border border-gray-200 text-[10px]">
                          Rascunho
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-[#777777] truncate">
                      {p.author_name ? `Por ${p.author_name}` : "Sem autor"}
                      {p.excerpt ? ` — ${p.excerpt}` : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    {p.editable ? (
                      <>
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
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleVisibility(p)}
                        disabled={isUpdating}
                        className={p.is_visible ? "text-[#9747FF]" : "text-[#777777]"}
                        title={p.is_visible ? "Ocultar do site" : "Exibir no site"}
                      >
                        {p.is_visible ? (
                          <>
                            <Eye className="w-4 h-4 mr-1.5" />
                            Exibindo
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-4 h-4 mr-1.5" />
                            Oculto
                          </>
                        )}
                      </Button>
                    )}
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
