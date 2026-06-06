import { api } from "@/shared/configs/api";
import { Proposal, CreateProposalDTO, UpdateProposalDTO } from "../types/proposal";

export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export const proposalService = {
  async getAll(page = 1, search = "", status?: string) {
    const searchParams = new URLSearchParams({
      page: String(page),
      ...(search && { search }),
      ...(status && { status }),
    });
    
    return api.get(`proposals?${searchParams.toString()}`).json<PaginatedResponse<Proposal>>();
  },

  async getById(id: number) {
    return api.get(`proposals/${id}`).json<{ data: Proposal }>();
  },

  async getByToken(token: string) {
    return api.get(`public/proposals/${token}`).json<{ data: Proposal }>();
  },

  async create(data: CreateProposalDTO) {
    return api.post("proposals", { json: data }).json<{ data: Proposal }>();
  },

  async update(id: number, data: UpdateProposalDTO) {
    return api.put(`proposals/${id}`, { json: data }).json<{ data: Proposal }>();
  },

  async delete(id: number) {
    return api.delete(`proposals/${id}`).json<void>();
  },

  async duplicate(id: number) {
    return api.post(`proposals/${id}/duplicate`).json<{ data: Proposal }>();
  },

  async accept(token: string) {
    return api.post(`public/proposals/${token}/accept`).json<void>();
  },

  async reject(token: string) {
    return api.post(`public/proposals/${token}/reject`).json<void>();
  },
};
