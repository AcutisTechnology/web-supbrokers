"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { TopNav } from "@/features/dashboard/imoveis/top-nav";
import { api } from "@/shared/configs/api";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Copy, ExternalLink, MessageCircle, Pencil, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type BuilderRow = {
  id: number;
  name: string;
  contact: string | null;
  url: string | null;
  total_captacoes: number;
};

type BuildersResponse = {
  data: BuilderRow[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

function toWhatsAppNumber(rawDigits: string) {
  const digits = normalizePhone(rawDigits);
  if (!digits) return null;
  if (digits.startsWith("55")) return digits;
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;
  return digits;
}

function formatPhoneBR(rawDigits: string) {
  let digits = normalizePhone(rawDigits);
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

  return rawDigits.trim();
}

export default function ConstrutorasPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const [draftSearch, setDraftSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingBuilderId, setEditingBuilderId] = useState<number | null>(null);
  const [copiedBuilderId, setCopiedBuilderId] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [formContact, setFormContact] = useState("");
  const [formUrl, setFormUrl] = useState("");

  const query = useQuery({
    queryKey: ["builders", currentPage, appliedSearch],
    queryFn: async () => {
      const search = appliedSearch.trim();
      const url = `builders?paginate=1&per_page=10&page=${currentPage}&search=${encodeURIComponent(search)}`;
      return api.get(url).json<BuildersResponse>();
    },
  });

  const builders = query.data?.data ?? [];
  const totalPages = query.data?.meta?.last_page ?? 1;

  const openCreate = () => {
    setEditingBuilderId(null);
    setFormName("");
    setFormContact("");
    setFormUrl("");
    setDialogOpen(true);
  };

  const openEdit = (builder: BuilderRow) => {
    setEditingBuilderId(builder.id);
    setFormName(builder.name ?? "");
    setFormContact(builder.contact ?? "");
    setFormUrl(builder.url ?? "");
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (isSaving) return;
    setDialogOpen(false);
  };

  const payload = useMemo(() => {
    const name = formName.trim();
    const contact = formContact.trim();
    const url = formUrl.trim();

    return {
      name,
      contact: contact !== "" ? contact : null,
      url: url !== "" ? url : null,
    };
  }, [formName, formContact, formUrl]);

  const saveBuilder = async () => {
    if (!payload.name) {
      toast({
        title: "Nome obrigatório",
        description: "Informe o nome da construtora.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      if (editingBuilderId) {
        await api.put(`builders/${editingBuilderId}`, { json: payload }).json();
        toast({ title: "Construtora atualizada" });
      } else {
        await api.post("builders", { json: payload }).json();
        toast({ title: "Construtora criada" });
      }

      queryClient.invalidateQueries({ queryKey: ["builders"] });
      setDialogOpen(false);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Falha ao salvar construtora.";
      toast({
        title: "Erro",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const applySearch = () => {
    setCurrentPage(1);
    setAppliedSearch(draftSearch);
  };

  const copyContact = async (builderId: number, contact: string) => {
    try {
      await navigator.clipboard.writeText(contact);
      setCopiedBuilderId(builderId);
      toast({ title: "Contato copiado" });
      window.setTimeout(() => setCopiedBuilderId((current) => (current === builderId ? null : current)), 1500);
    } catch {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o contato.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <TopNav title_secondary="Construtoras" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#141414]">Construtoras</h1>
          <p className="text-[#777777]">Gestão de construtoras e empreendimentos vinculados</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nova construtora
        </Button>
      </div>

      <Card className="border border-gray-100 shadow-sm mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Busca</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="text-sm font-medium mb-2 text-[#141414]">Nome</div>
              <Input
                placeholder="Buscar construtora"
                value={draftSearch}
                onChange={(e) => setDraftSearch(e.target.value)}
              />
            </div>
            <div className="flex items-end justify-end">
              <Button onClick={applySearch}>Buscar</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <LoadingState
        isLoading={query.isLoading}
        isError={query.isError}
        error={query.error as Error}
        onRetry={() => query.refetch()}
      />

      {!query.isLoading && !query.isError && (
        <>
          {builders.length > 0 ? (
            <div className="w-full">
              <div className="hidden md:block bg-white rounded-xl border border-[#E2E2E2] overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-[#E2E2E2]">
                      <th className="text-left px-6 py-4 font-semibold text-[#4A316A]">NOME</th>
                      <th className="text-left px-6 py-4 font-semibold text-[#4A316A]">CONTATO</th>
                      <th className="text-left px-6 py-4 font-semibold text-[#4A316A]">URL</th>
                      <th className="text-left px-6 py-4 font-semibold text-[#4A316A]">EMPREENDIMENTOS</th>
                      <th className="text-right px-6 py-4 font-semibold text-[#4A316A]">AÇÕES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {builders.map((b) => {
                      const contact = b.contact?.trim() ? b.contact : null;
                      const phoneDisplay = contact ? formatPhoneBR(contact) : null;
                      const waNumber = contact ? toWhatsAppNumber(contact) : null;
                      const url = b.url?.trim() ? b.url : null;

                      return (
                        <tr key={b.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50">
                          <td className="px-6 py-4 text-[#141414] font-medium">{b.name}</td>
                          <td className="px-6 py-4 text-[#141414]">
                            {contact ? (
                              <div className="inline-flex items-center gap-2">
                                <span>{phoneDisplay ?? contact}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => copyContact(b.id, contact)}
                                  aria-label="Copiar contato"
                                >
                                  {copiedBuilderId === b.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                                {waNumber ? (
                                  <Button asChild variant="outline" size="sm">
                                    <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noreferrer">
                                      <MessageCircle className="h-4 w-4" />
                                      WhatsApp
                                    </a>
                                  </Button>
                                ) : null}
                              </div>
                            ) : (
                              <span className="text-[#969696]">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {url ? (
                              <Button asChild variant="outline" size="sm">
                                <a href={url} target="_blank" rel="noreferrer">
                                  <ExternalLink className="h-4 w-4" />
                                  Abrir
                                </a>
                              </Button>
                            ) : (
                              <span className="text-[#969696]">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-[#141414]">{b.total_captacoes}</td>
                          <td className="px-6 py-4 text-right">
                            <Button variant="outline" size="sm" onClick={() => openEdit(b)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Editar
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden bg-white rounded-xl border border-[#E2E2E2] overflow-hidden shadow-sm overflow-x-auto">
                <table className="min-w-[900px] w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-[#E2E2E2]">
                      <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">NOME</th>
                      <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">CONTATO</th>
                      <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">URL</th>
                      <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">EMPREENDIMENTOS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {builders.map((b) => {
                      const contact = b.contact?.trim() ? b.contact : null;
                      const phoneDisplay = contact ? formatPhoneBR(contact) : null;
                      const waNumber = contact ? toWhatsAppNumber(contact) : null;
                      const url = b.url?.trim() ? b.url : null;

                      return (
                        <tr key={b.id} className="border-b border-gray-100 last:border-b-0">
                          <td className="px-4 py-3 text-[#141414] font-medium">{b.name}</td>
                          <td className="px-4 py-3 text-[#141414]">
                            {contact ? (
                              <div className="inline-flex items-center gap-2">
                                <span>{phoneDisplay ?? contact}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => copyContact(b.id, contact)}
                                  aria-label="Copiar contato"
                                >
                                  {copiedBuilderId === b.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                                {waNumber ? (
                                  <Button asChild variant="outline" size="sm">
                                    <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noreferrer">
                                      <MessageCircle className="h-4 w-4" />
                                      WhatsApp
                                    </a>
                                  </Button>
                                ) : null}
                              </div>
                            ) : (
                              <span className="text-[#969696]">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {url ? (
                              <Button asChild variant="outline" size="sm">
                                <a href={url} target="_blank" rel="noreferrer">
                                  <ExternalLink className="h-4 w-4" />
                                  Abrir
                                </a>
                              </Button>
                            ) : (
                              <span className="text-[#969696]">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-[#141414]">{b.total_captacoes}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <EmptyState action={{ label: "Nova construtora", onClick: openCreate }} />
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
              className="mt-8"
            />
          )}
        </>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingBuilderId ? "Editar construtora" : "Nova construtora"}</DialogTitle>
            <DialogDescription>Preencha os campos abaixo. Contato e URL são opcionais.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-2 text-[#141414]">Nome</div>
              <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Nome da construtora" />
            </div>
            <div>
              <div className="text-sm font-medium mb-2 text-[#141414]">Contato</div>
              <Input
                value={formContact}
                onChange={(e) => setFormContact(e.target.value)}
                placeholder="(83) 99999-9999"
              />
            </div>
            <div>
              <div className="text-sm font-medium mb-2 text-[#141414]">URL</div>
              <Input value={formUrl} onChange={(e) => setFormUrl(e.target.value)} placeholder="https://..." />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={saveBuilder} disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mt-8 text-center text-sm text-[#777777]">Copyright © iMoobile. Todos os direitos reservados</div>
    </>
  );
}
