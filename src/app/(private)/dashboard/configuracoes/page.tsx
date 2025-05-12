'use client';

import { useState } from 'react';
import { PageSettings } from '@/features/dashboard/page-settings/services/page-settings-service';
import { PageSettingsForm } from '@/features/dashboard/page-settings/components/page-settings-form';
import { usePageSettings } from '@/features/dashboard/page-settings/hooks/use-page-settings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, AlertCircle, Palette } from 'lucide-react';
import { LoadingState } from '@/components/ui/loading-state';
import { PageSettingsPreview } from '@/features/dashboard/page-settings/components/page-settings-preview';
import { useBrokerProperties } from '@/features/landing/services/broker-service';
import { useAuth } from '@/shared/hooks/auth/use-auth';

export default function PageSettingsPage() {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const { data: properties, isLoading, isError, error, refetch } = useBrokerProperties(user?.user.slug || '');
  const { updateSettings } = usePageSettings();
  const settings = properties?.data.user.page_settings;
  
  // Valores padrão para quando os dados ainda não foram carregados
  const defaultSettings: PageSettings = {
    primary_color: '#9747FF',
    title: 'Encontre o imóvel perfeito para você',
    subtitle: 'Confira os melhores imóveis disponíveis',
    brand_image: '/logo-extendida-roxo.svg'
  };

  const handleSubmit = async (data: PageSettings) => {
    try {
      await updateSettings(data);
      // Recarregar os dados do broker para obter as configurações atualizadas
      await refetch();
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-gradient-to-r from-[#9747ff]/10 to-white p-6 rounded-xl">
        <div>
          <h1 className="text-3xl font-bold text-[#141414]">Aparência da Página</h1>
          <p className="text-[#969696] mt-1">Personalize a aparência da sua página de imóveis</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button 
            variant={isEditing ? "outline" : "default"}
            className={isEditing ? "" : "bg-[#9747ff] hover:bg-[#9747ff]/90"}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <>
                <AlertCircle className="w-4 h-4 mr-2" />
                Cancelar
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Editar Aparência
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Estado de carregamento e erro */}
      <LoadingState 
        isLoading={isLoading} 
        isError={isError} 
        error={error as Error} 
        onRetry={() => refetch()}
      />

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-7">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#9747ff]/5 to-transparent p-6">
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-[#9747ff]" />
                  <CardTitle className="text-lg font-medium">Configurações de Aparência</CardTitle>
                </div>
                <CardDescription>
                  Personalize como sua página será exibida para os clientes
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6">
                {isEditing ? (
                  <PageSettingsForm 
                    initialData={settings || defaultSettings} 
                    onSubmit={handleSubmit} 
                  />
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Cor Primária</h3>
                        <div className="mt-2 flex items-center">
                          <div 
                            className="w-10 h-10 rounded-md border" 
                            style={{ backgroundColor: settings?.primary_color || defaultSettings.primary_color }}
                          />
                          <span className="ml-3 text-gray-900">{settings?.primary_color || defaultSettings.primary_color}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Logo da Marca</h3>
                        <div className="mt-2">
                          <div className="relative w-32 h-20">
                            <img 
                              src={settings?.brand_image || defaultSettings.brand_image} 
                              alt="Logo da marca"
                              className="object-contain w-full h-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Título da Página</h3>
                        <p className="mt-1 text-gray-900">{settings?.title || defaultSettings.title}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Subtítulo da Página</h3>
                        <p className="mt-1 text-gray-900">{settings?.subtitle || defaultSettings.subtitle}</p>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="mt-4"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar Configurações
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Preview */}
          <div className="lg:col-span-5">
            <Card>
              <CardHeader className="bg-gradient-to-r from-[#9747ff]/5 to-transparent p-6">
                <CardTitle className="text-lg font-medium">Pré-visualização</CardTitle>
                <CardDescription>
                  Veja como sua página ficará para os visitantes
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <PageSettingsPreview settings={settings || defaultSettings} />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
} 