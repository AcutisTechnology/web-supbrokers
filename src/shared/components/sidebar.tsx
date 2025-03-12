"use client";

import Image from "next/image";
import Link from "next/link";
import { Home, Building2, Users, Settings, LogOut, Files } from "lucide-react";
import { useAuth } from "../hooks/auth/use-auth";

export function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="w-[240px] bg-white flex flex-col border-r m-5 rounded-2xl border-[1px] border-border">
      <div className="p-6">
        <Image
          src="/images/logo-login.png"
          alt="Supbrokers"
          width={120}
          height={32}
          className="mb-8"
        />

        <nav className="space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100"
          >
            <Home size={20} />
            Home
          </Link>
          <Link
            href="/dashboard/imoveis"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100"
          >
            <Building2 size={20} />
            Imóveis
          </Link>
          <Link
            href="/dashboard/clientes"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100"
          >
            <Users size={20} />
            Clientes
          </Link>
          <Link
            href="/dashboard/alugueis"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100"
          >
            <Files size={20} />
            Gestão de alugéis
          </Link>
        </nav>

        <div className="mt-8">
          <p className="px-3 text-xs font-medium text-gray-400 uppercase">
            Minha Conta
          </p>
          <nav className="mt-2 space-y-1">
            <Link
              href="/dashboard/perfil"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100"
            >
              <span className="w-5 h-5 rounded bg-gray-100" />
              Meu perfil
            </Link>
            <Link
              href="/dashboard/planos"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100"
            >
              <span className="w-5 h-5 rounded bg-gray-100" />
              Planos
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100"
            >
              <span className="w-5 h-5 rounded bg-gray-100" />
              Suporte
            </Link>
          </nav>
        </div>
      </div>

      <div className="mt-auto p-6 border-t">
        <Link
          href="#"
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100"
        >
          <Settings size={20} />
          Configurações
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-gray-100"
        >
          <LogOut size={20} />
          Sair
        </button>
      </div>
    </aside>
  );
}
