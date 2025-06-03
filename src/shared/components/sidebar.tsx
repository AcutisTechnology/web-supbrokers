"use client";

import Image from "next/image";
import Link from "next/link";
import { Home, Building2, Users, Settings, LogOut, Files, Menu, X, User, CreditCard, HelpCircle, ChevronLeft, ChevronRight, Building } from "lucide-react";
import { useAuth } from "../hooks/auth/use-auth";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Rolando para baixo e passou de 100px
        setIsHeaderVisible(false);
      } else {
        // Rolando para cima ou no topo
        setIsHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlHeader);
    
    return () => {
      window.removeEventListener('scroll', controlHeader);
    };
  }, [lastScrollY]);

  return (
    <div className={`flex-shrink-0 md:p-4 transition-all duration-300 ${isCollapsed ? 'md:w-[80px]' : 'md:w-[280px]'}`}>
      {/* Header Mobile */}
      <header className={`
        fixed top-0 left-0 right-0 h-16 bg-white border-b z-[60] md:hidden
        transform transition-transform duration-300 ease-in-out
        ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}
      `}>
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
        fixed md:relative top-0 inset-y-0 left-0 z-[50]
        bg-white flex flex-col h-screen md:h-[calc(100vh-2rem)]
        rounded-2xl border border-gray-200 shadow-xl
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isCollapsed ? 'md:w-[80px]' : 'w-[280px]'}
      `}>
        {/* Botão de Toggle para Desktop */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-6 hidden md:flex h-6 w-6 rounded-full bg-white border border-gray-200 shadow-md hover:shadow-lg transition-all duration-200 z-10"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>

        <div className="p-6 overflow-y-auto flex-1">
          {/* Logo Desktop */}
          <div className="hidden md:block mb-8 transition-all duration-300">
            {!isCollapsed ? (
              <Image
                src="/logo-extendida.svg"
                alt="iMoobile"
                width={120}
                height={32}
                className="transition-opacity duration-300"
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">iM</span>
              </div>
            )}
          </div>

          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 text-sm font-medium text-[#141414] rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all duration-200 group ${isCollapsed ? 'justify-center px-2 py-4' : 'px-3 py-3'}`}
              onClick={() => setIsOpen(false)}
              title={isCollapsed ? "Home" : ""}
            >
              <Home size={isCollapsed ? 32 : 20} className="text-gray-600 group-hover:text-[#9747ff] transition-colors" />
              {!isCollapsed && <span>Home</span>}
            </Link>
            <Link
              href="/dashboard/imoveis"
              className={`flex items-center gap-3 text-sm font-medium text-[#141414] rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all duration-200 group ${isCollapsed ? 'justify-center px-2 py-4' : 'px-3 py-3'}`}
              onClick={() => setIsOpen(false)}
              title={isCollapsed ? "Imóveis" : ""}
            >
              <Building2 size={isCollapsed ? 32 : 20} className="text-gray-600 group-hover:text-[#9747ff] transition-colors" />
              {!isCollapsed && <span>Imóveis</span>}
            </Link>
            <Link
              href="/dashboard/alugueis"
              className={`flex items-center gap-3 text-sm font-medium text-[#141414] rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all duration-200 group ${isCollapsed ? 'justify-center px-2 py-4' : 'px-3 py-3'}`}
              onClick={() => setIsOpen(false)}
              title={isCollapsed ? "Alugueis" : ""}
            >
              <Building size={isCollapsed ? 32 : 20} className="text-gray-600 group-hover:text-[#9747ff] transition-colors" />
              {!isCollapsed && <span>Alugueis</span>}
            </Link>
            <Link
              href="/dashboard/clientes"
              className={`flex items-center gap-3 text-sm font-medium text-[#141414] rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all duration-200 group ${isCollapsed ? 'justify-center px-2 py-4' : 'px-3 py-3'}`}
              onClick={() => setIsOpen(false)}
              title={isCollapsed ? "Clientes" : ""}
            >
              <Users size={isCollapsed ? 32 : 20} className="text-gray-600 group-hover:text-[#9747ff] transition-colors" />
              {!isCollapsed && <span>Clientes</span>}
            </Link>
          </nav>

          {!isCollapsed && (
            <div className="mt-8 transition-all duration-300">
              <p className="px-3 text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                Minha Conta
              </p>
              <nav className="space-y-2">
                <Link
                  href="/dashboard/perfil"
                  className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-[#141414] rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all duration-200 group"
                  onClick={() => setIsOpen(false)}
                >
                  <User size={20} className="text-gray-600 group-hover:text-[#9747ff] transition-colors" />
                  Meu perfil
                </Link>
                <Link
                  href="/dashboard/configuracoes"
                  className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-[#141414] rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all duration-200 group"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings size={20} className="text-gray-600 group-hover:text-[#9747ff] transition-colors" />
                  Configurações
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-[#141414] rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all duration-200 group"
                  onClick={() => setIsOpen(false)}
                >
                  <HelpCircle size={20} className="text-gray-600 group-hover:text-[#9747ff] transition-colors" />
                  Suporte
                </Link>
              </nav>
            </div>
          )}

          {isCollapsed && (
            <div className="mt-8 space-y-2 transition-all duration-300">
              <Link
                href="/dashboard/perfil"
                className="flex items-center justify-center px-2 py-4 text-sm font-medium text-[#141414] rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all duration-200 group"
                onClick={() => setIsOpen(false)}
                title="Meu perfil"
              >
                <User size={32} className="text-gray-600 group-hover:text-[#9747ff] transition-colors" />
              </Link>
              <Link
                href="/dashboard/configuracoes"
                className="flex items-center justify-center px-2 py-4 text-sm font-medium text-[#141414] rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all duration-200 group"
                onClick={() => setIsOpen(false)}
                title="Configurações"
              >
                <Settings size={32} className="text-gray-600 group-hover:text-[#9747ff] transition-colors" />
              </Link>
              <Link
                href="#"
                className="flex items-center justify-center px-2 py-4 text-sm font-medium text-[#141414] rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all duration-200 group"
                onClick={() => setIsOpen(false)}
                title="Suporte"
              >
                <HelpCircle size={32} className="text-gray-600 group-hover:text-[#9747ff] transition-colors" />
              </Link>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100">
          <button
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            className={`flex items-center gap-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 hover:shadow-sm transition-all duration-200 w-full group ${isCollapsed ? 'justify-center px-2 py-4' : 'px-3 py-3 text-left'}`}
            title={isCollapsed ? "Sair" : ""}
          >
            <LogOut size={isCollapsed ? 32 : 20} className="group-hover:text-red-700 transition-colors" />
            {!isCollapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>
    </div>
  );
}
