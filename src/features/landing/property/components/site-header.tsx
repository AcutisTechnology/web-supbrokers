import Link from "next/link";
import { Search, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background flex justify-center items-center">
      <div className="container flex h-16 items-center gap-4 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-sm md:text-base font-semibold text-primary bg-secondary py-2 px-3 md:px-4 rounded-full">
            Voltar
          </span>
        </Link>

        <span className="text-sm md:text-lg">Supbroker Imobiliária</span>

        <div className="flex-1" />

        {/* Pesquisa (Oculta em telas muito pequenas) */}
        <div className="relative w-40 sm:w-64 hidden sm:block">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input className="pl-8" placeholder="Pesquisar" />
        </div>

        {/* Menu em telas pequenas */}
        <div className="sm:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href="/comprar">Comprar</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/alugar">Alugar</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/filtros">Mais filtros</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Botões (Visíveis apenas em telas médias e maiores) */}
        <div className="hidden sm:flex items-center gap-2">
          <Button>Comprar</Button>
          <Button variant="outline">Alugar</Button>
          <Button variant="ghost">Mais filtros</Button>
        </div>
      </div>
    </header>
  );
}
