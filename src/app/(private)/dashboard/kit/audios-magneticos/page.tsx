import { BookOpen, Play } from "lucide-react";
import { TopNav } from "@/shared/components/top-nav";
import { GUIDES, AUDIOS } from "@/features/kit/data/audios-magneticos";
import { GuideCard } from "@/features/kit/components/guide-card";
import { AudioCard } from "@/features/kit/components/audio-card";

export default function AudiosMagneticosPage() {
  return (
    <>
      <TopNav title_secondary="Roteiro de Áudios Magnéticos" />

      <p className="text-sm text-[#777777] mb-10 leading-relaxed max-w-2xl">
        O áudio é a ferramenta mais poderosa para gerar conexão e quebrar objeções no WhatsApp.
        Aprenda a estrutura exata para gravar áudios que prendem a atenção e acesse nossa biblioteca
        de scripts de alta conversão.
      </p>

      {/* Seção 1 */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0">
            <BookOpen className="w-5 h-5 text-[#16ae4f]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Seção 1: Guia de Como Gravar</h2>
            <p className="text-xs text-muted-foreground">Os 7 pilares essenciais de um áudio magnético.</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {GUIDES.map((guide) => (
            <GuideCard key={guide.id} card={guide} />
          ))}
        </div>
      </div>

      {/* Seção 2 */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-[#16ae4f] w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
            <Play className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Seção 2: Áudios Prontos</h2>
            <p className="text-xs text-muted-foreground">10 Roteiros validados para copiar, gravar e converter.</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
          {AUDIOS.map((audio) => (
            <AudioCard key={audio.id} card={audio} />
          ))}
        </div>
      </div>
    </>
  );
}
