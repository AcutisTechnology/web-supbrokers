import { useMemo } from "react";
import { getAluguelById, getPagamentos, getReparos } from "../services/aluguel-service";

export function useAluguelDetalhe(id: string) {
  // Função para formatar data para o padrão brasileiro
  function formatDateBR(dateStr: string) {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  }

  // Dados mockados (futuramente pode ser fetch/React Query)
  const aluguel = useMemo(() => getAluguelById(id), [id]);
  const pagamentos = useMemo(() => getPagamentos(), []);
  const reparos = useMemo(() => getReparos(), []);

  // Dados financeiros mockados
  const financeiro = useMemo(() => ({
    pagamentosEmDia: 12000,
    pagamentosAtraso: 2000,
    custoReparos: 800,
    custoCondominio: 1500,
    custoIptu: 900,
    grafico: [
      { name: "Jan", Recebido: 1200, Atrasado: 200, Reparos: 100, Condominio: 120, IPTU: 80 },
      { name: "Fev", Recebido: 1100, Atrasado: 300, Reparos: 200, Condominio: 120, IPTU: 80 },
      { name: "Mar", Recebido: 1000, Atrasado: 400, Reparos: 300, Condominio: 120, IPTU: 80 },
      { name: "Abr", Recebido: 1300, Atrasado: 100, Reparos: 200, Condominio: 120, IPTU: 80 },
      { name: "Mai", Recebido: 1400, Atrasado: 0, Reparos: 0, Condominio: 120, IPTU: 80 },
      { name: "Jun", Recebido: 1500, Atrasado: 0, Reparos: 0, Condominio: 120, IPTU: 80 },
    ],
  }), []);

  return { aluguel, pagamentos, reparos, financeiro, formatDateBR };
} 