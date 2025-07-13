"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { catalogMockService } from "../services/catalog-mock-service";
import { Catalog, UpdateCatalogRequest } from "../types/catalog";
import { Star, Building2, Users, Home, Crown, Heart, Zap, Loader2 } from "lucide-react";

interface EditCatalogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  catalog: Catalog | null;
}

const targetAudiences = [
  { value: "luxo", label: "Clientes de Luxo", description: "Imóveis premium e de alto padrão" },
  { value: "minha-casa-minha-vida", label: "Minha Casa Minha Vida", description: "Programa habitacional do governo" },
  { value: "investidores", label: "Investidores", description: "Foco em rentabilidade e ROI" },
  { value: "primeira-casa", label: "Primeira Casa", description: "Compradores de primeira viagem" },
  { value: "familias", label: "Famílias", description: "Casas e apartamentos familiares" },
  { value: "jovens", label: "Jovens", description: "Apartamentos compactos e modernos" },
  { value: "aposentados", label: "Aposentados", description: "Imóveis acessíveis e confortáveis" },
  { value: "empresarial", label: "Empresarial", description: "Salas comerciais e escritórios" },
];

const colors = [
  { value: "#9747ff", label: "Roxo" },
  { value: "#3b82f6", label: "Azul" },
  { value: "#10b981", label: "Verde" },
  { value: "#f59e0b", label: "Amarelo" },
  { value: "#ef4444", label: "Vermelho" },
  { value: "#8b5cf6", label: "Violeta" },
  { value: "#06b6d4", label: "Ciano" },
  { value: "#84cc16", label: "Lima" },
];

const icons = [
  { value: "star", label: "Estrela", icon: Star },
  { value: "building", label: "Prédio", icon: Building2 },
  { value: "users", label: "Usuários", icon: Users },
  { value: "home", label: "Casa", icon: Home },
  { value: "crown", label: "Coroa", icon: Crown },
  { value: "heart", label: "Coração", icon: Heart },
  { value: "zap", label: "Raio", icon: Zap },
];

export function EditCatalogDialog({ open, onOpenChange, catalog }: EditCatalogDialogProps) {
  const [formData, setFormData] = useState<UpdateCatalogRequest>({
    name: "",
    description: "",
    target_audience: "",
    color: "#9747ff",
    icon: "star",
    is_active: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Atualiza o formulário quando o catálogo muda
  useEffect(() => {
    if (catalog) {
      setFormData({
        name: catalog.name,
        description: catalog.description || "",
        target_audience: catalog.target_audience,
        color: catalog.color || "#9747ff",
        icon: catalog.icon || "star",
        is_active: catalog.is_active,
      });
    }
  }, [catalog]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!catalog) return;
    
    setIsLoading(true);
    try {
      await catalogMockService.updateCatalog(catalog.id, formData);
      toast({
        title: "Sucesso!",
        description: "Catálogo atualizado com sucesso.",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao atualizar catálogo:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar catálogo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedAudience = targetAudiences.find(a => a.value === formData.target_audience);
  const selectedIcon = icons.find(i => i.value === formData.icon);
  const IconComponent = selectedIcon?.icon || Star;

  if (!catalog) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 border-0 shadow-2xl backdrop-blur-sm">
        <DialogHeader className="space-y-3 pb-6">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 bg-clip-text text-transparent">
            Editar Catálogo
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base leading-relaxed">
            Atualize as informações do seu catálogo de imóveis com estilo e elegância.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Preview Card */}
          <div className="bg-gradient-to-br from-white via-gray-50/50 to-purple-50/30 p-6 rounded-xl border border-purple-200/50 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg border border-white/50 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                style={{ 
                  background: `linear-gradient(135deg, ${formData.color}20, ${formData.color}10)`,
                  boxShadow: `0 8px 32px ${formData.color}20`
                }}
              >
                <IconComponent 
                  className="w-6 h-6 transition-all duration-300" 
                  style={{ color: formData.color }}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-bold text-lg bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    {formData.name || "Nome do Catálogo"}
                  </h4>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full shadow-sm transition-all duration-300 ${
                    formData.is_active 
                      ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200/50" 
                      : "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border border-gray-200/50"
                  }`}>
                    {formData.is_active ? "Ativo" : "Inativo"}
                  </span>
                </div>
                <p className="text-sm font-medium text-purple-600">
                  {selectedAudience?.label || "Tipo de Cliente"}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed bg-white/50 p-3 rounded-lg border border-gray-200/50">
              {formData.description || "Descrição do catálogo..."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome */}
            <div className="space-y-3">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Nome do Catálogo *</Label>
              <Input
                id="name"
                placeholder="Ex: Imóveis de Luxo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-white/70 border-purple-200/50 focus:border-purple-400 focus:ring-purple-400/20 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md"
              />
            </div>

            {/* Tipo de Cliente */}
            <div className="space-y-3">
              <Label htmlFor="target_audience" className="text-sm font-semibold text-gray-700">Tipo de Cliente *</Label>
              <Select
                value={formData.target_audience}
                onValueChange={(value) => setFormData({ ...formData, target_audience: value })}
                required
              >
                <SelectTrigger className="bg-white/70 border-purple-200/50 focus:border-purple-400 focus:ring-purple-400/20 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-md border-purple-200/50 shadow-xl">
                  {targetAudiences.map((audience) => (
                    <SelectItem key={audience.value} value={audience.value} className="hover:bg-purple-50/50 focus:bg-purple-50/50">
                      <div>
                        <div className="font-medium text-gray-800">{audience.label}</div>
                        <div className="text-xs text-gray-500">{audience.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-3">
            <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva o objetivo deste catálogo e que tipo de imóveis ele deve conter..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="bg-white/70 border-purple-200/50 focus:border-purple-400 focus:ring-purple-400/20 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cor */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700">Cor do Catálogo</Label>
              <div className="grid grid-cols-4 gap-3">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={`w-full h-12 rounded-xl border-2 transition-all duration-300 shadow-sm hover:shadow-lg ${
                      formData.color === color.value
                        ? "border-white scale-110 shadow-lg"
                        : "border-gray-200/50 hover:border-white hover:scale-105"
                    }`}
                    style={{ 
                      backgroundColor: color.value,
                      boxShadow: formData.color === color.value ? `0 8px 32px ${color.value}40` : undefined
                    }}
                    onClick={() => setFormData({ ...formData, color: color.value })}
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            {/* Ícone */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700">Ícone do Catálogo</Label>
              <div className="grid grid-cols-4 gap-3">
                {icons.map((icon) => {
                  const IconComp = icon.icon;
                  return (
                    <button
                      key={icon.value}
                      type="button"
                      className={`w-full h-12 rounded-xl border-2 flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-lg backdrop-blur-sm ${
                        formData.icon === icon.value
                          ? "border-purple-400 bg-gradient-to-br from-purple-50 to-blue-50 scale-110 shadow-lg"
                          : "border-gray-200/50 bg-white/70 hover:border-purple-300 hover:bg-gradient-to-br hover:from-purple-50/50 hover:to-blue-50/50 hover:scale-105"
                      }`}
                      onClick={() => setFormData({ ...formData, icon: icon.value })}
                      title={icon.label}
                    >
                      <IconComp className={`w-6 h-6 transition-all duration-300 ${
                        formData.icon === icon.value ? "text-purple-600" : "text-gray-600"
                      }`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-700">Status do Catálogo</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="status"
                  checked={formData.is_active === true}
                  onChange={() => setFormData({ ...formData, is_active: true })}
                  className="text-green-600 focus:ring-green-500/20 transition-all duration-300"
                />
                <span className="text-sm font-medium text-gray-700 group-hover:text-green-600 transition-colors duration-300">Ativo</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="status"
                  checked={formData.is_active === false}
                  onChange={() => setFormData({ ...formData, is_active: false })}
                  className="text-gray-600 focus:ring-gray-500/20 transition-all duration-300"
                />
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-600 transition-colors duration-300">Inativo</span>
              </label>
            </div>
          </div>

          <DialogFooter className="gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-white/70 border-gray-300/50 hover:bg-gray-50/70 hover:border-gray-400/50 backdrop-blur-sm transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.name || !formData.target_audience}
              className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 hover:from-purple-700 hover:via-blue-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border-0 min-w-[140px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}