import { useCrmLeads, useInfiniteCrmLeads, CrmLead, CrmLeadsFilters } from "@/features/dashboard/crm/services/crm-service";

export type { CrmLead };
export type { CrmLeadsFilters };

export function useLeads(filters?: CrmLeadsFilters) {
  return useCrmLeads(filters);
}

export function useInfiniteLeads(filters?: CrmLeadsFilters) {
  return useInfiniteCrmLeads(filters);
}
