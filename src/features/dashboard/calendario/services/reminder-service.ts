import { api } from '@/shared/configs/api';

export interface Reminder {
  id: number;
  title: string;
  description?: string;
  // Campos originais para compatibilidade
  reminder_date?: string;
  reminder_time?: string;
  // Novos campos retornados pelo backend
  date: string;
  time: string;
  datetime: string;
  formatted_date: string;
  formatted_time: string;
  priority: 'low' | 'medium' | 'high';
  type: 'task' | 'event' | 'meeting' | 'call' | 'visit' | 'contract' | 'payment' | 'other';
  is_completed: boolean;
  is_overdue: boolean;
  completed_at?: string | null;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateReminderData {
  title: string;
  description?: string;
  reminder_date: string;
  reminder_time: string;
  priority: 'low' | 'medium' | 'high';
  type: 'task' | 'event' | 'meeting' | 'call' | 'visit' | 'contract' | 'payment' | 'other';
}

export interface UpdateReminderData extends Partial<CreateReminderData> {
  is_completed?: boolean;
}

class ReminderService {
  private baseUrl = 'reminders';

  async getReminders(): Promise<Reminder[]> {
    try {
      // O Laravel retorna uma estrutura aninhada: { data: { data: [], current_page: 1, ... }, success: true }
      const response = await api.get(this.baseUrl).json<{
        data: {
          data: Reminder[];
          current_page: number;
          last_page: number;
          total: number;
        };
        success: boolean;
      }>();
      console.log('ReminderService - API response:', response);
      
      // Acessar o array de lembretes na estrutura aninhada
      const result = Array.isArray(response?.data?.data) ? response.data.data : [];
      console.log('ReminderService - returning:', result, 'isArray:', Array.isArray(result));
      return result;
    } catch (error) {
      console.error('Erro ao buscar lembretes:', error);
      // Retornar array vazio em caso de erro ao invés de lançar exceção
      return [];
    }
  }

  async createReminder(data: CreateReminderData): Promise<Reminder> {
    try {
      // Mapear os campos para o formato esperado pelo backend
      const backendData = {
        title: data.title,
        description: data.description,
        date: data.reminder_date,
        time: data.reminder_time,
        priority: data.priority,
        type: data.type
      };
      const response = await api.post(this.baseUrl, { json: backendData }).json<{ data: Reminder }>();
      return response.data;
    } catch (error) {
      console.error('Erro ao criar lembrete:', error);
      throw new Error('Falha ao criar lembrete');
    }
  }

  async updateReminder(id: number, data: UpdateReminderData): Promise<Reminder> {
    try {
      // Mapear os campos para o formato esperado pelo backend
      const backendData: Partial<{
        title: string;
        description?: string;
        date: string;
        time: string;
        priority: 'low' | 'medium' | 'high';
        type: 'task' | 'event' | 'meeting' | 'call' | 'visit' | 'contract' | 'payment' | 'other';
        is_completed: boolean;
      }> = {};
      if (data.title !== undefined) backendData.title = data.title;
      if (data.description !== undefined) backendData.description = data.description;
      if (data.reminder_date !== undefined) backendData.date = data.reminder_date;
      if (data.reminder_time !== undefined) backendData.time = data.reminder_time;
      if (data.priority !== undefined) backendData.priority = data.priority;
      if (data.type !== undefined) backendData.type = data.type;
      if (data.is_completed !== undefined) backendData.is_completed = data.is_completed;
      
      const response = await api.patch(`${this.baseUrl}/${id}`, { json: backendData }).json<{ data: Reminder }>();
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar lembrete:', error);
      throw new Error('Falha ao atualizar lembrete');
    }
  }

  async deleteReminder(id: number): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Erro ao excluir lembrete:', error);
      throw new Error('Falha ao excluir lembrete');
    }
  }

  async toggleComplete(id: number, isCompleted: boolean): Promise<Reminder> {
    try {
      const response = await api.patch(`${this.baseUrl}/${id}`, {
        json: { is_completed: isCompleted }
      }).json<{ data: Reminder }>();
      return response.data;
    } catch (error) {
      console.error('Erro ao alterar status do lembrete:', error);
      throw new Error('Falha ao alterar status do lembrete');
    }
  }
}

export const reminderService = new ReminderService();