"use client";

import { useState } from "react";
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
import { catalogMockService } from "../services/catalog-mock-service";
import { useToast } from "@/hooks/use-toast";
import { CreateCatalogRequest } from "../types/catalog";
import { Star, Building2, Users, Home, Crown, Heart, Zap } from "lucide-react";

interface CreateCatalogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function CreateCatalogDialog({ open, onOpenChange }: CreateCatalogDialogProps) {
  const [formData, setFormData] = useState<CreateCatalogRequest>({
    name: "",
    description: "",
    target_audience: "",
    color: "#9747ff",
    icon: "star",
  });

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await catalogMockService.createCatalog(formData);
      toast({
        title: "Sucesso!",
        description: "Catálogo criado com sucesso.",
      });
      onOpenChange(false);
      setFormData({
        name: "",
        description: "",
        target_audience: "",
        color: "#9747ff",
        icon: "star",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar o catálogo. Tente novamente.",
        variant: "destructive",
      });
      console.error("Erro ao criar catálogo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedAudience = targetAudiences.find(a => a.value === formData.target_audience);
  const selectedIcon = icons.find(i => i.value === formData.icon);
  const IconComponent = selectedIcon?.icon || Star;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Criar Novo Catálogo
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base leading-relaxed">
            Organize seus imóveis criando catálogos personalizados para diferentes tipos de clientes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Preview Card */}
          <div className="bg-gradient-to-br from-purple-50 via-white to-purple-50 p-6 rounded-2xl border-2 border-dashed border-purple-200 shadow-lg">
            <div className="flex items-center gap-4 mb-3">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300"
                style={{ 
                  backgroundColor: `${formData.color}20`, 
                  border: `2px solid ${formData.color}`,
                  boxShadow: `0 8px 25px ${formData.color}25`
                }}
              >
                <IconComponent 
                  className="w-7 h-7" 
                  style={{ color: formData.color }}
                />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {formData.name || "Nome do Catálogo"}
                </h4>
                <p className="text-sm text-purple-600 font-medium">
                  {selectedAudience?.label || "Tipo de Cliente"}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {formData.description || "Descrição do catálogo aparecerá aqui..."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Nome do Catálogo *</Label>
              <Input
                id="name"
                placeholder="Ex: Imóveis de Luxo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/80 border-gray-200 focus:border-purple-400 focus:ring-purple-400/20 shadow-sm"
                required
              />
            </div>

            {/* Tipo de Cliente */}
            <div className="space-y-2">
              <Label htmlFor="target_audience" className="text-sm font-semibold text-gray-700">Tipo de Cliente *</Label>
              <Select
                value={formData.target_audience}
                onValueChange={(value) => setFormData({ ...formData, target_audience: value })}
                required
              >
                <SelectTrigger className="bg-white/80 border-gray-200 focus:border-purple-400 focus:ring-purple-400/20 shadow-sm">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                  {targetAudiences.map((audience) => (
                    <SelectItem key={audience.value} value={audience.value} className="hover:bg-purple-50">
                      <div>
                        <div className="font-medium">{audience.label}</div>
                        <div className="text-xs text-gray-500">{audience.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva o objetivo deste catálogo e que tipo de imóveis ele deve conter..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-white/80 border-gray-200 focus:border-purple-400 focus:ring-purple-400/20 shadow-sm resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cor */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Cor do Catálogo</Label>
              <div className="grid grid-cols-4 gap-3">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={`w-full h-12 rounded-xl border-2 transition-all duration-300 shadow-md hover:shadow-lg ${
                      formData.color === color.value
                        ? "border-gray-400 scale-110 shadow-xl"
                        : "border-gray-200 hover:border-gray-300 hover:scale-105"
                    }`}
                    style={{ 
                      backgroundColor: color.value,
                      boxShadow: formData.color === color.value ? `0 8px 25px ${color.value}40` : undefined
                    }}
                    onClick={() => setFormData({ ...formData, color: color.value })}
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            {/* Ícone */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Ícone do Catálogo</Label>
              <div className="grid grid-cols-4 gap-3">
                {icons.map((icon) => {
                  const IconComp = icon.icon;
                  return (
                    <button
                      key={icon.value}
                      type="button"
                      className={`w-full h-12 rounded-xl border-2 flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg ${
                        formData.icon === icon.value
                          ? "border-purple-400 bg-purple-50 scale-110 shadow-xl"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:scale-105"
                      }`}
                      onClick={() => setFormData({ ...formData, icon: icon.value })}
                      title={icon.label}
                    >
                      <IconComp className={`w-6 h-6 ${
                        formData.icon === icon.value ? "text-purple-600" : "text-gray-600"
                      }`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-0 hover:from-gray-200 hover:to-gray-300 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 transform-gpu"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.name || !formData.target_audience}
              className="bg-gradient-to-r from-[#9747ff] to-[#7c3aed] hover:from-[#8b5cf6] hover:to-[#9333ea] border-0 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105 transform-gpu disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Criando...
                </>
              ) : (
                "Criar Catálogo"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}