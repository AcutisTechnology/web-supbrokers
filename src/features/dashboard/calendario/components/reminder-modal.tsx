"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type Reminder, type CreateReminderData } from "@/features/dashboard/calendario/services/reminder-service";

const reminderSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  reminder_date: z.string().min(1, "Data é obrigatória"),
  reminder_time: z.string().min(1, "Horário é obrigatório"),
  priority: z.enum(["low", "medium", "high"]),
  type: z.enum(["task", "event", "meeting", "call", "visit", "contract", "payment", "other"])
});

type ReminderFormValues = z.infer<typeof reminderSchema>;

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reminder: CreateReminderData) => void;
  reminder?: Reminder;
  loading?: boolean;
}

const priorityOptions = [
  { value: "low", label: "Baixa", color: "text-green-600" },
  { value: "medium", label: "Média", color: "text-yellow-600" },
  { value: "high", label: "Alta", color: "text-red-600" }
];

const typeOptions = [
  { value: "task", label: "Tarefa", icon: "📋" },
  { value: "event", label: "Evento", icon: "📅" },
  { value: "meeting", label: "Reunião", icon: "👥" },
  { value: "call", label: "Ligação", icon: "📞" },
  { value: "visit", label: "Visita", icon: "🏠" },
  { value: "contract", label: "Contrato", icon: "📄" },
  { value: "payment", label: "Pagamento", icon: "💰" },
  { value: "other", label: "Outro", icon: "📝" }
];

export function ReminderModal({ isOpen, onClose, onSave, reminder, loading = false }: ReminderModalProps) {
  const { toast } = useToast();

  const form = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderSchema),
    defaultValues: reminder || {
      title: "",
      description: "",
      reminder_date: "",
      reminder_time: "",
      priority: "medium",
      type: "task"
    }
  });

  const handleSubmit = async (data: ReminderFormValues) => {
    onSave(data);
    form.reset();
    onClose();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#9747ff]" />
            {reminder ? "Editar Lembrete" : "Novo Lembrete"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Reunião com cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Detalhes adicionais sobre o lembrete..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="reminder_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Data
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reminder_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Horário
                    </FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {typeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <span className="flex items-center gap-2">
                            <span>{option.icon}</span>
                            {option.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prioridade</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a prioridade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {priorityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <span className={option.color}>{option.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-[#9747ff] hover:bg-[#9747ff]/90"
              >
                {loading ? "Salvando..." : reminder ? "Atualizar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}