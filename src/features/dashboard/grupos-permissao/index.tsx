"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import { PermissionGroupCard } from "./components/permission-group-card";
import { PermissionGroupModal } from "./components/permission-group-modal";
import { usePermissionGroups } from "./hooks/use-permission-groups";
import { IPermissionGroup } from "@/types/permission-group";
import { Lock, Plus, Search, SlidersHorizontal } from "lucide-react";
import { useCallback, useState } from "react";
import { Badge } from "@/components/ui/badge";

export function GruposPermissaoFeature() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<IPermissionGroup | null>(null);

  const { data, isLoading, isError, refetch } = usePermissionGroups({
    search: search || undefined,
    active: activeFilter,
    page,
    per_page: 12,
  });

  const groups = data?.data ?? [];
  const meta = data?.meta;

  const handleEdit = useCallback((group: IPermissionGroup) => {
    setEditingGroup(group);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setEditingGroup(null);
  }, []);

  const handleNewGroup = () => {
    setEditingGroup(null);
    setModalOpen(true);
  };

  const cycleActiveFilter = () => {
    setActiveFilter((prev) => {
      if (prev === undefined) return true;
      if (prev === true) return false;
      return undefined;
    });
    setPage(1);
  };

  const activeFilterLabel =
    activeFilter === true ? "Ativos" : activeFilter === false ? "Inativos" : "Todos";

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar grupo..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-8 border-gray-200 focus:border-[#9747ff] focus:ring-[#9747ff]/20"
          />
        </div>

        <Button
          variant="outline"
          onClick={cycleActiveFilter}
          className="gap-2 border-gray-200 text-gray-700 shrink-0"
        >
          <SlidersHorizontal size={14} />
          {activeFilterLabel}
          {activeFilter !== undefined && (
            <Badge
              className={`ml-1 text-xs px-1.5 ${
                activeFilter
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gray-100 text-gray-500"
              }`}
              variant="outline"
            >
              {activeFilter ? "Ativo" : "Inativo"}
            </Badge>
          )}
        </Button>

        <Button
          onClick={handleNewGroup}
          className="bg-[#9747ff] hover:bg-[#7b35d4] text-white gap-2 shrink-0"
        >
          <Plus size={14} />
          Novo Grupo
        </Button>
      </div>

      {/* Summary bar */}
      {meta && (
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>
            <strong className="text-[#141414]">{meta.total}</strong>{" "}
            {meta.total === 1 ? "grupo encontrado" : "grupos encontrados"}
          </span>
          {meta.last_page > 1 && (
            <span>
              Página {meta.current_page} de {meta.last_page}
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <LoadingState
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        loadingMessage="Carregando grupos de permissão..."
        errorMessage="Erro ao carregar grupos. Tente novamente."
      />

      {!isLoading && !isError && groups.length === 0 && (
        <EmptyState
          icon={<Lock className="h-6 w-6 text-[#9747ff]" />}
          title="Nenhum grupo encontrado"
          description={
            search
              ? `Nenhum grupo corresponde à busca "${search}".`
              : "Crie o primeiro grupo de permissão para começar a organizar os acessos."
          }
          action={
            !search
              ? { label: "Criar primeiro grupo", onClick: handleNewGroup }
              : undefined
          }
        />
      )}

      {!isLoading && !isError && groups.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group) => (
              <PermissionGroupCard key={group.id} group={group} onEdit={handleEdit} />
            ))}
          </div>

          {/* Paginação */}
          {meta && meta.last_page > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                className="border-gray-200"
              >
                Anterior
              </Button>
              <span className="text-sm text-gray-500">
                {meta.current_page} / {meta.last_page}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page === meta.last_page}
                className="border-gray-200"
              >
                Próxima
              </Button>
            </div>
          )}
        </>
      )}

      <PermissionGroupModal
        open={modalOpen}
        onClose={handleCloseModal}
        group={editingGroup}
      />
    </div>
  );
}
