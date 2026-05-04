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
import { ExternalLink, Link2, Pencil, Plus, Trash2 } from "lucide-react";
import {
  LinkUtil,
  useCreateLinkUtil,
  useDeleteLinkUtil,
  useLinksUteis,
  useUpdateLinkUtil,
} from "@/features/dashboard/links-uteis/services/links-uteis-service";

const formSchema = z.object({
  titulo: z.string().trim().min(1, "Informe o título").max(255, "Máximo de 255 caracteres"),
  descricao: z
    .string()
    .trim()
    .min(1, "Informe a descrição")
    .max(500, "Máximo de 500 caracteres"),
  url: z.string().trim().url("Informe uma URL válida"),
  categoria: z.string().trim().optional(),
  ordem: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || Number.isInteger(Number(v)), "A ordem deve ser um número inteiro")
    .refine((v) => !v || Number(v) >= 0, "A ordem deve ser maior ou igual a zero"),
});

type FormValues = z.infer<typeof formSchema>;

const normalizeUrl = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return `https://${trimmed}`;
};

const toPayload = (values: FormValues) => ({
  titulo: values.titulo.trim(),
  descricao: values.descricao.trim(),
  url: normalizeUrl(values.url),
  categoria: values.categoria?.trim() ? values.categoria.trim() : null,
  ordem: values.ordem?.trim() ? Number(values.ordem) : 0,
});

export default function LinksUteisPage() {
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("todas");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<LinkUtil | null>(null);

  const { data, isLoading, isError, error, refetch } = useLinksUteis({
    categoria: categoriaFiltro === "todas" ? "" : categoriaFiltro,
  });

  const createMutation = useCreateLinkUtil();
  const deleteMutation = useDeleteLinkUtil();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
      url: "",
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
      titulo: "",
      descricao: "",
      url: "",
      categoria: "",
      ordem: "0",
    });
    setDialogOpen(true);
  };

  const openEdit = (item: LinkUtil) => {
    setEditing(item);
    form.reset({
      titulo: item.titulo,
      descricao: item.descricao,
      url: item.url,
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

  return (
    <>
      <TopNav title_secondary="Links Úteis" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#141414]">Links Úteis</h1>
          <p className="text-[#777777]">Gerencie links importantes para uso diário dos corretores.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Link
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>{editing ? "Editar Link" : "Novo Link"}</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={onSubmit}>
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

              <div className="space-y-2">
                <Label>URL *</Label>
                <Input {...form.register("url")} placeholder="https://..." />
                {form.formState.errors.url?.message && (
                  <p className="text-sm text-red-600">{form.formState.errors.url.message}</p>
                )}
              </div>

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
                  {editing ? "Salvar alterações" : "Criar link"}
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
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-[#9747FF] hover:underline break-all inline-flex items-center gap-1"
                    >
                      {item.url}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
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
