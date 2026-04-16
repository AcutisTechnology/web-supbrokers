import { TopNav } from "@/features/dashboard/imoveis/top-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AgenteIaPage() {
  return (
    <>
      <TopNav title_secondary="Agente de IA" />
      <Card className="border border-gray-100 shadow-sm">
        <CardHeader>
          <CardTitle>Agente de IA</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-[#777777]">Em breve.</CardContent>
      </Card>
      <div className="mt-8 text-center text-sm text-[#777777]">Copyright © iMoobile. Todos os direitos reservados</div>
    </>
  );
}

