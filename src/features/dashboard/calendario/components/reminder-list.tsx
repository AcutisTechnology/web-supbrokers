"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2, Clock, Calendar as CalendarIcon, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Reminder } from "../services/reminder-service";

interface ReminderListProps {
  reminders: Reminder[];
  onEdit: (reminder: Reminder) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number, isCompleted: boolean) => void;
  loading?: boolean;
}

const priorityConfig = {
  low: { label: "Baixa", color: "bg-green-100 text-green-800 border-green-200" },
  medium: { label: "Média", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  high: { label: "Alta", color: "bg-red-100 text-red-800 border-red-200" }
};

const typeConfig = {
  task: { label: "Tarefa", icon: "📋" },
  event: { label: "Evento", icon: "📅" },
  meeting: { label: "Reunião", icon: "👥" },
  call: { label: "Ligação", icon: "📞" },
  visit: { label: "Visita", icon: "🏠" },
  contract: { label: "Contrato", icon: "📄" },
  payment: { label: "Pagamento", icon: "💰" },
  other: { label: "Outro", icon: "📝" }
};

export function ReminderList({ reminders, onEdit, onDelete, onToggleComplete, loading = false }: ReminderListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  // Debug: verificar o que está sendo recebido
  console.log('ReminderList - reminders:', reminders, 'type:', typeof reminders, 'isArray:', Array.isArray(reminders));

  const formatDateTime = (reminder: Reminder) => {
    // Usar os campos formatados do backend quando disponíveis
    const dateStr = reminder.formatted_date || reminder.date;
    const timeStr = reminder.formatted_time || reminder.time;
    
    // Para verificar se é hoje ou passado, usar o datetime
    const reminderDate = new Date(reminder.datetime || reminder.date);
    const today = new Date();
    const isToday = reminderDate.toDateString() === today.toDateString();
    const isPast = reminderDate < today;
    
    return {
      date: dateStr,
      time: timeStr,
      isToday,
      isPast
    };
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    onDelete(id);
    setDeletingId(null);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center animate-pulse">
            <CalendarIcon className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">Carregando lembretes...</p>
        </CardContent>
      </Card>
    );
  }

  // Garantir que reminders é um array válido
  const validReminders = Array.isArray(reminders) ? reminders : [];

  if (validReminders.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <CalendarIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum lembrete criado</h3>
          <p className="text-gray-500 mb-4">Crie seu primeiro lembrete para organizar seus compromissos.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {validReminders.map((reminder) => {
        const { date, time, isToday, isPast } = formatDateTime(reminder);
        const priorityStyle = priorityConfig[reminder.priority];
        const typeInfo = typeConfig[reminder.type];

        return (
          <Card key={reminder.id} className={`transition-all hover:shadow-md ${
            reminder.is_completed ? "opacity-60 bg-gray-50" : ""
          } ${
            isPast && !reminder.is_completed ? "opacity-75 bg-gray-50" : ""
          } ${
            isToday ? "border-[#9747ff] bg-[#9747ff]/5" : ""
          }`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="pt-1">
                  <Checkbox
                    checked={reminder.is_completed}
                    onCheckedChange={(checked) => onToggleComplete(reminder.id, checked as boolean)}
                    className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{typeInfo.icon}</span>
                    <h3 className={`font-medium ${
                      reminder.is_completed ? "line-through text-gray-500" :
                      isPast ? "text-gray-600" : "text-gray-900"
                    }`}>
                      {reminder.title}
                    </h3>
                    {reminder.is_completed && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Concluído
                      </Badge>
                    )}
                    <Badge className={priorityStyle.color}>
                      {priorityStyle.label}
                    </Badge>
                    {isToday && (
                      <Badge className="bg-[#9747ff] text-white">
                        Hoje
                      </Badge>
                    )}
                    {isPast && (
                      <Badge variant="outline" className="text-gray-500">
                        Vencido
                      </Badge>
                    )}
                  </div>
                  
                  {reminder.description && (
                    <p className={`text-sm mb-3 ${
                      reminder.is_completed ? "line-through text-gray-400" :
                      isPast ? "text-gray-500" : "text-gray-600"
                    }`}>
                      {reminder.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>{typeInfo.icon}</span>
                        <span>{typeInfo.label}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(reminder)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir lembrete</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir o lembrete &quot;{reminder.title}&quot;?
                          Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(reminder.id)}
                          className="bg-red-600 hover:bg-red-700"
                          disabled={deletingId === reminder.id}
                        >
                          {deletingId === reminder.id ? "Excluindo..." : "Excluir"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}