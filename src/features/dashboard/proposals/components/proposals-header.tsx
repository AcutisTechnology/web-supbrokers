"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

interface ProposalsHeaderProps {
  search: string;
  setSearch: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
}

export function ProposalsHeader({
  search,
  setSearch,
  status,
  setStatus,
}: ProposalsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-[#4A316A]">Propostas</h1>
        <p className="text-[#969696]">Gerencie suas propostas comerciais</p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative w-full md:w-64">
          <Input
            placeholder="Buscar por imóvel ou cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white border-[#E2E2E2]"
          />
        </div>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full md:w-40 bg-white border-[#E2E2E2]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="PENDING">Pendente</SelectItem>
            <SelectItem value="ACCEPTED">Aceita</SelectItem>
            <SelectItem value="REJECTED">Recusada</SelectItem>
            <SelectItem value="CANCELED">Cancelada</SelectItem>
          </SelectContent>
        </Select>

        <Link href="/dashboard/propostas/nova">
          <Button className="bg-[#4A316A] hover:bg-[#3a2654] text-white w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Nova Proposta
          </Button>
        </Link>
      </div>
    </div>
  );
}
