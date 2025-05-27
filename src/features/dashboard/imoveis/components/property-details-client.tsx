"use client";

import { useState, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TopNav } from "@/features/dashboard/imoveis/top-nav";
import { useProperty, useDeleteProperty } from "@/features/dashboard/imoveis/services/property-service";
import { LoadingState } from "@/components/ui/loading-state";
import { Badge } from "@/components/ui/badge";
import { 
  Bath, 
  Calendar, 
  ChevronLeft, 
  Edit, 
  Home, 
  MapPin, 
  QrCode,
  Share2, 
  Tag, 
  Trash2, 
  Users 
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import { useQueryClient } from "@tanstack/react-query";

export function PropertyDetailsClient({ slug }: { slug: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [publicLink, setPublicLink] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const queryClient = useQueryClient();
  
  // Buscar dados do imóvel
  const { 
    data: propertyResponse, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useProperty(slug);
  
  // Extrair os dados do imóvel da resposta
  const property = propertyResponse?.data;
  
  // Hook para excluir imóvel
  const deletePropertyMutation = useDeleteProperty();

  // Efeito para marcar quando o componente está montado no cliente
  useLayoutEffect(() => {
    setIsMounted(true);
  }, []);

  // Função para compartilhar o imóvel
  const handleShare = () => {
    if (!isMounted) return;
    
    if (navigator.share) {
      navigator.share({
        title: property?.title || "Imóvel iMoobile",
        text: `Confira este imóvel: ${property?.title}`,
        url: window.location.href,
      })
      .then(() => {
        toast({
          title: "Compartilhado com sucesso!",
        });
      })
      .catch((error) => {
        console.error("Erro ao compartilhar:", error);
      });
    } else {
      // Fallback para navegadores que não suportam a API Web Share
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copiado para a área de transferência!",
      });
    }
  };

  // Função para excluir o imóvel
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      // Chamar a API para excluir o imóvel
      await deletePropertyMutation.mutateAsync(slug, {
        onSuccess: () => {
          // Invalidar a consulta para atualizar a lista de imóveis
          queryClient.invalidateQueries({ queryKey: ["properties"] });
          
          toast({
            title: "Imóvel excluído com sucesso!",
          });
          
          router.push("/dashboard/imoveis");
        }
      });
    } catch (error) {
      console.error("Erro ao excluir imóvel:", error);
      toast({
        title: "Erro ao excluir imóvel",
        description: "Ocorreu um erro ao excluir o imóvel. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Função para gerar link público
  const handleGeneratePublicLink = () => {
    if (!isMounted) return;
    
    const userData = localStorage.getItem('@SupBrokers:user');
    const user = userData ? JSON.parse(userData).user : null;

    console.log(user)
    
    const baseUrl = window.location.origin;
    const publicUrl = `${baseUrl}/${user?.slug}/imovel/${slug}`;
    setPublicLink(publicUrl);
    
    navigator.clipboard.writeText(publicUrl);
    toast({
      title: "Link público copiado!",
      description: "O link foi copiado para a área de transferência.",
    });
  };

  // Formatar o valor para exibição
  const formattedValue = property?.value 
    ? `R$ ${property.value}`
    : "Preço sob consulta";

  // Formatar o valor do IPTU para exibição
  const formattedIptuValue = property?.iptu_value && property.iptu_value !== "0"
    ? `R$ ${property.iptu_value}`
    : "Não informado";

  // Determinar se é aluguel ou venda
  const propertyType = property?.rent ? "Aluguel" : "Venda";

  return (
    <>
      <TopNav title_secondary="Detalhes do imóvel" />
      
      {/* Estado de carregamento e erro */}
      <LoadingState 
        isLoading={isLoading} 
        isError={isError} 
        error={error as Error} 
        onRetry={() => refetch()}
      />
      
      {!isLoading && !isError && property && (
        <div className="space-y-6">
          {/* Cabeçalho com ações */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => router.push("/dashboard/imoveis")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-semibold text-[#141414]">{property.title}</h1>
              <Badge className="bg-primary">{propertyType}</Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    QR Code
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>QR Code do Imóvel</DialogTitle>
                    <DialogDescription>
                      Escaneie este QR Code para acessar o imóvel
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-center p-4">
                    {property.qr_code ? (
                      <img 
                        src={property.qr_code} 
                        alt="QR Code do imóvel" 
                        className="w-64 h-64"
                      />
                    ) : (
                      <div className="w-64 h-64 bg-gray-100 flex items-center justify-center">
                        <p className="text-gray-500">QR Code não disponível</p>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
              
              {isMounted && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleGeneratePublicLink}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Gerar link público
                </Button>
              )}
              
              <Link href={`/dashboard/imoveis/${slug}/editar`}>
                <Button 
                  variant="outline" 
                  size="sm"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </Link>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir imóvel</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir este imóvel? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <span className="mr-2">Excluindo...</span>
                          <span className="animate-spin">⏳</span>
                        </>
                      ) : (
                        "Sim, excluir"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          
          {/* Exibir link público se gerado */}
          {publicLink && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-blue-800 mb-1">Link público gerado</h3>
                  <p className="text-sm text-blue-600 break-all">{publicLink}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    if (isMounted) {
                      navigator.clipboard.writeText(publicLink);
                      toast({
                        title: "Link copiado novamente!",
                      });
                    }
                  }}
                >
                  Copiar
                </Button>
              </div>
            </div>
          )}
          
          {/* Informações principais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Carrossel de imagens */}
            <div className="md:col-span-2 bg-white rounded-lg overflow-hidden border border-[#d9d9d9] shadow-sm">
              {property.attachments && property.attachments.length > 0 ? (
                <div className="relative">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {property.attachments.map((attachment, index) => (
                        <CarouselItem key={index}>
                          <div className="relative h-[300px] md:h-[400px] w-full">
                            <Image
                              src={attachment.url}
                              alt={`Imagem ${index + 1} de ${property.title}`}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                              {index + 1} / {property.attachments.length}
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </Carousel>
                  
                  {/* Miniaturas das imagens */}
                  {property.attachments.length > 1 && (
                    <div className="flex overflow-x-auto gap-2 p-2 bg-gray-50">
                      {property.attachments.map((attachment, index) => (
                        <div 
                          key={index}
                          className="relative w-16 h-16 flex-shrink-0 cursor-pointer border-2 border-transparent hover:border-primary rounded overflow-hidden"
                          onClick={() => {
                            // Implementar navegação para a imagem específica quando disponível
                          }}
                        >
                          <Image
                            src={attachment.url}
                            alt={`Miniatura ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-[300px] md:h-[400px] bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-500">Sem imagens disponíveis</p>
                </div>
              )}
            </div>
            
            {/* Detalhes do imóvel */}
            <div className="bg-white rounded-lg p-6 border border-[#d9d9d9] shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Código: {property.code}</span>
                </div>
                
                <div className="text-2xl font-semibold text-[#9747ff]">
                  {formattedValue}
                  {property.rent && <span className="text-sm font-normal ml-1">/mês</span>}
                </div>
                
                {property.iptu_value && property.iptu_value !== "0" && (
                  <div className="text-sm text-[#777777]">
                    IPTU: {formattedIptuValue}/ano
                  </div>
                )}
                
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-[#777777]">{property.neighborhood}, {property.street}</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                    <Home className="h-5 w-5 text-muted-foreground mb-1" />
                    <span className="font-medium">{property.size}m²</span>
                    <span className="text-xs text-muted-foreground">Área</span>
                  </div>
                  
                  <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                    <Bath className="h-5 w-5 text-muted-foreground mb-1" />
                    <span className="font-medium">{property.bedrooms}</span>
                    <span className="text-xs text-muted-foreground">
                      {property.bedrooms === 1 ? "Quarto" : "Quartos"}
                    </span>
                  </div>
                  
                  <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                    <Users className="h-5 w-5 text-muted-foreground mb-1" />
                    <span className="font-medium">{property.garages}</span>
                    <span className="text-xs text-muted-foreground">
                      {property.garages === 1 ? "Vaga" : "Vagas"}
                    </span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Publicado em {new Date(property.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Descrição e características */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-lg p-6 border border-[#d9d9d9] shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Descrição</h2>
              <p className="text-[#777777] whitespace-pre-line">{property.description}</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 border border-[#d9d9d9] shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Características</h2>
              {property.characteristics && property.characteristics.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {property.characteristics.map((characteristic, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {characteristic.text}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-[#777777]">Nenhuma característica cadastrada</p>
              )}
            </div>
          </div>
          
          {/* Informações adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-3 bg-white rounded-lg p-6 border border-[#d9d9d9] shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Informações adicionais</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h3 className="font-medium text-[#141414]">Status</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant={property.active ? "default" : "outline"}>
                      {property.active ? "Ativo" : "Inativo"}
                    </Badge>
                    {property.highlighted && (
                      <Badge variant="secondary">Destacado</Badge>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-[#141414]">Valores</h3>
                  <div className="space-y-1 text-sm text-[#777777]">
                    <p>Valor: {formattedValue}</p>
                    {property.iptu_value && property.iptu_value !== "0" && (
                      <p>IPTU: {formattedIptuValue}/ano</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-[#141414]">Publicação</h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-[#777777]">
                      {new Date(property.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 