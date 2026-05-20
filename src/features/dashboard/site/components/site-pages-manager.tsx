"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Home,
  EyeOff,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useSitePages } from "../hooks/use-site-pages";
import {
  PAGE_TYPE_LABELS,
  type SitePage,
} from "../services/site-pages-service";
import { SitePageForm, type SitePageFormValues } from "./site-pages-form";

interface SitePagesManagerProps {
  onActivePageChange?: (page: SitePage | undefined) => void;
  onDraftChange?: (values: SitePageFormValues | null) => void;
}

export function SitePagesManager({ onActivePageChange, onDraftChange }: SitePagesManagerProps) {
  const {
    pages,
    isLoading,
    create,
    isCreating,
    update,
    isUpdating,
    remove,
    isRemoving,
    setHome,
    isSettingHome,
    togglePublish,
    isTogglingPublish,
  } = useSitePages();

  const [editing, setEditing] = useState<SitePage | null>(null);
  const [creating, setCreating] = useState(false);
  const [toDelete, setToDelete] = useState<SitePage | null>(null);

  const sortedPages = useMemo(() => {
    return [...pages].sort((a, b) => {
      if (a.is_home && !b.is_home) return -1;
      if (!a.is_home && b.is_home) return 1;
      return a.menu_order - b.menu_order || a.id - b.id;
    });
  }, [pages]);

  const closeDialog = () => {
    setEditing(null);
    setCreating(false);
    onActivePageChange?.(undefined);
    onDraftChange?.(null);
  };

  const handleCreateSubmit = async (values: SitePageFormValues) => {
    await create({
      title: values.title,
      slug: values.slug,
      page_type: values.page_type,
      hero_title: values.hero_title || null,
      hero_subtitle: values.hero_subtitle || null,
      content: values.content || null,
      featured_image: values.featured_image || null,
      is_published: values.is_published,
      show_in_menu: values.show_in_menu,
      menu_order: values.menu_order,
    });
    closeDialog();
  };

  const handleUpdateSubmit = async (values: SitePageFormValues) => {
    if (!editing) return;
    await update({
      id: editing.id,
      payload: {
        title: values.title,
        slug: editing.is_home ? editing.slug : values.slug,
        page_type: editing.is_home ? editing.page_type : values.page_type,
        hero_title: values.hero_title || null,
        hero_subtitle: values.hero_subtitle || null,
        content: values.content || null,
        featured_image: values.featured_image || null,
        is_published: values.is_published,
        show_in_menu: values.show_in_menu,
        menu_order: values.menu_order,
      },
    });
    closeDialog();
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await remove(toDelete.id);
    } finally {
      setToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button
          onClick={() => {
            setCreating(true);
            setEditing(null);
            onActivePageChange?.(undefined);
          }}
          className="bg-gradient-to-r from-[#9747FF] to-[#7C3AED] hover:from-[#9747FF]/90 hover:to-[#7C3AED]/90"
        >
          <Plus className="h-4 w-4 mr-1" />
          Nova Página
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E2E2] overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-[#E2E2E2]">
              <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">TÍTULO</th>
              <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">SLUG</th>
              <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">TIPO</th>
              <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">PUBLICADA</th>
              <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">MENU</th>
              <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">ORDEM</th>
              <th className="text-right px-4 py-3 font-semibold text-[#4A316A]">AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-[#777777]">
                  Carregando...
                </td>
              </tr>
            )}
            {!isLoading && sortedPages.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-[#777777]">
                  Nenhuma página cadastrada.
                </td>
              </tr>
            )}
            {sortedPages.map((page) => (
              <tr key={page.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50">
                <td className="px-4 py-3 text-[#141414] font-medium">
                  <div className="flex items-center gap-2">
                    <span>{page.title}</span>
                    {page.is_home && (
                      <Badge className="bg-[#9747FF]/10 text-[#9747FF] border border-[#9747FF]/20">
                        Home
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-[#141414]">
                  <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{page.slug}</code>
                </td>
                <td className="px-4 py-3 text-[#141414]">{PAGE_TYPE_LABELS[page.page_type]}</td>
                <td className="px-4 py-3">
                  {page.is_published ? (
                    <Badge className="bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]">Sim</Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-[#777777] border border-gray-200">Não</Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-[#141414]">{page.show_in_menu ? "Sim" : "Não"}</td>
                <td className="px-4 py-3 text-[#141414]">{page.menu_order}</td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-1">
                    {!page.is_home && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        title="Definir como home"
                        onClick={() => setHome(page.id)}
                        disabled={isSettingHome}
                      >
                        <Home className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      title={page.is_published ? "Despublicar" : "Publicar"}
                      onClick={() => togglePublish(page.id)}
                      disabled={isTogglingPublish || (page.is_home && page.is_published)}
                    >
                      {page.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      title="Editar"
                      onClick={() => {
                        setEditing(page);
                        setCreating(false);
                        onActivePageChange?.(page);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      title="Excluir"
                      onClick={() => setToDelete(page)}
                      disabled={isRemoving || page.is_home}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={creating || editing !== null} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar página" : "Nova página"}</DialogTitle>
            <DialogDescription>
              Configure os campos abaixo. O conteúdo principal aceita HTML simples.
            </DialogDescription>
          </DialogHeader>

          <SitePageForm
            initial={editing}
            isSubmitting={editing ? isUpdating : isCreating}
            onSubmit={editing ? handleUpdateSubmit : handleCreateSubmit}
            onChange={(values) => onDraftChange?.(values)}
            onCancel={closeDialog}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={toDelete !== null} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir página</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a página &quot;{toDelete?.title}&quot;? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemoving}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isRemoving}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
