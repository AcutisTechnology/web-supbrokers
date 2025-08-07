"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Plus, Settings, Link as LinkIcon, CheckCircle, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/shared/hooks/auth/use-auth";
import { TopNav } from "@/features/dashboard/imoveis/top-nav";
import { ReminderModal } from "@/features/dashboard/calendario/components/reminder-modal";
import { ReminderList } from "@/features/dashboard/calendario/components/reminder-list";
import { GoogleIntegration } from "@/features/dashboard/calendario/components/google-integration";
import { useToast } from "@/hooks/use-toast";
import { Reminder, reminderService, CreateReminderData } from "@/features/dashboard/calendario/services/reminder-service";

// Interface movida para o serviço

export default function CalendarioPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [hasGoogleIntegration, setHasGoogleIntegration] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | undefined>(undefined);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [activeTab, setActiveTab] = useState("reminders");
  const [loading, setLoading] = useState(true);

  // Carregar lembretes da API
  const loadReminders = async () => {
    try {
      setLoading(true);
      const remindersData = await reminderService.getReminders();
      console.log('Page - remindersData received:', remindersData, 'isArray:', Array.isArray(remindersData));
      setReminders(remindersData);
    } catch (error) {
      console.error('Erro ao carregar lembretes:', error);
      // Garantir que sempre temos um array válido
      setReminders([]);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os lembretes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    loadReminders();
    
    // Verificar se o usuário tem integração com Google Calendar
    const googleIntegration = localStorage.getItem('google-calendar-integration');
    setHasGoogleIntegration(googleIntegration === 'true');
  }, []);

  const handleSaveReminder = async (reminderData: CreateReminderData) => {
    try {
      if (editingReminder) {
        // Editando lembrete existente
        await reminderService.updateReminder(editingReminder.id, reminderData);
        await loadReminders(); // Recarrega a lista
        toast({
          title: "Sucesso",
          description: "Lembrete atualizado com sucesso!",
        });
      } else {
        // Criando novo lembrete
        const createData: CreateReminderData = reminderData;
        await reminderService.createReminder(createData);
        await loadReminders(); // Recarrega a lista
        toast({
          title: "Sucesso",
          description: "Lembrete criado com sucesso!",
        });
      }
      
      setShowReminderModal(false);
      setEditingReminder(undefined);
    } catch (error) {
      console.error('Erro ao salvar lembrete:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o lembrete.",
        variant: "destructive",
      });
    }
  };

  const handleEditReminder = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setShowReminderModal(true);
  };

  const handleDeleteReminder = async (id: number) => {
    try {
      await reminderService.deleteReminder(id);
      await loadReminders(); // Recarrega a lista
      toast({
        title: "Sucesso",
        description: "Lembrete excluído com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao deletar lembrete:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o lembrete.",
        variant: "destructive",
      });
    }
  };

  const handleToggleComplete = async (reminderId: number, isCompleted: boolean) => {
    try {
      await reminderService.toggleComplete(reminderId, isCompleted);
      await loadReminders(); // Recarrega a lista
    } catch (error) {
      console.error('Erro ao alterar status do lembrete:', error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status do lembrete.",
        variant: "destructive",
      });
    }
  };

  const handleConnectGoogle = () => {
    setHasGoogleIntegration(true);
    localStorage.setItem('google-calendar-integration', 'true');
  };

  const handleDisconnectGoogle = () => {
    setHasGoogleIntegration(false);
    localStorage.setItem('google-calendar-integration', 'false');
  };

  const openReminderModal = () => {
    setEditingReminder(undefined);
    setShowReminderModal(true);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <TopNav title_secondary="Calendário" />
      
      <div className="space-y-6">
        {/* Header com ações */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#141414] font-display">Calendário</h1>
            <p className="text-[#969696] mt-1 text-sm sm:text-base">Organize seus compromissos e lembretes</p>
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => setActiveTab("integration")}
            >
              <Settings className="w-4 h-4" />
              Integração
            </Button>
            <Button 
              onClick={openReminderModal}
              className="bg-[#9747ff] hover:bg-[#9747ff]/90 gap-2"
            >
              <Plus className="w-4 h-4" />
              Novo Lembrete
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reminders" className="gap-2">
              <Bell className="w-4 h-4" />
              Lembretes
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2">
              <Calendar className="w-4 h-4" />
              Calendário
            </TabsTrigger>
            <TabsTrigger value="integration" className="gap-2">
              <Settings className="w-4 h-4" />
              Integração
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reminders" className="space-y-4">
            <ReminderList
              reminders={reminders}
              onEdit={handleEditReminder}
              onDelete={handleDeleteReminder}
              onToggleComplete={handleToggleComplete}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            {hasGoogleIntegration ? (
              <Card>
                <CardContent className="p-6">
                  <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center space-y-2">
                      <Calendar className="w-16 h-16 text-gray-400 mx-auto" />
                      <p className="text-gray-500">Calendário integrado com Google Calendar</p>
                      <p className="text-sm text-gray-400">Implementação do componente de calendário aqui</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gradient-to-br from-[#9747ff]/5 to-blue-50 border-[#9747ff]/20">
                <CardContent className="p-6 sm:p-8">
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#9747ff] to-blue-600 rounded-2xl flex items-center justify-center">
                      <Calendar className="w-10 h-10 text-white" />
                    </div>
                    
                    <div className="space-y-3">
                      <h2 className="text-xl sm:text-2xl font-bold text-[#141414] font-display">
                        Conecte seu Google Calendar
                      </h2>
                      <p className="text-[#969696] max-w-md mx-auto">
                        Para visualizar seu calendário aqui, conecte sua conta do Google Calendar na aba Integração.
                      </p>
                    </div>
                    
                    <Button 
                      onClick={() => setActiveTab("integration")}
                      className="bg-[#9747ff] hover:bg-[#9747ff]/90 gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Ir para Integração
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="integration" className="space-y-4">
            <GoogleIntegration 
              isConnected={hasGoogleIntegration}
              onConnect={handleConnectGoogle}
              onDisconnect={handleDisconnectGoogle}
              userEmail={user?.user?.email}
            />
          </TabsContent>
        </Tabs>

        </div>
      
      {/* Modal de Lembrete */}
      <ReminderModal
        isOpen={showReminderModal}
        onClose={() => {
          setShowReminderModal(false);
          setEditingReminder(undefined);
        }}
        onSave={handleSaveReminder}
        reminder={editingReminder}
        loading={loading}
      />
    </>
  );
}