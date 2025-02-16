import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PropertyGallery } from "./property-gallery";
import { PropertySpecs } from "./property-specs";
import { SimilarProperties } from "./similar-properties";

export function PropertyListing() {
  return (
    <div className="grid gap-8">
      <div className="grid gap-6">
        <PropertyGallery />
        <div className="grid gap-6 lg:grid-cols-[1fr,300px]">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-semibold">
                Apartamento à venda em Tatuapé com 92 m², 3 quartos, 1 suíte, 2
                vagas
              </h1>
              <p className="text-muted-foreground">
                Rua Randal Cavalcanti Pimentel - Bessa, João Pessoa
              </p>
            </div>
            <p className="text-muted-foreground">
              Lançamento de alto padrão no Jardim Luna, com ambientes pensados
              para conforto e praticidade dos moradores, e a incrível Alameda
              Ray Carlerim, um presente a João Pessoa.
            </p>
            <PropertySpecs />
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">
                Características do apartamento
              </h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  "Lavabo",
                  "Vista para o mar",
                  "Perto do centro",
                  "Área valorizada",
                  "Porteiro",
                  "Portão eletrônico",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-secondary">
            <div className="space-y-4">
              <div className="p-6">
                <div>
                  <div className="text-sm text-muted-foreground">
                    Valor à vista
                  </div>
                  <div className="text-2xl font-semibold">R$ 2.200.000</div>
                </div>
                <Button className="w-full" size="lg">
                  Tenho interesse
                </Button>
              </div>
              <div className="space-y-2 px-6 pb-6 h-full">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Parcelas a partir de
                  </span>
                  <span className="font-medium">R$ 2.615/mês</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">IPTU</span>
                  <span className="font-medium">R$ 5.480/ano</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Entrada estimada
                  </span>
                  <span className="font-medium">R$ 15.480/ano</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SimilarProperties />
    </div>
  );
}
