"use client";

import { useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TopNav } from "@/features/dashboard/imoveis/top-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingState } from "@/components/ui/loading-state";
import { Badge } from "@/components/ui/badge";
import { Check, Copy, ExternalLink, Link2, MessageCircle, Pencil, Plus, Trash2 } from "lucide-react";
import {
  LinkUtil,
  useCreateLinkUtil,
  useDeleteLinkUtil,
  useLinksUteis,
  useUpdateLinkUtil,
} from "@/features/dashboard/links-uteis/services/links-uteis-service";

const formSchema = z.object({
  tipo: z.enum(["link", "contato"]).default("link"),
  titulo: z.string().trim().min(1, "Informe o título").max(255, "Máximo de 255 caracteres"),
  descricao: z
    .string()
    .trim()
    .min(1, "Informe a descrição")
    .max(500, "Máximo de 500 caracteres"),
  url: z.string().trim().optional(),
  contact: z.string().trim().optional(),
  categoria: z.string().trim().optional(),
  ordem: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || Number.isInteger(Number(v)), "A ordem deve ser um número inteiro")
    .refine((v) => !v || Number(v) >= 0, "A ordem deve ser maior ou igual a zero"),
}).superRefine((values, ctx) => {
  if (values.tipo === "link") {
    const url = (values.url ?? "").trim();
    if (!url) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["url"], message: "Informe uma URL válida" });
      return;
    }
    const normalized = normalizeUrl(url);
    const result = z.string().url().safeParse(normalized);
    if (!result.success) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["url"], message: "Informe uma URL válida" });
    }
  } else {
    const contact = (values.contact ?? "").trim();
    if (!contact) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["contact"], message: "Informe o contato" });
      return;
    }

    const wa = toWhatsAppNumber(contact);
    if (!wa) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["contact"], message: "Informe um número válido" });
    }
  }
});

type FormValues = z.infer<typeof formSchema>;

const normalizeUrl = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return `https://${trimmed}`;
};

const normalizePhone = (value: string) => value.replace(/\D/g, "");

const toWhatsAppNumber = (raw: string) => {
  const digits = normalizePhone(raw);
  if (!digits) return null;
  if (digits.startsWith("55")) return digits;
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;
  return digits;
};

const formatPhoneBR = (raw: string) => {
  let digits = normalizePhone(raw);
  if (!digits) return null;

  if (digits.startsWith("55") && digits.length >= 12) {
    digits = digits.slice(2);
  }

  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return raw.trim();
};

const toPayload = (values: FormValues) => ({
  titulo: values.titulo.trim(),
  descricao: values.descricao.trim(),
  url:
    values.tipo === "contato"
      ? (() => {
          const wa = toWhatsAppNumber(values.contact ?? "");
          return wa ? `https://wa.me/${wa}` : "";
        })()
      : normalizeUrl(values.url ?? ""),
  contact: values.tipo === "contato" ? (values.contact?.trim() ? values.contact.trim() : null) : null,
  categoria: values.categoria?.trim() ? values.categoria.trim() : null,
  ordem: values.ordem?.trim() ? Number(values.ordem) : 0,
});

export default function LinksUteisPage() {
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("todas");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<LinkUtil | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const { data, isLoading, isError, error, refetch } = useLinksUteis({
    categoria: categoriaFiltro === "todas" ? "" : categoriaFiltro,
  });

  const createMutation = useCreateLinkUtil();
  const deleteMutation = useDeleteLinkUtil();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo: "link",
      titulo: "",
      descricao: "",
      url: "",
      contact: "",
      categoria: "",
      ordem: "0",
    },
  });

  const updateMutation = useUpdateLinkUtil(editing?.id ?? 0);

  const categorias = useMemo(() => {
    const unique = new Set<string>();
    for (const item of data ?? []) {
      const categoria = item.categoria?.trim();
      if (categoria) unique.add(categoria);
    }
    return Array.from(unique).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [data]);

  const openCreate = () => {
    setEditing(null);
    form.reset({
      tipo: "link",
      titulo: "",
      descricao: "",
      url: "",
      contact: "",
      categoria: "",
      ordem: "0",
    });
    setDialogOpen(true);
  };

  const openEdit = (item: LinkUtil) => {
    setEditing(item);
    form.reset({
      tipo: item.contact?.trim() ? "contato" : "link",
      titulo: item.titulo,
      descricao: item.descricao,
      url: item.url,
      contact: item.contact ?? "",
      categoria: item.categoria ?? "",
      ordem: String(item.ordem ?? 0),
    });
    setDialogOpen(true);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    const payload = toPayload(values);
    if (editing) {
      await updateMutation.mutateAsync(payload);
    } else {
      await createMutation.mutateAsync(payload);
    }
    setDialogOpen(false);
    setEditing(null);
  });

  const copyContact = async (id: number, contact: string) => {
    try {
      await navigator.clipboard.writeText(contact);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1500);
    } catch {
      setCopiedId(null);
    }
  };

  const tipo = form.watch("tipo");

  return (
    <>
      <TopNav title_secondary="Utilidades" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#141414]">Utilidades</h1>
          <p className="text-[#777777]">Gerencie links e contatos importantes para uso diário dos corretores.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Nova utilidade
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>{editing ? "Editar utilidade" : "Nova utilidade"}</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="space-y-2">
                <Label>Tipo *</Label>
                <Select value={tipo} onValueChange={(v) => form.setValue("tipo", v as "link" | "contato")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="link">Link</SelectItem>
                    <SelectItem value="contato">Contato</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Título *</Label>
                <Input {...form.register("titulo")} placeholder="Ex: Portal de Documentação" />
                {form.formState.errors.titulo?.message && (
                  <p className="text-sm text-red-600">{form.formState.errors.titulo.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Descrição *</Label>
                <Textarea
                  {...form.register("descricao")}
                  placeholder="Descreva rapidamente para que serve este link"
                  maxLength={500}
                />
                <div className="flex items-center justify-between">
                  {form.formState.errors.descricao?.message ? (
                    <p className="text-sm text-red-600">{form.formState.errors.descricao.message}</p>
                  ) : (
                    <span className="text-xs text-[#777777]">Máximo de 500 caracteres</span>
                  )}
                </div>
              </div>

              {tipo === "link" ? (
                <div className="space-y-2">
                  <Label>URL *</Label>
                  <Input {...form.register("url")} placeholder="https://..." />
                  {form.formState.errors.url?.message && (
                    <p className="text-sm text-red-600">{String(form.formState.errors.url.message)}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Contato *</Label>
                  <Input {...form.register("contact")} placeholder="(83) 99999-9999" />
                  {form.formState.errors.contact?.message && (
                    <p className="text-sm text-red-600">{String(form.formState.errors.contact.message)}</p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Input {...form.register("categoria")} placeholder="Ex: Documentação" />
                </div>

                <div className="space-y-2">
                  <Label>Ordem</Label>
                  <Input {...form.register("ordem")} type="number" min={0} placeholder="0" />
                  {form.formState.errors.ordem?.message && (
                    <p className="text-sm text-red-600">{form.formState.errors.ordem.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    setEditing(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editing ? "Salvar alterações" : "Criar utilidade"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border border-gray-100 shadow-sm mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filtros</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="mb-2 block">Categoria</Label>
            <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                {categorias.map((categoria) => (
                  <SelectItem key={categoria} value={categoria}>
                    {categoria}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2 flex items-end md:justify-end">
            <Button variant="outline" onClick={() => setCategoriaFiltro("todas")}>
              Limpar filtro
            </Button>
          </div>
        </CardContent>
      </Card>

      <LoadingState isLoading={isLoading} isError={isError} error={error as Error} onRetry={() => refetch()} />

      {!isLoading && !isError && (
        <>
          {(data ?? []).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {(data ?? []).map((item) => (
                <Card key={item.id} className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-8 h-8 rounded-lg bg-[#9747FF]/10 flex items-center justify-center">
                            <Link2 className="h-4 w-4 text-[#9747FF]" />
                          </div>
                          <CardTitle className="text-base text-[#141414] truncate">{item.titulo}</CardTitle>
                        </div>
                        {item.categoria ? (
                          <Badge variant="secondary" className="mt-1">
                            {item.categoria}
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-[#777777] line-clamp-3">{item.descricao}</p>
                    {item.contact?.trim() ? (
                      <div className="inline-flex items-center gap-2">
                        <span className="text-sm text-[#141414]">{formatPhoneBR(item.contact) ?? item.contact}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => copyContact(item.id, item.contact ?? "")}
                          aria-label="Copiar contato"
                        >
                          {copiedId === item.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                        {toWhatsAppNumber(item.contact) ? (
                          <Button asChild variant="outline" size="sm">
                            <a href={`https://wa.me/${toWhatsAppNumber(item.contact)}`} target="_blank" rel="noreferrer">
                              <MessageCircle className="h-4 w-4" />
                              WhatsApp
                            </a>
                          </Button>
                        ) : null}
                      </div>
                    ) : null}
                    {item.url?.trim() && (!item.contact?.trim() || !item.url.trim().startsWith("https://wa.me/")) ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-[#9747FF] hover:underline break-all inline-flex items-center gap-1"
                      >
                        {item.url}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : null}
                    <div className="flex items-center justify-between gap-3 pt-2">
                      <span className="text-xs text-[#777777]">Ordem: {item.ordem}</span>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEdit(item)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir link</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir este link útil? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteMutation.mutate(item.id)}>Excluir</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState action={{ label: "Criar primeiro link", onClick: openCreate }} />
          )}
        </>
      )}

      <div className="mt-8 text-center text-sm text-[#777777]">Copyright © iMoobile. Todos os direitos reservados</div>
    </>
  );
}
