import { CrmLead } from "../services/customer-service";

export function getLeadStatusLabel(status: CrmLead["status"]): string {
  switch (status) {
    case "won":  return "Ganho";
    case "lost": return "Perdido";
    default:     return "Em aberto";
  }
}

export function getLeadStatusColor(status: CrmLead["status"]): string {
  switch (status) {
    case "won":  return "#16ae4f";
    case "lost": return "#e63946";
    default:     return "#9747FF";
  }
}
