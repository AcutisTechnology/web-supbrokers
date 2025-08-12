import { PropertyFormWizard } from '@/features/dashboard/imoveis/novo/components/property-form-wizard';
import { TopNav } from "@/features/dashboard/imoveis/top-nav";

export default function NovoImovel() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header minimalista */}
      <div className="border-b border-gray-100 bg-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cadastrar Novo Imóvel</h1>
          <p className="text-gray-600 text-lg">Preencha as informações do imóvel para cadastrá-lo no sistema</p>
        </div>
      </div>
      
      {/* Conteúdo principal */}
      <div className="px-6 py-8">
        <PropertyFormWizard />
      </div>
    </main>
  );
}
