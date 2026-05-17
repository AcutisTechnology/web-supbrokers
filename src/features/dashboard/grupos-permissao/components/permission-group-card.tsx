"use client";

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
import {
  useDeletePermissionGroup,
  useTogglePermissionGroupActive,
} from "@/features/dashboard/grupos-permissao/hooks/use-permission-groups";
import { IPermissionGroup } from "@/types/permission-group";
import { Edit2, Loader2, Lock, MoreVertical, Power, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  group: IPermissionGroup;
  onEdit: (group: IPermissionGroup) => void;
}

export function PermissionGroupCard({ group, onEdit }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const deleteMutation = useDeletePermissionGroup();
  const toggleMutation = useTogglePermissionGroupActive();

  const handleToggle = async () => {
    try {
      await toggleMutation.mutateAsync(group.id);
      toast.success(group.active ? "Grupo inativado." : "Grupo ativado.");
    } catch {
      toast.error("Erro ao alterar status do grupo.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(group.id);
      toast.success("Grupo excluído com sucesso.");
    } catch (err: unknown) {
      const msg =
        (err as { response?: Response })?.response
          ? await (err as { response: Response }).response.json().then((r: { message?: string }) => r.message)
          : "Erro ao excluir o grupo.";
      toast.error(msg ?? "Erro ao excluir o grupo.");
    } finally {
      setConfirmDelete(false);
    }
  };

  return (
    <>
      <div
        className={`bg-white rounded-2xl border p-5 flex flex-col gap-4 transition-all duration-200 hover:shadow-md ${
          group.active ? "border-gray-200" : "border-gray-200 opacity-60"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                group.active ? "bg-purple-100" : "bg-gray-100"
              }`}
            >
              <Lock
                size={18}
                className={group.active ? "text-[#9747ff]" : "text-gray-400"}
              />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-[#141414] text-sm truncate">{group.name}</h3>
              {group.description && (
                <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{group.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge
              className={
                group.active
                  ? "bg-emerald-100 text-emerald-700 border-emerald-200 text-xs font-medium"
                  : "bg-gray-100 text-gray-500 border-gray-200 text-xs font-medium"
              }
              variant="outline"
            >
              {group.active ? "Ativo" : "Inativo"}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100">
                  <MoreVertical size={14} className="text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem
                  onClick={() => onEdit(group)}
                  className="gap-2 cursor-pointer"
                >
                  <Edit2 size={13} /> Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleToggle}
                  className="gap-2 cursor-pointer"
                  disabled={toggleMutation.isPending}
                >
                  {toggleMutation.isPending ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Power size={13} />
                  )}
                  {group.active ? "Inativar" : "Ativar"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setConfirmDelete(true)}
                  className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <Trash2 size={13} /> Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-xl px-3 py-2.5 flex items-center gap-2">
            <Users size={14} className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">Usuários</p>
              <p className="text-sm font-semibold text-[#141414]">{group.users_count}</p>
            </div>
          </div>
          <div className="bg-purple-50 rounded-xl px-3 py-2.5 flex items-center gap-2">
            <Lock size={14} className="text-[#9747ff]" />
            <div>
              <p className="text-xs text-[#9747ff]">Permissões</p>
              <p className="text-sm font-semibold text-[#4A316A]">{group.permissions_count}</p>
            </div>
          </div>
        </div>

        {/* Permission tags preview */}
        {group.permissions.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {group.permissions.slice(0, 4).map((p) => (
              <span
                key={p.key}
                className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-medium"
              >
                {p.name}
              </span>
            ))}
            {group.permissions.length > 4 && (
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                +{group.permissions.length - 4} mais
              </span>
            )}
          </div>
        )}
      </div>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir grupo &quot;{group.name}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Grupos com usuários vinculados não podem ser excluídos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteMutation.isPending ? (
                <Loader2 size={14} className="animate-spin mr-1" />
              ) : null}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
