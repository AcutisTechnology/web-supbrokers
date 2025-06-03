export function getAluguelById(id: string) {
  return {
    id,
    imovel: "Rua Renato de Souza Maciel, 660, APT. 402",
    inquilino: "Lucas Santana Ramos Cartaxo",
    valor: "R$ 1.200,00",
    status: "Em dia",
    data_inicio: "2024-01-01",
    data_fim: "2025-01-01",
    garantia: "Caução",
    multa: "10%",
    reajuste: "6%",
    observacoes: "Contrato padrão, reajuste anual pelo IGPM.",
  };
}

export function getPagamentos() {
  return [
    {
      id: 1,
      mes: "Junho 2024",
      dataVencimento: "2024-06-05",
      dataPagamento: "2024-06-03",
      aluguel: 1200.00,
      condominio: 120.00,
      iptu: 75.00,
      total: 1395.00,
      status: "Pago",
      diasAtraso: 0
    },
    {
      id: 2,
      mes: "Maio 2024",
      dataVencimento: "2024-05-05",
      dataPagamento: "2024-05-10",
      aluguel: 1200.00,
      condominio: 120.00,
      iptu: 75.00,
      total: 1395.00,
      status: "Pago com atraso",
      diasAtraso: 5
    },
    {
      id: 3,
      mes: "Abril 2024",
      dataVencimento: "2024-04-05",
      dataPagamento: "2024-04-04",
      aluguel: 1200.00,
      condominio: 120.00,
      iptu: 75.00,
      total: 1395.00,
      status: "Pago",
      diasAtraso: 0
    },
    {
      id: 4,
      mes: "Março 2024",
      dataVencimento: "2024-03-05",
      dataPagamento: "2024-03-20",
      aluguel: 1200.00,
      condominio: 120.00,
      iptu: 75.00,
      total: 1395.00,
      status: "Pago com atraso",
      diasAtraso: 15
    },
    {
      id: 5,
      mes: "Fevereiro 2024",
      dataVencimento: "2024-02-05",
      dataPagamento: "2024-02-02",
      aluguel: 1200.00,
      condominio: 120.00,
      iptu: 75.00,
      total: 1395.00,
      status: "Pago",
      diasAtraso: 0
    },
    {
      id: 6,
      mes: "Janeiro 2024",
      dataVencimento: "2024-01-05",
      dataPagamento: "2024-01-03",
      aluguel: 1200.00,
      condominio: 120.00,
      iptu: 75.00,
      total: 1395.00,
      status: "Pago",
      diasAtraso: 0
    }
  ];
}

export function getReparos() {
  return [
    {
      id: 1,
      titulo: "Troca de torneira",
      descricao: "Substituição da torneira da pia da cozinha devido a vazamento constante",
      status: "Em andamento",
      dataAbertura: "2024-05-10",
      dataConclusao: null,
      responsavel: "João Silva - Encanador",
      telefoneResponsavel: "(11) 99999-9999",
      custo: 150.00,
      recibo: "recibo_torneira_001.pdf",
      observacoes: "Aguardando peça de reposição"
    },
    {
      id: 2,
      titulo: "Pintura da sala",
      descricao: "Repintura completa da sala de estar incluindo rodapés e detalhes",
      status: "Finalizado",
      dataAbertura: "2024-03-15",
      dataConclusao: "2024-04-01",
      responsavel: "Maria Santos - Pintora",
      telefoneResponsavel: "(11) 88888-8888",
      custo: 800.00,
      recibo: "recibo_pintura_002.pdf",
      observacoes: "Trabalho realizado conforme especificação. Tinta premium aplicada."
    }
  ];
} 