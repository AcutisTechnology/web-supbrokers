import { useMutation } from "@tanstack/react-query";

export type FinancingSimulationPayload = {
  percentageFinanced: number;
  amountFinanced: string;
  propertyValue: string;
  propertyType: "financiamento-residencial" | "financiamento-comercial";
  age: number;
  city: string;
  email: string;
  phone: string;
  name: string;
};

export type FinancingInstallment = {
  count: number | string;
  first: string | number;
  last: string | number;
};

export type FinancingBank = {
  name?: string;
  logo?: string;
};

export type FinancingProduct = {
  bank?: FinancingBank;
  amortization?: string;
  adjustment?: string;
  tax?: string | number;
  cet?: string | number;
  installments?: FinancingInstallment[];
  url?: string;
};

export type FinancingSimulationResponse = {
  data?: {
    products?: FinancingProduct[];
  };
};

export function useFinancingSimulation() {
  return useMutation<FinancingSimulationResponse, Error, FinancingSimulationPayload>({
    mutationFn: async (payload) => {
      const response = await fetch("/api/calculator/simulation", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Falha ao consultar a simulação.");
      }

      const json: unknown = await response.json();
      return (json ?? {}) as FinancingSimulationResponse;
    },
  });
}
