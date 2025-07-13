"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  Edit, 
  Trash2, 
  Building2, 
  Users, 
  Calendar,
  MoreVertical,
  Star,
  StarOff
} from "lucide-react";
import { Catalog } from "../types/catalog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useState } from "react";

interface CatalogCardProps {
  catalog: Catalog & {
    total_value?: number;
    avg_price?: number;
    last_added?: Date;
  };
  viewMode: "grid" | "list";
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  "star": Star,
  "building": Building2,
  "users": Users,
  "home": Building2,
};

export function CatalogCard({ catalog, viewMode, onView, onEdit, onDelete }: CatalogCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const IconComponent = iconMap[catalog.icon] || Building2;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatCompactPrice = (price: number) => {
    if (price >= 1000000) {
      return `R$ ${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `R$ ${(price / 1000).toFixed(0)}K`;
    }
    return formatPrice(price);
  };

  if (viewMode === "list") {
    return (
      <Card className="group hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-400 border-0 bg-gradient-to-r from-white via-gray-50/30 to-white hover:from-purple-50/20 hover:via-white hover:to-blue-50/10">
        <CardContent className="p-5 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-lg" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-5 flex-1">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                style={{ 
                  background: `linear-gradient(135deg, ${catalog.color}15, ${catalog.color}25)`,
                  border: `1px solid ${catalog.color}20`
                }}
              >
                <IconComponent 
                  className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" 
                  style={{ color: catalog.color }}
                />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-xl text-[#141414] group-hover:text-[#9747ff] transition-colors duration-300">{catalog.name}</h3>
                  <Badge 
                    variant={catalog.is_active ? "default" : "secondary"}
                    className={catalog.is_active ? 
                      "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md shadow-green-500/25 border-0" : 
                      "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-md shadow-gray-400/25 border-0"
                    }
                  >
                    {catalog.is_active ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <p className="text-sm text-[#666666] mb-4 leading-relaxed">{catalog.description}</p>
                <div className="grid grid-cols-3 gap-6 text-sm">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100/50">
                    <div className="flex items-center gap-2 text-blue-700 mb-1">
                      <Building2 className="w-4 h-4" />
                      <span className="text-xs font-medium">Imóveis</span>
                    </div>
                    <div className="font-bold text-lg text-blue-900">{catalog.properties_count || 0}</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-100/50">
                    <div className="text-xs font-medium text-purple-700 mb-1">Valor Total</div>
                    <div className="font-bold text-lg text-purple-900">
                      {catalog.total_value ? formatCompactPrice(catalog.total_value) : "--"}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-3 rounded-lg border border-emerald-100/50">
                    <div className="text-xs font-medium text-emerald-700 mb-1">Preço Médio</div>
                    <div className="font-bold text-lg text-emerald-900">
                      {catalog.avg_price ? formatCompactPrice(catalog.avg_price) : "--"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-gradient-to-r from-[#9747ff] to-[#7c3aed] text-white border-0 hover:from-[#8b5cf6] hover:to-[#9333ea] shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105 transform-gpu"
                onClick={onView}
              >
                <Eye className="w-4 h-4 mr-2" />
                Visualizar
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-0 hover:from-gray-200 hover:to-gray-300 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 transform-gpu"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                  <DropdownMenuItem onClick={onEdit} className="hover:bg-purple-50">
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <DropdownMenuItem 
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="group hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 cursor-pointer overflow-hidden border-0 bg-gradient-to-br from-white via-gray-50/50 to-white hover:from-purple-50/30 hover:via-white hover:to-blue-50/20">
        <div 
          className="h-1 w-full bg-gradient-to-r"
          style={{ 
            background: `linear-gradient(90deg, ${catalog.color}, ${catalog.color}80, ${catalog.color})` 
          }}
        />
        
        <CardContent className="p-6 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100/20 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="flex items-start justify-between mb-4 relative z-10">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl"
              style={{ 
                background: `linear-gradient(135deg, ${catalog.color}15, ${catalog.color}25)`,
                border: `1px solid ${catalog.color}20`
              }}
            >
              <IconComponent 
                className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" 
                style={{ color: catalog.color }}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl border border-gray-200/50 hover:scale-105 transform-gpu"
                >
                  <MoreVertical className="w-4 h-4 text-gray-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                <DropdownMenuItem onClick={onView} className="hover:bg-purple-50">
                  <Eye className="w-4 h-4 mr-2" />
                  Visualizar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onEdit} className="hover:bg-purple-50">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem 
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="mb-5 relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="font-bold text-xl text-[#141414] group-hover:text-[#9747ff] transition-all duration-300 group-hover:scale-105 transform-gpu">
                {catalog.name}
              </h3>
              <Badge 
                variant={catalog.is_active ? "default" : "secondary"}
                className={catalog.is_active ? 
                  "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25 border-0" : 
                  "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg shadow-gray-400/25 border-0"
                }
              >
                {catalog.is_active ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            <p className="text-sm text-[#666666] line-clamp-2 leading-relaxed">{catalog.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100/50 group-hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <div className="text-xs font-medium text-blue-700">Imóveis</div>
              </div>
              <div className="text-2xl font-bold text-blue-900">{catalog.properties_count || 0}</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100/50 group-hover:shadow-lg transition-all duration-300">
              <div className="text-xs font-medium text-purple-700 mb-2">Valor Total</div>
              <div className="text-lg font-bold text-purple-900">
                {catalog.total_value ? formatCompactPrice(catalog.total_value) : "--"}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-100/50 group-hover:shadow-lg transition-all duration-300">
              <div className="text-xs font-medium text-emerald-700 mb-2">Preço Médio</div>
              <div className="text-lg font-bold text-emerald-900">
                {catalog.avg_price ? formatCompactPrice(catalog.avg_price) : "--"}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-100/50 group-hover:shadow-lg transition-all duration-300">
              <div className="text-xs font-medium text-amber-700 mb-2">Última Adição</div>
              <div className="text-sm font-semibold text-amber-900">
                {catalog.last_added ? formatDate(catalog.last_added.toISOString()) : "--"}
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 relative z-10">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 bg-gradient-to-r from-[#9747ff] to-[#7c3aed] text-white border-0 hover:from-[#8b5cf6] hover:to-[#9333ea] shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105 transform-gpu"
              onClick={onView}
            >
              <Eye className="w-4 h-4 mr-2" />
              Visualizar
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-0 hover:from-gray-200 hover:to-gray-300 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 transform-gpu"
              onClick={onEdit}
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Confirmar exclusão
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 text-base leading-relaxed">
              Tem certeza que deseja excluir o catálogo <span className="font-semibold text-gray-800">&quot;{catalog.name}&quot;</span>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-0 hover:from-gray-200 hover:to-gray-300 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 transform-gpu">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                onDelete();
                setIsDeleteDialogOpen(false);
              }}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-0 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 hover:scale-105 transform-gpu"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}