import { Customer } from "../services/customer-service";

export function getClienteSituacao(cliente: Customer): string {
  if (cliente.interested_properties && cliente.interested_properties.length > 0) {
    return "Interessado";
  }
  return "Em análise";
}

export function getCorSituacao(situacao: string): string {
  switch (situacao) {
    case "Interessado":
      return "#16ae4f";
    case "Sem interesse":
      return "#e63946";
    case "Em análise":
    default:
      return "#969696";
  }
} 