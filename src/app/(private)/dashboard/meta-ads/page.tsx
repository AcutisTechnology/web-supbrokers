"use client";

import { Button } from "@/components/ui/button";
import { TopNav } from "@/features/dashboard/imoveis/top-nav";
import { useToast } from "@/hooks/use-toast";
import { Facebook } from "lucide-react";

export default function MetaAdsPage() {
  const { toast } = useToast();

  const handleConnect = () => {
    toast({
      title: "Em breve",
      description: "A integração com Meta ADS ainda está em desenvolvimento.",
    });
  };

  return (
    <>
      <TopNav title_secondary="Meta ADS" />
      <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center px-6">
        <div className="w-full max-w-lg text-center">
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <svg viewBox="0 0 48 48" className="w-12 h-12 text-[#0866FF]" fill="none">
                <path
                  d="M40.4 34.2c-2.1 0-3.7-1.3-5.3-4.1c-2-3.5-4.3-8.8-6.2-13.1c-1.7-3.9-3-6.8-4.5-6.8c-1.4 0-2.7 2.8-4.4 6.7c-1.9 4.4-4.2 9.7-6.2 13.2c-1.6 2.8-3.2 4.1-5.3 4.1c-2.7 0-5-2.9-5-7.1C3.5 19 9.8 11.5 18.2 11.5c4.1 0 7.1 1.7 9.2 4.8c2.1-3.1 5.2-4.8 9.2-4.8c8.4 0 14.7 7.5 14.7 15.6c0 4.2-2.3 7.1-5 7.1Z"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="h-10 w-px bg-gray-200" />

            <div className="w-12 h-12 rounded-full flex items-center justify-center text-[#0866FF]">
              <Facebook className="w-10 h-10" />
            </div>
          </div>

          <h1 className="text-2xl font-semibold text-[#141414] mb-2">Conecte seus anúncios</h1>
          <p className="text-[#777777] mb-8">Gerencie suas campanhas do Facebook e Instagram em um só lugar</p>

          <Button
            onClick={handleConnect}
            className="bg-[#0866FF] hover:bg-[#0866FF]/90 text-white h-12 px-8 rounded-xl gap-2 shadow-md"
          >
            <Facebook className="w-4 h-4" />
            Entrar com Meta
          </Button>

          <p className="text-xs text-[#9A9A9A] mt-6">Seguro e privado • Seus dados estão protegidos</p>
        </div>
      </div>
      <div className="mt-8 text-center text-sm text-[#777777]">Copyright © iMoobile. Todos os direitos reservados</div>
    </>
  );
}
