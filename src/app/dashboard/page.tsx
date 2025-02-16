import { Building2, ChevronRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium text-[#141414]">Olá, Corretor</h1>
        <p className="text-[#969696]">Bem vindo ao Supbrokers</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                <h2 className="text-lg font-medium">Imóveis</h2>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>

            <div className="text-sm text-gray-500">
              <span className="font-medium text-[#141414]">2/10</span> imóveis
              cadastrados
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg shrink-0" />
              <div>
                <h3 className="font-medium">Residencial Vista do Atlântico</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>1.345</span>
                  <span>•</span>
                  <span>12</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <h2 className="text-lg font-medium">Clientes</h2>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium">Lucas Santana Ramos Cartaxo</span>
              <Button variant="outline" size="sm">
                Visualizar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="py-12 flex flex-col items-center text-center">
          <div className="w-12 h-12 mb-4 rounded-full bg-[#9747ff]/10 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-[#9747ff]" />
          </div>
          <h3 className="text-lg font-medium mb-1">Novos conteúdos</h3>
          <p className="text-[#969696] mb-6">em breve!</p>
          <p className="text-sm text-[#969696] mb-4">
            Se inscreva na nossa newsletter e<br />
            fique de olho nas novidades.
          </p>
          <Button className="bg-[#9747ff] hover:bg-[#9747ff]/90">
            Inscrever-se
          </Button>
        </CardContent>
      </Card>

      <footer className="text-center text-sm text-[#969696]">
        Copyright © Supbrokers. Todos os direitos reservados
      </footer>
    </div>
  );
}
