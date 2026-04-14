"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy } from "lucide-react";

type Props = {
  text: string;
  onCopy: () => void;
};

export function SimulationSummary({ text, onCopy }: Props) {
  return (
    <Card className="border-[#E2E2E2] shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base font-bold text-[#4A316A]">Resumo da Simulação</CardTitle>
          <Button className="bg-[#4A316A] hover:bg-[#3a2654] text-white" onClick={onCopy}>
            <Copy className="w-4 h-4 mr-2" />
            Copiar Texto
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea className="bg-gray-50 border-[#E2E2E2] min-h-[180px] whitespace-pre-wrap" value={text} readOnly />
      </CardContent>
    </Card>
  );
}

