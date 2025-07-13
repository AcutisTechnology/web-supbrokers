"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCatalog } from "../services/catalog-service";
import { Catalog } from "../types/catalog";
import {
  Star,
  Building2,
  Users,
  Home,
  Crown,
  Heart,
  Zap,
  Search,
  Filter,
  Grid3X3,
  List,
  MapPin,
  Bed,
  Bath,
  Car,
  Maximize,
  Calendar,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";
// Removido date-fns imports - usar formatação nativa

interface CatalogDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  catalogId: string | null;
}

const icons = {
  star: Star,
  building: Building2,
  users: Users,
  home: Home,
  crown: Crown,
  heart: Heart,
  zap: Zap,
};

// Mock data for demonstration - properties associated with this catalog
const mockProperties = [
  {
    id: "1",
    title: "Apartamento Luxo Vista Mar",
    address: "Av. Beira Mar, 1200 - Meireles",
    price: 950000,
    bedrooms: 3,
    bathrooms: 2,
    parking_spaces: 2,
    area: 140,
    created_at: new Date("2024-01-15"),
    type: "Apartamento",
    status: "Disponível",
    images: ["/api/placeholder/300/200"],
  },
  {
    id: "2",
    title: "Casa Condomínio Alphaville",
    address: "Rua das Acácias, 89 - Alphaville",
    price: 1850000,
    bedrooms: 4,
    bathrooms: 4,
    parking_spaces: 4,
    area: 320,
    created_at: new Date("2024-01-20"),
    type: "Casa",
    status: "Disponível",
    images: ["/api/placeholder/300/200"],
  },
  {
    id: "3",
    title: "Cobertura Duplex Premium",
    address: "Rua Joaquim Nabuco, 567 - Aldeota",
    price: 2200000,
    bedrooms: 5,
    bathrooms: 5,
    parking_spaces: 3,
    area: 280,
    created_at: new Date("2024-02-01"),
    type: "Cobertura",
    status: "Disponível",
    images: ["/api/placeholder/300/200"],
  },
  {
    id: "4",
    title: "Apartamento Moderno Centro",
    address: "Rua Barão do Rio Branco, 234 - Centro",
    price: 680000,
    bedrooms: 2,
    bathrooms: 2,
    parking_spaces: 1,
    area: 85,
    created_at: new Date("2024-02-05"),
    type: "Apartamento",
    status: "Disponível",
    images: ["/api/placeholder/300/200"],
  },
  {
    id: "5",
    title: "Casa Térrea Jardins",
    address: "Rua das Palmeiras, 445 - Jardins",
    price: 1350000,
    bedrooms: 3,
    bathrooms: 3,
    parking_spaces: 2,
    area: 200,
    created_at: new Date("2024-02-10"),
    type: "Casa",
    status: "Disponível",
    images: ["/api/placeholder/300/200"],
  },
];

export function CatalogDetails({ open, onOpenChange, catalogId }: CatalogDetailsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const { data: catalogData, isLoading } = useCatalog(catalogId || "");
  
  const catalog = catalogData?.data;

  if (!catalogId) return null;

  const IconComponent = catalog?.icon ? icons[catalog.icon as keyof typeof icons] || Star : Star;

  const filteredProperties = mockProperties.filter(property =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "area-asc":
        return a.area - b.area;
      case "area-desc":
        return b.area - a.area;
      case "recent":
      default:
        return b.created_at.getTime() - a.created_at.getTime();
    }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[1000px] h-[80vh]">
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9747ff]"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px] h-[80vh] p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${catalog?.color || '#9747ff'}20` }}
              >
                <IconComponent 
                  className="w-6 h-6" 
                  style={{ color: catalog?.color || '#9747ff' }}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <DialogTitle className="text-xl font-semibold">
                    {catalog?.name}
                  </DialogTitle>
                  <Badge variant={catalog?.is_active ? "default" : "secondary"}>
                    {catalog?.is_active ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <DialogDescription className="mt-1">
                  {catalog?.description || "Sem descrição"}
                </DialogDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#9747ff]">
                  {sortedProperties.length}
                </div>
                <div className="text-sm text-gray-500">Imóveis</div>
              </div>
            </div>
          </DialogHeader>

          {/* Filters and Controls */}
          <div className="p-6 pb-4 border-b bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-1 gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar propriedades..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Mais Recentes</SelectItem>
                    <SelectItem value="price-desc">Maior Preço</SelectItem>
                    <SelectItem value="price-asc">Menor Preço</SelectItem>
                    <SelectItem value="area-desc">Maior Área</SelectItem>
                    <SelectItem value="area-asc">Menor Área</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  className="bg-[#9747ff] hover:bg-[#8435e8] text-white"
                  onClick={() => console.log("Adicionar imóveis ao catálogo")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Imóveis
                </Button>
                
                <div className="flex items-center gap-1 border rounded-lg p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Properties List */}
          <div className="flex-1 overflow-auto p-6">
            {sortedProperties.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Home className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? "Nenhum imóvel encontrado" : "Nenhum imóvel neste catálogo"}
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm 
                    ? "Tente ajustar os filtros de busca" 
                    : "Adicione imóveis para começar a organizar seu catálogo"
                  }
                </p>
                <Button className="bg-[#9747ff] hover:bg-[#9747ff]/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeiro Imóvel
                </Button>
              </div>
            ) : (
              <div className={viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
              }>
                {sortedProperties.map((property) => (
                  <div
                    key={property.id}
                    className={`bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group ${
                      viewMode === "list" ? "flex" : ""
                    }`}
                  >
                    <div className={viewMode === "list" ? "w-48 flex-shrink-0" : ""}>
                      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Building2 className="w-12 h-12 text-gray-400" />
                        </div>
                        <div className="absolute top-3 left-3">
                          <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                            {property.type}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            {property.status}
                          </span>
                        </div>
                        <div className="absolute bottom-3 right-3">
                          <Badge className="bg-white/90 backdrop-blur-sm text-gray-900 font-bold">
                            {formatPrice(property.price)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-5 flex-1">
                      <h4 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-[#9747ff] transition-colors line-clamp-1">
                        {property.title}
                      </h4>
                      <div className="flex items-center text-sm text-gray-600 mb-4">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="line-clamp-1">{property.address}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                          <Bed className="w-4 h-4 text-[#9747ff]" />
                          <span className="font-medium">{property.bedrooms}</span>
                          <span>quartos</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                          <Bath className="w-4 h-4 text-[#9747ff]" />
                          <span className="font-medium">{property.bathrooms}</span>
                          <span>banheiros</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                          <Car className="w-4 h-4 text-[#9747ff]" />
                          <span className="font-medium">{property.parking_spaces}</span>
                          <span>vagas</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                          <Maximize className="w-4 h-4 text-[#9747ff]" />
                          <span className="font-medium">{property.area}m²</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          {property.created_at.toLocaleDateString('pt-BR')}
                        </div>
                        
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-[#9747ff]/10 hover:text-[#9747ff]"
                            onClick={() => console.log("Ver propriedade", property.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                            onClick={() => console.log("Editar propriedade", property.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                            onClick={() => console.log("Remover do catálogo", property.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}