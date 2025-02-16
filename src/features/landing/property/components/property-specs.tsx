import { Building2, Maximize2, Car, BedDouble } from "lucide-react";

export function PropertySpecs() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <div className="text-sm">
          <div className="font-medium">Apartamento</div>
          <div className="text-muted-foreground">10° andar</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Maximize2 className="h-4 w-4 text-muted-foreground" />
        <div className="text-sm">
          <div className="font-medium">92m²</div>
          <div className="text-muted-foreground">Tamanho</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <BedDouble className="h-4 w-4 text-muted-foreground" />
        <div className="text-sm">
          <div className="font-medium">3 quartos</div>
          <div className="text-muted-foreground">1 suíte</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Car className="h-4 w-4 text-muted-foreground" />
        <div className="text-sm">
          <div className="font-medium">2 vagas</div>
          <div className="text-muted-foreground">Garagem</div>
        </div>
      </div>
    </div>
  );
}
