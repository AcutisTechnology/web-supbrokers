"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Grid3X3, List, Eye, Edit, Trash2, Users, Building2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { catalogMockService } from "../services/catalog-mock-service";
import { EmptyState } from "@/components/ui/empty-state";
// Removido LoadingState pois não fazemos mais chamadas de API
import { useToast } from "@/hooks/use-toast";
import { CatalogCard } from "./catalog-card";
import { CreateCatalogDialog } from "./create-catalog-dialog";
import { EditCatalogDialog } from "./edit-catalog-dialog";
import { CatalogViewDialog } from "./catalog-view-dialog";
import { Catalog } from "../types/catalog";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function CatalogsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCatalog, setEditingCatalog] = useState<Catalog | null>(null);
  const [viewingCatalog, setViewingCatalog] = useState<Catalog | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Usando apenas dados mockados - sem necessidade de estados de loading

  const handleDeleteCatalog = async (id: string) => {
    try {
      await catalogMockService.deleteCatalog(id);
      toast({
        title: "Sucesso!",
        description: "Catálogo excluído com sucesso.",
      });
      // Força re-render removendo o catálogo da lista
      window.location.reload();
    } catch (error) {
      console.error("Erro ao excluir catálogo:", error);
      toast({
        title: "Erro",
        description: "Erro ao excluir catálogo. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleViewCatalog = (catalog: Catalog) => {
    setViewingCatalog(catalog);
  };

  const handleEditFromView = (catalog: Catalog) => {
    setViewingCatalog(null);
    setEditingCatalog(catalog);
  };

  // Mock data - substituir pela API real
  const mockCatalogs = [
    {
      id: "1",
      name: "Imóveis de Luxo",
      description: "Apartamentos e casas de alto padrão para clientes exigentes com acabamentos premium",
      target_audience: "luxo",
      color: "#9747ff",
      icon: "crown",
      is_active: true,
      properties_count: 24,
      total_value: 45800000,
      avg_price: 1908333,
      last_added: new Date("2024-01-25"),
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-25T15:30:00Z",
    },
    {
      id: "2",
      name: "Minha Casa Minha Vida",
      description: "Imóveis dentro do programa habitacional do governo federal",
      target_audience: "minha-casa-minha-vida",
      color: "#10b981",
      icon: "home",
      is_active: true,
      properties_count: 18,
      total_value: 5400000,
      avg_price: 300000,
      last_added: new Date("2024-01-24"),
      created_at: "2024-01-10T09:00:00Z",
      updated_at: "2024-01-24T14:20:00Z",
    },
    {
      id: "3",
      name: "Oportunidades de Investimento",
      description: "Imóveis com alto potencial de rentabilidade e valorização",
      target_audience: "investidores",
      color: "#f59e0b",
      icon: "building",
      is_active: true,
      properties_count: 32,
      total_value: 28800000,
      avg_price: 900000,
      last_added: new Date("2024-01-26"),
      created_at: "2024-01-05T11:15:00Z",
      updated_at: "2024-01-26T16:45:00Z",
    },
    {
      id: "4",
      name: "Primeira Casa",
      description: "Imóveis ideais para quem está comprando pela primeira vez",
      target_audience: "primeira-casa",
      color: "#3b82f6",
      icon: "heart",
      is_active: true,
      properties_count: 14,
      total_value: 8400000,
      avg_price: 600000,
      last_added: new Date("2024-01-23"),
      created_at: "2024-01-01T08:30:00Z",
      updated_at: "2024-01-23T13:10:00Z",
    },
    {
      id: "5",
      name: "Famílias Grandes",
      description: "Casas espaçosas com 4+ quartos para famílias numerosas",
      target_audience: "familias",
      color: "#06b6d4",
      icon: "users",
      is_active: true,
      properties_count: 11,
      total_value: 13200000,
      avg_price: 1200000,
      last_added: new Date("2024-01-22"),
      created_at: "2023-12-20T12:00:00Z",
      updated_at: "2024-01-22T17:20:00Z",
    },
    {
      id: "6",
      name: "Jovens Profissionais",
      description: "Apartamentos compactos e modernos em localizações estratégicas",
      target_audience: "jovens",
      color: "#8b5cf6",
      icon: "zap",
      is_active: false,
      properties_count: 7,
      total_value: 3500000,
      avg_price: 500000,
      last_added: new Date("2024-01-15"),
      created_at: "2023-12-15T14:45:00Z",
      updated_at: "2024-01-15T10:15:00Z",
    },
  ];

  const filteredCatalogs = mockCatalogs.filter(catalog =>
    catalog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    catalog.target_audience.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-gradient-to-r from-[#9747FF]/10 to-white p-6 rounded-xl mb-7">
        <div>
          <h1 className="text-2xl font-bold text-[#141414]">Catálogos</h1>
          <div className="flex items-center gap-2 text-sm text-[#777777] mt-1">
            <Link href="/dashboard" className="hover:text-[#9747FF] transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#9747FF]">Catálogos</span>
          </div>
        </div>
        
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-[#9747ff] hover:bg-[#8435e8] text-white mt-4 md:mt-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Catálogo
        </Button>
      </div>

      {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-0 bg-gradient-to-br from-[#9747ff]/10 via-white to-[#9747ff]/5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#9747ff] to-[#8435e8] rounded-xl flex items-center justify-center shadow-lg">
                  <Grid3X3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-[#969696] font-medium uppercase tracking-wide">Catálogos</p>
                  <p className="text-2xl font-bold text-[#141414] bg-gradient-to-r from-[#9747ff] to-[#8435e8] bg-clip-text text-transparent">{mockCatalogs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-blue-500/10 via-white to-blue-500/5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-[#969696] font-medium uppercase tracking-wide">Ativos</p>
                  <p className="text-2xl font-bold text-[#141414] bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                    {filteredCatalogs.filter(c => c.is_active).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-green-500/10 via-white to-green-500/5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-[#969696] font-medium uppercase tracking-wide">Imóveis</p>
                  <p className="text-2xl font-bold text-[#141414] bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                    {filteredCatalogs.reduce((acc, catalog) => acc + catalog.properties_count, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-orange-500/10 via-white to-orange-500/5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-[#969696] font-medium uppercase tracking-wide">Tipos</p>
                  <p className="text-2xl font-bold text-[#141414] bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                    {new Set(filteredCatalogs.map(c => c.target_audience)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#969696] w-4 h-4" />
          <Input
            placeholder="Buscar catálogos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Catalogs Grid/List */}
      {filteredCatalogs.length > 0 ? (
        <div className={viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
        }>
          {filteredCatalogs.map((catalog) => (
            <CatalogCard
              key={catalog.id}
              catalog={catalog}
              viewMode={viewMode}
              onView={() => handleViewCatalog(catalog)}
              onEdit={() => setEditingCatalog(catalog)}
              onDelete={() => handleDeleteCatalog(catalog.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nenhum catálogo encontrado"
          description="Crie seu primeiro catálogo para organizar seus imóveis por tipo de cliente."
          action={{
            label: "Criar Catálogo",
            onClick: () => setIsCreateDialogOpen(true)
          }}
        />
      )}

      {/* Dialogs */}
      <CreateCatalogDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      {editingCatalog && (
        <EditCatalogDialog
          catalog={editingCatalog}
          open={!!editingCatalog}
          onOpenChange={(open) => !open && setEditingCatalog(null)}
        />
      )}

      <CatalogViewDialog
        catalog={viewingCatalog}
        open={!!viewingCatalog}
        onOpenChange={(open) => !open && setViewingCatalog(null)}
        onEdit={handleEditFromView}
      />
    </div>
  );
}