"use client";

import { 
  Building2, 
  ChevronRight, 
  User, 
  Home, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Bell, 
  BarChart3, 
  Users, 
  Mail,
  Link as LinkIcon,
  Copy,
  Check,
  Navigation
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useProperties } from "@/features/dashboard/imoveis/services/property-service";
import { useCustomers } from "@/features/dashboard/clientes/services/customer-service";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LoadingState } from "@/components/ui/loading-state";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/shared/hooks/auth/use-auth";

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  // Mock do slug do corretor (substituir pelo valor real depois)
  const brokerSlug = user?.user?.slug;
  
  // Obter o domínio dinamicamente
  const getDomain = () => {
    if (typeof window !== 'undefined') {
      return window.location.hostname;
    }
    return 'imobile.com.br'; // fallback para SSR
  };
  
  const publicUrl = `https://${getDomain()}/${brokerSlug}`;
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setIsCopied(true);
      toast({
        title: "Link copiado com sucesso!",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Erro ao copiar o link",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleNavigateToLink = () => {
    window.open(publicUrl, '_blank');
  };
  
  // Buscar imóveis e clientes
  const { 
    data: propertiesData, 
    isLoading: isLoadingProperties, 
    isError: isErrorProperties,
    error: errorProperties
  } = useProperties(1);
  
  const { 
    data: customersData, 
    isLoading: isLoadingCustomers, 
    isError: isErrorCustomers,
    error: errorCustomers
  } = useCustomers(1);
  
  // Verificar se o componente está montado no cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Calcular o total de imóveis e o limite
  const totalProperties = propertiesData?.meta?.total || 0;
  const propertyLimit = 10; // Limite fictício, pode ser ajustado conforme necessário
  
  // Obter o imóvel mais recente
  const latestProperty = propertiesData?.data && propertiesData.data.length > 0 
    ? propertiesData.data[0] 
    : null;
  
  // Obter o cliente mais recente
  const latestCustomer = customersData?.data && customersData.data.length > 0 
    ? customersData.data[0] 
    : null;
    
  // Calcular estatísticas
  const totalCustomers = customersData?.meta?.total || 0;
  const interestedCustomers = customersData?.data?.filter(
    customer => customer.interested_properties && customer.interested_properties.length > 0
  ).length || 0;
  const interestedPercentage = totalCustomers > 0 
    ? Math.round((interestedCustomers / totalCustomers) * 100) 
    : 0;
  
  // Verificar se está carregando ou se houve erro
  const isLoading = isLoadingProperties || isLoadingCustomers;
  const isError = isErrorProperties || isErrorCustomers;
  const error = errorProperties || errorCustomers;

  // Personalizar mensagem de erro para 403
  const errorMessage = error?.message?.includes('403')
    ? "Você precisa ter uma assinatura ativa para visualizar os dados. Por favor, escolha um plano para continuar."
    : "Ocorreu um erro ao carregar os dados. Por favor, tente novamente.";

  // Obter data atual formatada
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Primeira letra maiúscula
  const formattedDate = currentDate.charAt(0).toUpperCase() + currentDate.slice(1);

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Cabeçalho com saudação e data */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-[#9747ff]/10 to-white p-4 sm:p-6 rounded-xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#141414]">Olá, Corretor</h1>
          <p className="text-[#969696] mt-1 text-sm sm:text-base">{formattedDate}</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-2 sm:gap-3">
          {/* <Button variant="outline" size="sm" className="gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notificações</span>
          </Button>
          <Button className="bg-[#9747ff] hover:bg-[#9747ff]/90 gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Relatório</span>
          </Button> */}
        </div>
      </div>

      {/* Card do Link Público */}
      <Card className="bg-gradient-to-r from-[#9747ff]/5 to-transparent">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#9747ff]/10 rounded-full flex items-center justify-center">
                <LinkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#9747ff]" />
              </div>
              <div>
                <h3 className="font-medium text-base sm:text-lg">Seu Link Público</h3>
                <p className="text-xs sm:text-sm text-[#969696]">Compartilhe este link com seus clientes</p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="bg-white px-3 sm:px-4 py-2 rounded-lg border flex items-center gap-2 flex-1 sm:flex-none sm:min-w-[200px]">
                <span className="text-xs sm:text-sm text-[#141414] truncate">{publicUrl}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyLink}
                  className="h-8 w-8 p-0 hover:bg-transparent"
                >
                  {isCopied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-[#9747ff]" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNavigateToLink}
                  className="h-8 p-0 hover:bg-transparent cursor-pointer"
                >
                  <Navigation className="w-4 h-4 text-[#9747ff]" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estado de carregamento e erro */}
      <LoadingState 
        isLoading={isLoading} 
        isError={isError} 
        error={error as Error}
        errorMessage={errorMessage}
      />

      {!isLoading && !isError && isMounted && (
        <>
          {/* Cards de estatísticas */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-l-4 border-l-[#9747ff]">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-[#969696]">Total de Imóveis</p>
                    <h3 className="text-xl sm:text-2xl font-bold mt-1">{totalProperties}</h3>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#9747ff]/10 rounded-full flex items-center justify-center">
                    <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#9747ff]" />
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 text-xs text-[#969696]">
                  <span className="text-green-600 font-medium">+5%</span> desde o último mês
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-[#16ae4f]">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-[#969696]">Total de Clientes</p>
                    <h3 className="text-xl sm:text-2xl font-bold mt-1">{totalCustomers}</h3>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#16ae4f]/10 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#16ae4f]" />
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 text-xs text-[#969696]">
                  <span className="text-green-600 font-medium">+12%</span> desde o último mês
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-[#f59e0b]">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-[#969696]">Taxa de Interesse</p>
                    <h3 className="text-xl sm:text-2xl font-bold mt-1">{interestedPercentage}%</h3>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#f59e0b]/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-[#f59e0b]" />
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 text-xs text-[#969696]">
                  <span className="text-green-600 font-medium">{interestedCustomers}</span> clientes interessados
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-[#3b82f6]">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-[#969696]">Visitas Agendadas</p>
                    <h3 className="text-xl sm:text-2xl font-bold mt-1">0</h3>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#3b82f6]/10 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-[#3b82f6]" />
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 text-xs text-[#969696]">
                  <span className="text-green-600 font-medium">3</span> para esta semana
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Seção principal com imóveis e clientes */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#9747ff]/5 to-transparent p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#9747ff]" />
                    <CardTitle className="text-base sm:text-lg font-medium">Imóveis</CardTitle>
                  </div>
                  <Link href="/dashboard/imoveis">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <span className="hidden sm:inline">Ver todos</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                <CardDescription className="text-xs sm:text-sm">
                  <span className="font-medium text-[#141414]">{totalProperties}/{propertyLimit}</span> imóveis
                  cadastrados
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 sm:p-6">
                {latestProperty ? (
                  <div>
                    <h3 className="font-medium text-xs sm:text-sm text-[#969696] mb-3">Imóvel mais recente</h3>
                    <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                      <div className="h-32 sm:h-40 relative">
                        {latestProperty.attachments && latestProperty.attachments.length > 0 ? (
                          <Image
                            src={latestProperty.attachments[0].url}
                            alt={latestProperty.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <Building2 className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white px-2 py-1 rounded text-xs font-medium">
                          {latestProperty.rent ? 'Aluguel' : 'Venda'}
                        </div>
                      </div>
                      <div className="p-3 sm:p-4">
                        <h3 className="font-medium text-base sm:text-lg">{latestProperty.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">{latestProperty.street}, {latestProperty.neighborhood}</p>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3">
                          <div className="flex items-center gap-1">
                            <Home className="w-4 h-4 text-gray-400" />
                            <span className="text-xs sm:text-sm">{latestProperty.size}m²</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-xs sm:text-sm">{latestProperty.bedrooms} quartos</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                            <span className="text-xs sm:text-sm font-medium">R$ {latestProperty.value}</span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Link href={`/dashboard/imoveis/${latestProperty.slug}`}>
                            <Button className="w-full bg-[#9747ff] hover:bg-[#9747ff]/90 text-sm">
                              Ver detalhes
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8 text-sm text-gray-500">
                    Nenhum imóvel cadastrado
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#16ae4f]/5 to-transparent p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-[#16ae4f]" />
                    <CardTitle className="text-base sm:text-lg font-medium">Clientes</CardTitle>
                  </div>
                  <Link href="/dashboard/clientes">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <span className="hidden sm:inline">Ver todos</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                <CardDescription className="text-xs sm:text-sm">
                  <span className="font-medium text-[#141414]">{customersData?.meta?.total || 0}</span> clientes
                  cadastrados
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 sm:p-6">
                {latestCustomer ? (
                  <div>
                    <h3 className="font-medium text-xs sm:text-sm text-[#969696] mb-3">Cliente mais recente</h3>
                    <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                      <div className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#16ae4f]/10 flex items-center justify-center">
                            <User className="w-6 h-6 sm:w-8 sm:h-8 text-[#16ae4f]" />
                          </div>
                          <div>
                            <h3 className="font-medium text-base sm:text-lg">{latestCustomer.name}</h3>
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                              <Mail className="w-3 h-3" />
                              <span>{latestCustomer.email}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 sm:pt-6 border-t">
                          <h4 className="font-medium text-xs sm:text-sm mb-2">Informações de contato</h4>
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-1">
                            <span className="font-medium">Telefone:</span>
                            <span>{latestCustomer.phone}</span>
                          </div>
                          
                          {latestCustomer.interested_properties && latestCustomer.interested_properties.length > 0 ? (
                            <div className="mt-3">
                              <h4 className="font-medium text-xs sm:text-sm mb-2">Imóveis de interesse</h4>
                              <div className="space-y-2">
                                {latestCustomer.interested_properties.slice(0, 2).map((property, index) => (
                                  <div key={index} className="bg-white p-2 rounded border text-xs sm:text-sm">
                                    <div className="font-medium">{property.title}</div>
                                    <div className="text-xs sm:text-sm text-gray-500">{property.neighborhood}</div>
                                    <div className="text-xs sm:text-sm text-green-600 mt-1">
                                      {property.rent ? 'Aluguel' : 'Venda'}: R$ {property.value}
                                    </div>
                                  </div>
                                ))}
                                
                                {latestCustomer.interested_properties.length > 2 && (
                                  <div className="text-xs sm:text-sm text-center text-[#9747ff]">
                                    +{latestCustomer.interested_properties.length - 2} imóveis
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="mt-3 text-xs sm:text-sm text-gray-500">
                              Nenhum imóvel de interesse
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-4">
                          <Link href="/dashboard/clientes">
                            <Button className="w-full bg-[#16ae4f] hover:bg-[#16ae4f]/90 text-sm">
                              Ver detalhes
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8 text-sm text-gray-500">
                    Nenhum cliente cadastrado
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#9747ff]/5 to-transparent p-4 sm:p-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#9747ff]" />
            <CardTitle className="text-base sm:text-lg font-medium">Novidades</CardTitle>
          </div>
          <CardDescription className="text-xs sm:text-sm">
            Fique por dentro das novidades do iMoobile
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mb-4 rounded-full bg-[#9747ff]/10 flex items-center justify-center">
            <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-[#9747ff]" />
          </div>
          <h3 className="text-lg sm:text-xl font-medium mb-2">Novos recursos em breve!</h3>
          <p className="text-sm sm:text-base text-[#969696] mb-4 sm:mb-6 max-w-md">
            Estamos trabalhando em novos recursos para melhorar sua experiência. 
            Se inscreva na nossa newsletter e fique de olho nas novidades.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full max-w-md">
            <input 
              type="email" 
              placeholder="Seu melhor e-mail" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button className="bg-[#9747ff] hover:bg-[#9747ff]/90 whitespace-nowrap text-sm">
              Inscrever-se
            </Button>
          </div>
        </CardContent>
      </Card>

      <footer className="text-center text-xs sm:text-sm text-[#969696] py-3 sm:py-4">
        Copyright © iMoobile {new Date().getFullYear()}. Todos os direitos reservados
      </footer>
    </div>
  );
}
