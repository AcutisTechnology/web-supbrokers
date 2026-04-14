import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { proposalService } from "../services/proposal-service";
import { CreateProposalDTO, UpdateProposalDTO } from "../types/proposal";
import { useToast } from "@/hooks/use-toast";

export function useProposals(page = 1, search = "", status?: string) {
  return useQuery({
    queryKey: ["proposals", page, search, status],
    queryFn: () => proposalService.getAll(page, search, status),
  });
}

export function useProposal(id?: number) {
  return useQuery({
    queryKey: ["proposal", id],
    queryFn: () => proposalService.getById(id!),
    enabled: !!id,
  });
}

export function usePublicProposal(token?: string) {
  return useQuery({
    queryKey: ["public-proposal", token],
    queryFn: () => proposalService.getByToken(token!),
    enabled: !!token,
  });
}

export function useCreateProposal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateProposalDTO) => proposalService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      toast({ title: "Sucesso", description: "Proposta criada com sucesso!" });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Erro", description: "Erro ao criar proposta." });
    },
  });
}

export function useUpdateProposal(id: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: UpdateProposalDTO) => proposalService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      queryClient.invalidateQueries({ queryKey: ["proposal", id] });
      toast({ title: "Sucesso", description: "Proposta atualizada com sucesso!" });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Erro", description: "Erro ao atualizar proposta." });
    },
  });
}

export function useDeleteProposal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => proposalService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      toast({ title: "Sucesso", description: "Proposta excluída com sucesso!" });
    },
  });
}

export function useDuplicateProposal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => proposalService.duplicate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      toast({ title: "Sucesso", description: "Proposta duplicada com sucesso!" });
    },
  });
}
