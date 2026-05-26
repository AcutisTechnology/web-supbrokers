import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/configs/api';

export type AgentSpecialty =
  | 'luxo'
  | 'lancamentos'
  | 'investimento'
  | 'destaque'
  | string;

export interface PublicAgent {
  id: number;
  slug: string;
  name: string;
  role_title: string | null;
  creci: string | null;
  specialty: string | null;
  mini_bio: string | null;
  photo_url: string | null;
  whatsapp: string | null;
  phone: string | null;
  email: string | null;
  instagram: string | null;
  facebook: string | null;
  linkedin: string | null;
  city: string | null;
  neighborhoods: string[];
  specialties: AgentSpecialty[];
  languages: string[];
  years_experience: number | null;
  is_featured: boolean;
}

export interface PublicAgentDetail extends PublicAgent {
  full_bio: string | null;
  banner_url: string | null;
}

interface AgentsListResponse {
  data: PublicAgent[];
}

interface AgentDetailResponse {
  data: PublicAgentDetail;
}

export function useBrokerAgents(brokerSlug: string) {
  return useQuery({
    queryKey: ['broker-agents', brokerSlug],
    queryFn: async () => {
      const response = await api
        .get(`${brokerSlug}/agents`)
        .json<AgentsListResponse>();
      return response.data;
    },
    enabled: !!brokerSlug,
  });
}

export function useBrokerAgentDetail(brokerSlug: string, agentSlug: string) {
  return useQuery({
    queryKey: ['broker-agent', brokerSlug, agentSlug],
    queryFn: async () => {
      const response = await api
        .get(`${brokerSlug}/agents/${agentSlug}`)
        .json<AgentDetailResponse>();
      return response.data;
    },
    enabled: !!brokerSlug && !!agentSlug,
  });
}
