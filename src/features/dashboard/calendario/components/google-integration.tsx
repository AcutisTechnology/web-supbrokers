"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, AlertCircle, ExternalLink, RefreshCw, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface GoogleIntegrationProps {
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  userEmail?: string;
}

export function GoogleIntegration({ 
  isConnected, 
  onConnect, 
  onDisconnect, 
  userEmail 
}: GoogleIntegrationProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      // Simular processo de conexão com Google
      await new Promise(resolve => setTimeout(resolve, 2000));
      onConnect();
      toast({
        title: "Conectado com sucesso!",
        description: "Sua conta Google Calendar foi conectada."
      });
    } catch (error) {
      toast({
        title: "Erro na conexão",
        description: "Não foi possível conectar com o Google Calendar.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      // Simular processo de desconexão
      await new Promise(resolve => setTimeout(resolve, 1000));
      onDisconnect();
      toast({
        title: "Desconectado",
        description: "Sua conta Google Calendar foi desconectada."
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível desconectar do Google Calendar.",
        variant: "destructive"
      });
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleSyncCalendar = () => {
    toast({
      title: "Sincronizando...",
      description: "Seus eventos estão sendo sincronizados."
    });
  };

  if (!isConnected) {
    return (
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Conectar Google Calendar
          </h3>
          
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Sincronize seus compromissos e tenha acesso a todos os seus eventos 
            do Google Calendar diretamente na plataforma.
          </p>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Sincronização automática</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Visualização unificada</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Notificações integradas</span>
            </div>
          </div>
          
          <Button 
            onClick={handleConnect}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Conectando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Conectar com Google
              </>
            )}
          </Button>
          
          <p className="text-xs text-gray-500 mt-4">
            Ao conectar, você concorda com os termos de uso do Google Calendar
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-green-200 bg-green-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-green-800">
                Google Calendar Conectado
              </CardTitle>
              <CardDescription className="text-green-600">
                {userEmail || "Conta conectada com sucesso"}
              </CardDescription>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Ativo
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="text-center p-3 bg-white rounded-lg border">
            <div className="text-lg font-semibold text-gray-900">12</div>
            <div className="text-xs text-gray-600">Eventos hoje</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border">
            <div className="text-lg font-semibold text-gray-900">45</div>
            <div className="text-xs text-gray-600">Este mês</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border">
            <div className="text-lg font-semibold text-gray-900">3</div>
            <div className="text-xs text-gray-600">Próximos</div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSyncCalendar}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Sincronizar
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.open('https://calendar.google.com', '_blank')}
            className="gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Abrir Google Calendar
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
          >
            <Settings className="w-4 h-4" />
            Configurações
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDisconnect}
            disabled={isDisconnecting}
            className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            {isDisconnecting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {isDisconnecting ? "Desconectando..." : "Desconectar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}