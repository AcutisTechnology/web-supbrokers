import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/shared/configs/api";

// Interface para os recursos do plano
export interface PlanFeature {
  id: number;
  name: string;
  description: string;
  included: boolean;
}

// Interface para os dados do plano
export interface Plan {
  id: number;
  name: string;
  description: string;
  price: number;
  interval: "monthly" | "yearly";
  features: PlanFeature[];
  is_current: boolean;
  properties_limit: number;
  highlight: boolean;
}

// Interface para a resposta da API de planos
export interface PlansResponse {
  data: Plan[];
  success: boolean;
}

// Interface para a resposta da API de um plano específico
export interface PlanResponse {
  data: Plan;
  success: boolean;
}

// Interface para os dados de pagamento
export interface PaymentData {
  plan_id: number;
  payment_method: "credit_card" | "pix" | "boleto";
  card_number?: string;
  card_holder_name?: string;
  card_expiry_month?: string;
  card_expiry_year?: string;
  card_cvv?: string;
}

// Interface para a resposta da API de pagamento
export interface PaymentResponse {
  data: {
    id: number;
    status: "pending" | "approved" | "rejected";
    payment_url?: string; // URL para pagamento via PIX ou boleto
  };
  success: boolean;
}

// Dados mockados de planos
const MOCK_PLANS: Plan[] = [
  {
    id: 1,
    name: "Básico",
    description: "Ideal para corretores iniciantes",
    price: 49.9,
    interval: "monthly",
    is_current: true,
    properties_limit: 10,
    highlight: false,
    features: [
      { id: 1, name: "Até 10 imóveis", description: "", included: true },
      { id: 2, name: "Página de imóveis", description: "", included: true },
      { id: 3, name: "Captação de leads", description: "", included: true },
      { id: 4, name: "Suporte por email", description: "", included: true },
      { id: 5, name: "Relatórios avançados", description: "", included: false },
      {
        id: 6,
        name: "Integração com portais",
        description: "",
        included: false,
      },
    ],
  },
  {
    id: 2,
    name: "Profissional",
    description: "Para corretores que querem crescer",
    price: 99.9,
    interval: "monthly",
    is_current: false,
    properties_limit: 50,
    highlight: true,
    features: [
      { id: 1, name: "Até 50 imóveis", description: "", included: true },
      { id: 2, name: "Página de imóveis", description: "", included: true },
      { id: 3, name: "Captação de leads", description: "", included: true },
      {
        id: 4,
        name: "Suporte por email e chat",
        description: "",
        included: true,
      },
      { id: 5, name: "Relatórios avançados", description: "", included: true },
      {
        id: 6,
        name: "Integração com portais",
        description: "",
        included: false,
      },
    ],
  },
  {
    id: 3,
    name: "Empresarial",
    description: "Para imobiliárias e equipes",
    price: 199.9,
    interval: "monthly",
    is_current: false,
    properties_limit: 200,
    highlight: false,
    features: [
      { id: 1, name: "Até 200 imóveis", description: "", included: true },
      { id: 2, name: "Página de imóveis", description: "", included: true },
      { id: 3, name: "Captação de leads", description: "", included: true },
      { id: 4, name: "Suporte prioritário", description: "", included: true },
      { id: 5, name: "Relatórios avançados", description: "", included: true },
      {
        id: 6,
        name: "Integração com portais",
        description: "",
        included: true,
      },
    ],
  },
  {
    id: 4,
    name: "Básico Anual",
    description: "Ideal para corretores iniciantes",
    price: 479.0,
    interval: "yearly",
    is_current: false,
    properties_limit: 10,
    highlight: false,
    features: [
      { id: 1, name: "Até 10 imóveis", description: "", included: true },
      { id: 2, name: "Página de imóveis", description: "", included: true },
      { id: 3, name: "Captação de leads", description: "", included: true },
      { id: 4, name: "Suporte por email", description: "", included: true },
      { id: 5, name: "Relatórios avançados", description: "", included: false },
      {
        id: 6,
        name: "Integração com portais",
        description: "",
        included: false,
      },
    ],
  },
  {
    id: 5,
    name: "Profissional Anual",
    description: "Para corretores que querem crescer",
    price: 959.0,
    interval: "yearly",
    is_current: false,
    properties_limit: 50,
    highlight: true,
    features: [
      { id: 1, name: "Até 50 imóveis", description: "", included: true },
      { id: 2, name: "Página de imóveis", description: "", included: true },
      { id: 3, name: "Captação de leads", description: "", included: true },
      {
        id: 4,
        name: "Suporte por email e chat",
        description: "",
        included: true,
      },
      { id: 5, name: "Relatórios avançados", description: "", included: true },
      {
        id: 6,
        name: "Integração com portais",
        description: "",
        included: false,
      },
    ],
  },
  {
    id: 6,
    name: "Empresarial Anual",
    description: "Para imobiliárias e equipes",
    price: 1919.0,
    interval: "yearly",
    is_current: false,
    properties_limit: 200,
    highlight: false,
    features: [
      { id: 1, name: "Até 200 imóveis", description: "", included: true },
      { id: 2, name: "Página de imóveis", description: "", included: true },
      { id: 3, name: "Captação de leads", description: "", included: true },
      { id: 4, name: "Suporte prioritário", description: "", included: true },
      { id: 5, name: "Relatórios avançados", description: "", included: true },
      {
        id: 6,
        name: "Integração com portais",
        description: "",
        included: true,
      },
    ],
  },
];

// Hook para buscar todos os planos disponíveis (mockado)
export function usePlans() {
  return useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      // Simular um delay de rede
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        data: MOCK_PLANS,
        success: true,
      } as PlansResponse;
    },
  });
}

// Hook para buscar um plano específico (mockado)
export function usePlan(id: number) {
  return useQuery({
    queryKey: ["plan", id],
    queryFn: async () => {
      // Simular um delay de rede
      await new Promise((resolve) => setTimeout(resolve, 300));

      const plan = MOCK_PLANS.find((p) => p.id === id);

      if (!plan) {
        throw new Error("Plano não encontrado");
      }

      return {
        data: plan,
        success: true,
      } as PlanResponse;
    },
    enabled: !!id,
  });
}

// Hook para buscar o plano atual do usuário (mockado)
export function useCurrentPlan() {
  return useQuery({
    queryKey: ["current-plan"],
    queryFn: async () => {
      // Simular um delay de rede
      await new Promise((resolve) => setTimeout(resolve, 400));

      const currentPlan = MOCK_PLANS.find((p) => p.is_current);

      if (!currentPlan) {
        throw new Error("Plano atual não encontrado");
      }

      return {
        data: currentPlan,
        success: true,
      } as PlanResponse;
    },
  });
}

// Mock de URL de QR Code PIX
const MOCK_PIX_QR_CODE =
  "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020126580014BR.GOV.BCB.PIX0136a629532e-7693-4846-b028-f142a1dd1d5e5204000053039865802BR5913Supbrokers6008Sao Paulo62070503***6304E2CA";

// Hook para processar o pagamento e upgrade do plano (mockado)
export function useUpgradePlan() {
  return useMutation({
    mutationFn: async (data: PaymentData) => {
      // Simular um delay de rede
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simular uma resposta de sucesso
      return {
        data: {
          id: Math.floor(Math.random() * 1000),
          status: "approved",
          payment_url:
            data.payment_method === "pix"
              ? MOCK_PIX_QR_CODE
              : data.payment_method === "boleto"
              ? "https://exemplo.com/boleto/12345"
              : undefined,
        },
        success: true,
      } as PaymentResponse;
    },
  });
}
