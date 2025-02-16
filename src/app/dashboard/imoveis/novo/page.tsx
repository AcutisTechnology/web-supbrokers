import { PropertyForm } from "@/features/dashboard/imoveis/novo/components/property-form";
import { TopNav } from "@/features/dashboard/imoveis/top-nav";

export default function NovoImovel() {
  return (
    <div className="flex min-h-screen bg-[#f6f6f6]">
      <main className="flex-1 px-6 py-4">
        <TopNav title_secondary="Publicar novo imóvel" />
        <PropertyForm />
      </main>
    </div>
  );
}
