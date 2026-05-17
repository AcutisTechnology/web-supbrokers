"use client";

import { Camera, Eye, FileSignature, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { VisitListItem } from "../types/visit";
import {
  INTEREST_TYPE_LABELS,
  formatVisitDate,
} from "../utils/visit-labels";
import { VisitStatusBadge } from "./status-badge";

type Props = {
  visits: VisitListItem[];
  onDelete: (visit: VisitListItem) => void;
};

export function VisitsTable({ visits, onDelete }: Props) {
  return (
    <>
      {/* Mobile: cards */}
      <div className="space-y-3 md:hidden">
        {visits.map((visit) => (
          <article
            key={visit.id}
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <header className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className="font-semibold text-[#141414]">{visit.visitor_name}</p>
                <p className="text-xs text-[#777777]">{visit.visitor_phone}</p>
              </div>
              <VisitStatusBadge status={visit.status} />
            </header>
            <div className="text-sm text-[#141414]">
              <p className="font-medium">{visit.property_name || "—"}</p>
              <p className="text-xs text-[#777777]">{visit.property_address || "Sem endereço"}</p>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#777777]">
              <span>{formatVisitDate(visit.visited_at)}</span>
              {visit.interest_type ? (
                <span className="rounded-full bg-purple-50 px-2 py-0.5 text-purple-700">
                  {INTEREST_TYPE_LABELS[visit.interest_type]}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1">
                <Camera className="h-3.5 w-3.5" />
                {visit.files_count ?? 0}
              </span>
              {visit.has_signature ? (
                <span className="inline-flex items-center gap-1 text-emerald-700">
                  <FileSignature className="h-3.5 w-3.5" />
                  Assinada
                </span>
              ) : null}
            </div>
            <div className="mt-4 flex gap-2">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link href={`/dashboard/visitas/${visit.id}`}>
                  <Eye className="h-4 w-4 mr-1" /> Ver
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link href={`/dashboard/visitas/${visit.id}/editar`}>
                  <Pencil className="h-4 w-4 mr-1" /> Editar
                </Link>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="text-red-600 hover:bg-red-50"
                onClick={() => onDelete(visit)}
                aria-label="Excluir"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </article>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Imóvel</th>
              <th className="px-4 py-3">Corretor</th>
              <th className="px-4 py-3">Interesse</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3 text-center">Assinatura</th>
              <th className="px-4 py-3 text-center">Fotos</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visits.map((visit) => (
              <tr key={visit.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-[#141414]">{visit.visitor_name}</div>
                  <div className="text-xs text-[#777777]">{visit.visitor_phone}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-[#141414]">{visit.property_name || "—"}</div>
                  <div className="text-xs text-[#777777]">
                    {visit.property_address || "Sem endereço"}
                  </div>
                </td>
                <td className="px-4 py-3 text-[#141414]">{visit.user?.name ?? "—"}</td>
                <td className="px-4 py-3">
                  {visit.interest_type ? (
                    <span className="rounded-full bg-purple-50 px-2 py-0.5 text-xs text-purple-700">
                      {INTEREST_TYPE_LABELS[visit.interest_type]}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <VisitStatusBadge status={visit.status} />
                </td>
                <td className="px-4 py-3 text-[#141414]">{formatVisitDate(visit.visited_at)}</td>
                <td className="px-4 py-3 text-center">
                  {visit.has_signature ? (
                    <FileSignature className="inline h-4 w-4 text-emerald-600" />
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center text-[#141414]">{visit.files_count ?? 0}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Button asChild variant="ghost" size="icon" aria-label="Ver">
                      <Link href={`/dashboard/visitas/${visit.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" size="icon" aria-label="Editar">
                      <Link href={`/dashboard/visitas/${visit.id}/editar`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => onDelete(visit)}
                      aria-label="Excluir"
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
    </>
  );
}
