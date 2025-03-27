"use client";

import Image from "next/image";
import Link from "next/link";
import { Home, Building2, Users, Settings, LogOut, Files, Menu, X } from "lucide-react";
import { useAuth } from "../hooks/auth/use-auth";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:w-[280px] flex-shrink-0">
      {/* Header Mobile */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b z-[60] md:hidden">
        <div className="flex items-center justify-between h-full px-4">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <Image
            src="/logo-extendida.svg"
            alt="iMoobile"
            width={100}
            height={26}
            className="h-6 w-auto"
          />
          <div className="w-10" />
        </div>
      </header>

      {/* Overlay para fechar o menu em mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[40] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 inset-y-0 left-0 z-[50]
        w-[280px] bg-white flex flex-col border-r h-screen
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 overflow-y-auto flex-1">
          {/* Logo Desktop */}
          <div className="hidden md:block mb-8">
            <Image
              src="/logo-extendida.svg"
              alt="iMoobile"
              width={120}
              height={32}
            />
          </div>

          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 mt-10 py-2.5 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Home size={20} />
              Home
            </Link>
            <Link
              href="/dashboard/imoveis"
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Building2 size={20} />
              Imóveis
            </Link>
            <Link
              href="/dashboard/clientes"
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Users size={20} />
              Clientes
            </Link>
          </nav>

          <div className="mt-8">
            <p className="px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
              Minha Conta
            </p>
            <nav className="mt-2 space-y-1">
              <Link
                href="/dashboard/perfil"
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <span className="w-5 h-5 rounded bg-gray-100" />
                Meu perfil
              </Link>
              <Link
                href="/dashboard/planos"
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <span className="w-5 h-5 rounded bg-gray-100" />
                Planos
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <span className="w-5 h-5 rounded bg-gray-100" />
                Suporte
              </Link>
            </nav>
          </div>
        </div>

        <div className="p-6 border-t">
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <Settings size={20} />
            Configurações
          </Link>
          <button
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-gray-100 transition-colors w-full text-left"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </aside>
    </div>
  );
}
