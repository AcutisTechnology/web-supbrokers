"use client";

import { CaptacaoForm } from "@/features/dashboard/captacoes/components/captacao-form";

export default function NovaCaptacaoPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="border-b border-gray-100 bg-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cadastrar Nova Captação</h1>
          <p className="text-gray-600 text-lg">Preencha as informações do empreendimento e links do drive</p>
        </div>
      </div>

      <div className="px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <CaptacaoForm />
        </div>
      </div>
    </main>
  );
}
