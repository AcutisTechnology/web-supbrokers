import { api } from '@/shared/configs/api';
import type { AluguelListItem } from '../types/aluguel-list-item';

export async function getAluguelById(id: string) {
  return await api.get(`alugueis/${id}`).json();
}

export async function getAlugueis(): Promise<AluguelListItem[]> {
  return await api.get('alugueis').json<AluguelListItem[]>();
}

export async function getPagamentos(aluguelId: string) {
  return await api.get(`alugueis/${aluguelId}/pagamentos`).json();
}

export async function getReparos(aluguelId: string) {
  return await api.get(`alugueis/${aluguelId}/reparos`).json();
} 