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
import { LoadingState } from "@/components/ui/loading-state";
import { ArrowLeft, ArrowDown, ArrowUp, Pencil, Plus, Star, Trash2, UserCircle2 } from "lucide-react";
import {
  type AgentProfile,
  type AgentProfilePayload,
  useAgentProfiles,
} from "../services/agent-profiles-service";
import { AgentProfileForm } from "./agent-profile-form";

type Mode = "list" | "create" | "edit";

export function AgentProfilesManager() {
  const {
    agents,
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
  } = useAgentProfiles();

  const [mode, setMode] = useState<Mode>("list");
  const [editing, setEditing] = useState<AgentProfile | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<AgentProfile | null>(null);

  const startCreate = () => {
    setEditing(null);
    setMode("create");
  };

  const startEdit = (agent: AgentProfile) => {
    setEditing(agent);
    setMode("edit");
  };

  const backToList = () => {
    setMode("list");
    setEditing(null);
  };

  const handleSubmit = async (payload: AgentProfilePayload) => {
    if (mode === "create") {
      await create(payload);
    } else if (editing) {
      await update({ id: editing.id, payload });
    }
    backToList();
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const next = [...agents];
    const tmp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = tmp;
    await reorder(next.map((a, i) => ({ id: a.id, sort_order: i })));
  };

  const moveDown = async (index: number) => {
    if (index === agents.length - 1) return;
    const next = [...agents];
    const tmp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = tmp;
    await reorder(next.map((a, i) => ({ id: a.id, sort_order: i })));
  };

  if (mode !== "list") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={backToList}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para a lista
          </Button>
          {mode === "edit" && editing && (
            <span className="text-xs text-[#777777]">Editando: {editing.name}</span>
          )}
        </div>
        <AgentProfileForm
          initial={editing}
          onSubmit={handleSubmit}
          onCancel={backToList}
          isSubmitting={isCreating || isUpdating}
        />
      </div>
    );
  }

  return (
    <>
      <LoadingState isLoading={isLoading} isError={isError} error={error ?? undefined} onRetry={() => refetch()} />

      {!isLoading && !isError && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#141414] font-medium">
                {agents.length === 0
                  ? "Nenhum corretor cadastrado"
                  : `${agents.length} ${agents.length === 1 ? "corretor cadastrado" : "corretores cadastrados"}`}
              </p>
              <p className="text-xs text-[#777777]">
                A ordem aqui define a ordem na página /equipe do site público.
              </p>
            </div>
            <Button
              onClick={startCreate}
              className="bg-gradient-to-r from-[#9747FF] to-[#7C3AED] hover:from-[#9747FF]/90 hover:to-[#7C3AED]/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo corretor
            </Button>
          </div>

          {agents.length === 0 ? (
            <div className="text-center py-14 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <UserCircle2 className="w-10 h-10 text-[#9747FF]/60 mx-auto mb-3" />
              <p className="text-sm font-medium text-[#141414]">Comece cadastrando o primeiro corretor</p>
              <p className="text-xs text-[#777777] mt-1 max-w-md mx-auto">
                Os corretores aqui cadastrados serão exibidos na página de Equipe do site público.
              </p>
              <Button onClick={startCreate} className="mt-5">
                <Plus className="w-4 h-4 mr-2" />
                Novo corretor
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {agents.map((agent, i) => (
                <AgentRow
                  key={agent.id}
                  agent={agent}
                  canMoveUp={i > 0}
                  canMoveDown={i < agents.length - 1}
                  isBusy={isReordering || isRemoving}
                  onEdit={() => startEdit(agent)}
                  onDelete={() => setConfirmDelete(agent)}
                  onMoveUp={() => moveUp(i)}
                  onMoveDown={() => moveDown(i)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <AlertDialog open={!!confirmDelete} onOpenChange={open => !open && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover corretor</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover <strong>{confirmDelete?.name}</strong> da equipe? Esta
              ação pode ser desfeita restaurando o registro depois.
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

function AgentRow({
  agent,
  canMoveUp,
  canMoveDown,
  isBusy,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  agent: AgentProfile;
  canMoveUp: boolean;
  canMoveDown: boolean;
  isBusy: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-3 hover:border-[#9747FF]/30 transition-colors">
      {/* Reorder controls */}
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={!canMoveUp || isBusy}
          aria-label="Mover para cima"
          className="w-6 h-6 rounded border border-gray-200 text-[#777777] hover:border-[#9747FF]/30 hover:text-[#9747FF] disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center justify-center"
        >
          <ArrowUp className="w-3 h-3" />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={!canMoveDown || isBusy}
          aria-label="Mover para baixo"
          className="w-6 h-6 rounded border border-gray-200 text-[#777777] hover:border-[#9747FF]/30 hover:text-[#9747FF] disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center justify-center"
        >
          <ArrowDown className="w-3 h-3" />
        </button>
      </div>

      {/* Photo */}
      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
        {agent.photo_url ? (
          <Image src={agent.photo_url} alt={agent.name} fill sizes="48px" className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#9747FF]/60">
            <UserCircle2 className="w-6 h-6" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-[#141414] truncate">{agent.name}</p>
          {agent.is_featured && (
            <Badge className="bg-amber-100 text-amber-700 border border-amber-200 text-[10px] font-medium">
              <Star className="w-2.5 h-2.5 mr-1" />
              Destaque
            </Badge>
          )}
          {!agent.is_public && (
            <Badge className="bg-gray-100 text-gray-600 border border-gray-200 text-[10px]">
              Oculto
            </Badge>
          )}
        </div>
        <p className="text-xs text-[#777777] truncate">
          {[agent.role_title, agent.city].filter(Boolean).join(" · ") || "—"}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Pencil className="w-4 h-4 mr-1.5" />
          Editar
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
