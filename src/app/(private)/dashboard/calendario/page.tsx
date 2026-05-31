"use client";

import { useState, useEffect, useMemo } from "react";
import { Calendar, Clock, Plus, Settings, Bell, RefreshCw, ExternalLink } from "lucide-react";
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
import { googleCalendarService, type GoogleCalendarEvent, type GoogleCalendarListItem, type GoogleCalendarStatus } from "@/features/dashboard/calendario/services/google-calendar-service";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

// Interface movida para o serviço

export default function CalendarioPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [hasGoogleIntegration, setHasGoogleIntegration] = useState(false);
  const [googleStatus, setGoogleStatus] = useState<GoogleCalendarStatus | null>(null);
  const [calendars, setCalendars] = useState<GoogleCalendarListItem[]>([]);
  const [selectedCalendarId, setSelectedCalendarId] = useState<string>("");
  const [events, setEvents] = useState<GoogleCalendarEvent[]>([]);
  const [loadingCalendars, setLoadingCalendars] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | undefined>(undefined);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [activeTab, setActiveTab] = useState("reminders");
  const [loading, setLoading] = useState(true);

  const loadGoogleStatus = async () => {
    try {
      const status = await googleCalendarService.getStatus();
      setGoogleStatus(status);
      setHasGoogleIntegration(Boolean(status.connected));
      return status;
    } catch {
      setGoogleStatus({ connected: false });
      setHasGoogleIntegration(false);
      return { connected: false } as GoogleCalendarStatus;
    }
  };

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

    const params = new URLSearchParams(window.location.search);
    const googleParam = params.get("google");

    loadGoogleStatus().then((status) => {
      if (googleParam === "connected") {
        toast({ title: "Conectado!", description: "Google Agenda conectado com sucesso." });
        setActiveTab("calendar");
      }
      if (googleParam === "error") {
        toast({ title: "Erro", description: "Não foi possível conectar ao Google Agenda.", variant: "destructive" });
      }

      if (googleParam) {
        const nextUrl = window.location.pathname;
        window.history.replaceState({}, "", nextUrl);
      }

      if (status.connected) {
        setSelectedCalendarId(status.calendar_id || "");
      }
    });
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
    return;
  };

  const handleDisconnectGoogle = () => {
    setGoogleStatus({ connected: false });
    setHasGoogleIntegration(false);
    setCalendars([]);
    setSelectedCalendarId("");
    setEvents([]);
  };

  const loadCalendars = async () => {
    setLoadingCalendars(true);
    try {
      const data = await googleCalendarService.listCalendars();
      setCalendars(data);

      const preferred =
        selectedCalendarId ||
        googleStatus?.calendar_id ||
        data.find((c) => c.primary)?.id ||
        data[0]?.id ||
        "";

      if (preferred && preferred !== selectedCalendarId) {
        setSelectedCalendarId(preferred);
        try {
          await googleCalendarService.setDefaultCalendar(preferred);
        } catch {}
      }
    } catch (error) {
      setCalendars([]);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus calendários do Google.",
        variant: "destructive",
      });
    } finally {
      setLoadingCalendars(false);
    }
  };

  const loadEvents = async (calendarId: string) => {
    if (!calendarId) return;
    setLoadingEvents(true);
    try {
      const timeMin = new Date().toISOString();
      const timeMax = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      const data = await googleCalendarService.listEvents({ calendarId, timeMin, timeMax });
      setEvents(data);
    } catch (error) {
      setEvents([]);
      toast({
        title: "Erro",
        description: "Não foi possível carregar eventos do Google Agenda.",
        variant: "destructive",
      });
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    if (activeTab !== "calendar") return;
    if (!hasGoogleIntegration) return;
    if (!calendars.length) {
      loadCalendars();
    }
  }, [activeTab, hasGoogleIntegration]);

  useEffect(() => {
    if (activeTab !== "calendar") return;
    if (!hasGoogleIntegration) return;
    if (!selectedCalendarId) return;
    loadEvents(selectedCalendarId);
  }, [activeTab, hasGoogleIntegration, selectedCalendarId]);

  const eventsGrouped = useMemo(() => {
    const grouped: Record<string, GoogleCalendarEvent[]> = {};
    for (const e of events) {
      const start = e.start || "";
      const dayKey = start ? start.substring(0, 10) : "Sem data";
      grouped[dayKey] = grouped[dayKey] || [];
      grouped[dayKey].push(e);
    }
    return grouped;
  }, [events]);

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
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-[#141414]">Seus eventos do Google Agenda</h3>
                        <p className="text-sm text-[#969696]">Próximos 30 dias</p>
                      </div>
                      <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => {
                          if (selectedCalendarId) loadEvents(selectedCalendarId);
                        }}
                        disabled={loadingEvents}
                      >
                        <RefreshCw className={`w-4 h-4 ${loadingEvents ? "animate-spin" : ""}`} />
                        Atualizar
                      </Button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <label className="text-xs uppercase text-gray-500 font-bold">Calendário</label>
                        <Select
                          value={selectedCalendarId}
                          onValueChange={async (val) => {
                            setSelectedCalendarId(val);
                            try {
                              await googleCalendarService.setDefaultCalendar(val);
                            } catch {}
                          }}
                        >
                          <SelectTrigger className="mt-1 bg-white border-[#E2E2E2]">
                            <SelectValue placeholder={loadingCalendars ? "Carregando..." : "Selecione"} />
                          </SelectTrigger>
                          <SelectContent>
                            {(calendars || []).map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.summary}{c.primary ? " (principal)" : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="sm:self-end">
                        <Button
                          variant="outline"
                          className="gap-2 w-full sm:w-auto"
                          onClick={() => window.open("https://calendar.google.com", "_blank")}
                        >
                          <ExternalLink className="w-4 h-4" />
                          Abrir Google Agenda
                        </Button>
                      </div>
                    </div>

                    {loadingEvents ? (
                      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                        <div className="text-center space-y-2">
                          <Calendar className="w-10 h-10 text-gray-400 mx-auto" />
                          <p className="text-gray-500">Carregando eventos...</p>
                        </div>
                      </div>
                    ) : events.length === 0 ? (
                      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                        <div className="text-center space-y-2">
                          <Calendar className="w-10 h-10 text-gray-400 mx-auto" />
                          <p className="text-gray-500">Nenhum evento encontrado.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {Object.entries(eventsGrouped).map(([day, dayEvents]) => {
                          const dateLabel =
                            day !== "Sem data"
                              ? format(parseISO(day), "dd 'de' MMMM", { locale: ptBR })
                              : "Sem data";

                          return (
                            <div key={day} className="space-y-2">
                              <div className="flex items-center gap-2 text-sm font-semibold text-[#4A316A]">
                                <Calendar className="w-4 h-4" />
                                {dateLabel}
                              </div>
                              <div className="space-y-3">
                                {dayEvents.map((event) => {
                                  const startText = event.start
                                    ? format(parseISO(event.start), "HH:mm", { locale: ptBR })
                                    : "--:--";
                                  return (
                                    <Card key={event.id} className="transition-all hover:shadow-md">
                                      <CardContent className="p-4">
                                        <div className="flex items-start justify-between gap-4">
                                          <div className="space-y-1">
                                            <div className="font-medium text-gray-900">{event.summary}</div>
                                            <div className="text-sm text-gray-500 flex items-center gap-3">
                                              <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {startText}
                                              </span>
                                              {event.location && <span className="truncate">{event.location}</span>}
                                            </div>
                                          </div>
                                          {event.htmlLink && (
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="gap-2"
                                              onClick={() => window.open(event.htmlLink || "", "_blank")}
                                            >
                                              <ExternalLink className="w-4 h-4" />
                                              Abrir
                                            </Button>
                                          )}
                                        </div>
                                      </CardContent>
                                    </Card>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
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
              userEmail={googleStatus?.email || user?.user?.email}
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
