'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Building2,
  Home,
  TrendingUp,
  MapPin,
  Bed,
  Car,
  Maximize2,
  Calendar,
  Users,
  Palette,
  Eye,
  Plus,
  Trash2,
  ArrowUpDown
} from 'lucide-react';
import { Catalog } from '../types/catalog';
import { Property } from '../../imoveis/services/property-service';
import { catalogMockService } from '../services/catalog-mock-service';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CatalogViewDialogProps {
  catalog: Catalog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (catalog: Catalog) => void;
}

const iconMap = {
  Building2,
  Home,
  TrendingUp,
};

export function CatalogViewDialog({ catalog, open, onOpenChange, onEdit }: CatalogViewDialogProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [availableProperties, setAvailableProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddProperties, setShowAddProperties] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (catalog && open) {
      loadCatalogProperties();
      loadAvailableProperties();
    }
  }, [catalog, open]);

  const loadCatalogProperties = async () => {
    if (!catalog) return;
    
    setLoading(true);
    try {
      const props = await catalogMockService.getCatalogProperties(catalog.id);
      setProperties(props);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as propriedades do catálogo.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableProperties = async () => {
    if (!catalog) return;
    
    try {
      const available = await catalogMockService.getAvailableProperties(catalog.id);
      setAvailableProperties(available);
    } catch (error) {
      console.error('Erro ao carregar propriedades disponíveis:', error);
    }
  };

  const handleAddProperty = async (propertySlug: string) => {
    if (!catalog) return;
    
    try {
      await catalogMockService.addPropertyToCatalog(catalog.id, propertySlug);
      toast({
        title: 'Sucesso',
        description: 'Propriedade adicionada ao catálogo com sucesso!',
      });
      loadCatalogProperties();
      loadAvailableProperties();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar a propriedade ao catálogo.',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveProperty = async (propertySlug: string) => {
    if (!catalog) return;
    
    try {
      await catalogMockService.removePropertyFromCatalog(catalog.id, propertySlug);
      toast({
        title: 'Sucesso',
        description: 'Propriedade removida do catálogo com sucesso!',
      });
      loadCatalogProperties();
      loadAvailableProperties();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível remover a propriedade do catálogo.',
        variant: 'destructive',
      });
    }
  };

  const formatPrice = (value: string) => {
    const numValue = parseFloat(value);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numValue);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  if (!catalog) return null;

  const IconComponent = iconMap[catalog.icon as keyof typeof iconMap] || Building2;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: catalog.color + '20', border: `2px solid ${catalog.color}` }}
              >
                <IconComponent className="w-8 h-8" style={{ color: catalog.color }} />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {catalog.name}
                </DialogTitle>
                <p className="text-gray-600 mt-1">{catalog.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <Badge 
                    variant="secondary" 
                    className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-0 shadow-sm"
                  >
                    <Users className="w-3 h-3 mr-1" />
                    {catalog.target_audience}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200"
                  >
                    <Calendar className="w-3 h-3 mr-1" />
                    Criado em {formatDate(catalog.created_at)}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {onEdit && (
                <Button
                  variant="outline"
                  onClick={() => onEdit(catalog)}
                  className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 border-0 hover:from-purple-200 hover:to-purple-300 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <Palette className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setShowAddProperties(!showAddProperties)}
                className="bg-gradient-to-r from-green-100 to-green-200 text-green-700 border-0 hover:from-green-200 hover:to-green-300 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Imóveis
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Seção de adicionar propriedades */}
        {showAddProperties && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Imóveis Disponíveis</h3>
            {availableProperties.length === 0 ? (
              <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-0 shadow-sm">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-600">Todos os imóveis já estão neste catálogo.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableProperties.map((property) => (
                  <Card key={property.slug} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-gray-800 text-sm line-clamp-2">{property.title}</h4>
                        <Button
                          size="sm"
                          onClick={() => handleAddProperty(property.slug)}
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 transform-gpu"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="space-y-2 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{property.neighborhood}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Maximize2 className="w-3 h-3" />
                            <span>{property.size}m²</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Bed className="w-3 h-3" />
                            <span>{property.bedrooms}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Car className="w-3 h-3" />
                            <span>{property.garages}</span>
                          </div>
                        </div>
                        <div className="font-semibold text-green-600">
                          {formatPrice(property.value)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Lista de propriedades do catálogo */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Imóveis no Catálogo ({properties.length})
            </h3>
            {properties.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border-0 hover:from-blue-200 hover:to-blue-300 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <ArrowUpDown className="w-4 h-4 mr-2" />
                Reordenar
              </Button>
            )}
          </div>

          {loading ? (
            <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-0 shadow-sm">
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando propriedades...</p>
              </CardContent>
            </Card>
          ) : properties.length === 0 ? (
            <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-0 shadow-sm">
              <CardContent className="p-8 text-center">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Este catálogo ainda não possui imóveis.</p>
                <Button
                  onClick={() => setShowAddProperties(true)}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 border-0 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeiro Imóvel
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {properties.map((property, index) => (
                <Card key={property.slug} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-100 to-purple-200 flex items-center justify-center text-purple-700 font-semibold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800 text-lg">{property.title}</h4>
                            <p className="text-gray-600 text-sm line-clamp-2">{property.description}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{property.neighborhood}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Maximize2 className="w-4 h-4" />
                            <span>{property.size}m²</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Bed className="w-4 h-4" />
                            <span>{property.bedrooms} quartos</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Car className="w-4 h-4" />
                            <span>{property.garages} vagas</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-xl font-bold text-green-600">
                            {formatPrice(property.value)}
                          </div>
                          <div className="flex gap-2">
                            {property.rent && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                Aluguel
                              </Badge>
                            )}
                            {property.sale && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                Venda
                              </Badge>
                            )}
                            {property.highlighted && (
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                Destaque
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border-0 hover:from-blue-200 hover:to-blue-300 shadow-md hover:shadow-lg transition-all duration-300"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveProperty(property.slug)}
                          className="bg-gradient-to-r from-red-100 to-red-200 text-red-700 border-0 hover:from-red-200 hover:to-red-300 shadow-md hover:shadow-lg transition-all duration-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}