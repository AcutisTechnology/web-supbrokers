import { Building2, Maximize2, Car, BedDouble } from "lucide-react";

interface PropertySpecsProps {
  size: number;
  bedrooms: number;
  garages: number;
}

export function PropertySpecs({ size, bedrooms, garages }: PropertySpecsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <div className="text-sm">
          <div className="font-medium">Imóvel</div>
          <div className="text-muted-foreground">Residencial</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Maximize2 className="h-4 w-4 text-muted-foreground" />
        <div className="text-sm">
          <div className="font-medium">{size}m²</div>
          <div className="text-muted-foreground">Tamanho</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <BedDouble className="h-4 w-4 text-muted-foreground" />
        <div className="text-sm">
          <div className="font-medium">{bedrooms} {bedrooms === 1 ? 'quarto' : 'quartos'}</div>
          <div className="text-muted-foreground">Dormitórios</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Car className="h-4 w-4 text-muted-foreground" />
        <div className="text-sm">
          <div className="font-medium">{garages} {garages === 1 ? 'vaga' : 'vagas'}</div>
          <div className="text-muted-foreground">Garagem</div>
        </div>
      </div>
    </div>
  );
}
