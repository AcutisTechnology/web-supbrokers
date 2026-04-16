import { TopNav } from "@/features/dashboard/imoveis/top-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FollowUpPage() {
  return (
    <>
      <TopNav title_secondary="Follow-up" />
      <Card className="border border-gray-100 shadow-sm">
        <CardHeader>
          <CardTitle>Follow-up</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-[#777777]">Em breve.</CardContent>
      </Card>
      <div className="mt-8 text-center text-sm text-[#777777]">Copyright © iMoobile. Todos os direitos reservados</div>
    </>
  );
}

