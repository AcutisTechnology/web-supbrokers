import {
  VisitInterestType,
  VisitPropertyType,
  VisitSource,
  VisitStatus,
} from "../types/visit";

export const STATUS_LABELS: Record<VisitStatus, string> = {
  agendada: "Agendada",
  em_andamento: "Em andamento",
  finalizada: "Finalizada",
  cancelada: "Cancelada",
};

export const STATUS_VARIANTS: Record<VisitStatus, string> = {
  agendada: "bg-blue-50 text-blue-700 border-blue-200",
  em_andamento: "bg-amber-50 text-amber-700 border-amber-200",
  finalizada: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelada: "bg-rose-50 text-rose-700 border-rose-200",
};

export const PROPERTY_TYPE_LABELS: Record<VisitPropertyType, string> = {
  casa: "Casa",
  apartamento: "Apartamento",
  terreno: "Terreno",
  sala_loja: "Sala/Loja",
  outro: "Outro",
};

export const INTEREST_TYPE_LABELS: Record<VisitInterestType, string> = {
  compra: "Compra",
  aluguel: "Aluguel",
  permuta: "Permuta",
};

export const SOURCE_LABELS: Record<VisitSource, string> = {
  instagram: "Instagram",
  site: "Site",
  plataforma: "Plataforma",
  indicacao: "Indicação",
  placa: "Placa",
  outro: "Outro",
};

export function formatVisitDate(value: string | null): string {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}
