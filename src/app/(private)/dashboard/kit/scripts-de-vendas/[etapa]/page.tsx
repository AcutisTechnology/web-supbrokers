"use client";

import { useParams, notFound } from "next/navigation";
import {
  AlertTriangle,
  MessageSquare,
  Target,
  Sparkles,
  Lightbulb,
} from "lucide-react";
import { TopNav } from "@/shared/components/top-nav";
import { getEtapa } from "@/features/kit/data/scripts-de-vendas";
import { ScriptCard } from "@/features/kit/components/script-card";
import { CopyButton } from "@/features/kit/components/copy-button";

export default function EtapaPage() {
  const params = useParams();
  const etapaId = parseInt(params.etapa as string, 10);

  if (isNaN(etapaId) || etapaId < 1 || etapaId > 7) {
    notFound();
  }

  const etapa = getEtapa(etapaId);
  if (!etapa) notFound();

  const regrasBgClass =
    etapa.regrasBg === "green"
      ? "bg-[#f0fdf4] border border-[#bbf7d0]"
      : "bg-[#fffbe6] border border-[#fde68a]";
  const regrasTitleClass =
    etapa.regrasBg === "green" ? "text-[#15803d]" : "text-[#b45309]";
  const regrasIconClass =
    etapa.regrasBg === "green" ? "text-[#16ae4f]" : "text-[#d97706]";
  const regrasCheckClass =
    etapa.regrasBg === "green" ? "text-[#16ae4f]" : "text-[#d97706]";

  return (
    <>
      <TopNav title_secondary={etapa.title} />

      <p className="text-sm text-[#777777] mb-8 leading-relaxed">
        {etapa.pageSubtitle}
      </p>

      {/* Regras Obrigatórias */}
      {etapa.regras && etapa.regras.length > 0 && (
        <div className={`${regrasBgClass} rounded-xl p-5 mb-8`}>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className={`w-5 h-5 ${regrasIconClass}`} />
            <h2 className={`font-bold text-sm ${regrasTitleClass}`}>
              Regras Obrigatórias
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {etapa.regras.map((regra, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className={`mt-0.5 text-sm font-bold ${regrasCheckClass}`}>
                  ✓
                </span>
                <p className="text-xs text-gray-600 leading-relaxed">{regra}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Script Cards */}
      {etapa.cards && etapa.cards.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {etapa.cards.map((card) => (
            <ScriptCard key={card.id} card={card} />
          ))}
        </div>
      )}

      {/* Profile Cards — Etapa 7 */}
      {etapa.profileCards && etapa.profileCards.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {etapa.profileCards.map((profile) => (
            <div
              key={profile.id}
              className={`${profile.bgColorClass} border ${profile.borderColorClass} rounded-xl p-5 flex flex-col gap-4`}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{profile.iconEmoji}</span>
                <h3 className={`font-bold text-sm ${profile.titleColorClass}`}>
                  {profile.type}
                </h3>
              </div>

              <div className="space-y-3 flex-1">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
                    Características do Cliente
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {profile.characteristics}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
                    Foco da Comunicação
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {profile.focus.map((f) => (
                      <span
                        key={f}
                        className="bg-white/70 text-gray-600 text-[10px] px-2 py-0.5 rounded-full border border-white"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
                    Como Falar
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {profile.howToSpeak}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <MessageSquare className="w-3 h-3 text-[#16ae4f]" />
                    <p className="text-[10px] font-semibold text-[#16ae4f] uppercase tracking-widest">
                      Exemplo de Condução
                    </p>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed italic bg-white/60 rounded-lg p-2">
                    {profile.conductExample}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#16ae4f]" />
                    <p className="text-[10px] font-semibold text-[#16ae4f]">
                      Padrão Psicológico
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed pl-4 mt-1">
                    {profile.padrao}
                  </p>
                </div>

                <div className="bg-white/60 border-l-2 border-[#16ae4f] rounded-r-lg p-2.5">
                  <div className="flex items-center gap-1 mb-1">
                    <Lightbulb className="w-3 h-3 text-[#16ae4f]" />
                    <p className="text-[10px] font-semibold text-[#16ae4f]">
                      Insight
                    </p>
                  </div>
                  <p className="text-xs text-[#16ae4f] italic leading-relaxed">
                    {profile.insight}
                  </p>
                </div>
              </div>

              <CopyButton
                messages={[profile.conductExample]}
                label="Copiar Exemplo"
              />
            </div>
          ))}
        </div>
      )}

      {/* Postura do Corretor — Etapa 7 */}
      {etapa.posturaBlock && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
          <h2 className="font-bold text-[#141414] mb-1 text-base">
            Postura do Corretor
          </h2>
          <p className="text-xs text-[#777777] mb-5 italic">
            &ldquo;A postura dita a autoridade. Adapte-se ou seja ignorado.&rdquo;
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mb-5">
            {etapa.posturaBlock.sections.map((section) => (
              <div
                key={section.profile}
                className="bg-gray-50 rounded-lg p-4 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{section.iconEmoji}</span>
                  <p className="text-sm font-semibold text-[#141414]">
                    {section.profile}
                  </p>
                </div>
                <p className="text-xs text-[#777777] leading-relaxed">
                  {section.description}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Target className="w-3.5 h-3.5 text-[#16ae4f]" />
                <p className="text-xs font-semibold text-[#16ae4f]">
                  Explicação Estratégica
                </p>
              </div>
              <p className="text-xs text-[#777777] leading-relaxed pl-5">
                {etapa.posturaBlock.estrategia}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#16ae4f]" />
                <p className="text-xs font-semibold text-[#16ae4f]">
                  Padrão Psicológico
                </p>
              </div>
              <p className="text-xs text-[#777777] leading-relaxed pl-5">
                {etapa.posturaBlock.padrao}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bloco Final */}
      {etapa.blocoFinal && (
        <div className="max-w-xl">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col">
            <div className="p-5 flex flex-col gap-4 flex-1">
              <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase text-center">
                {etapa.blocoFinal.label}
              </p>

              <div className="space-y-2">
                {etapa.blocoFinal.messages.map((msg, i) => (
                  <div key={i}>
                    {i === 0 ? (
                      <div className="flex gap-2.5">
                        <MessageSquare className="w-4 h-4 text-[#16ae4f] shrink-0 mt-0.5" />
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {msg}
                        </p>
                      </div>
                    ) : (
                      <div className="pl-6 space-y-1">
                        <p className="text-xs font-semibold text-gray-400">
                          Depois:
                        </p>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {msg}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-[#16ae4f]" />
                  <p className="text-xs font-semibold text-[#16ae4f]">
                    Explicação Estratégica
                  </p>
                </div>
                <p className="text-xs text-[#777777] leading-relaxed pl-5">
                  {etapa.blocoFinal.estrategia}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#16ae4f]" />
                  <p className="text-xs font-semibold text-[#16ae4f]">
                    Padrão Psicológico
                  </p>
                </div>
                <p className="text-xs text-[#777777] leading-relaxed pl-5">
                  {etapa.blocoFinal.padrao}
                </p>
              </div>

              <div className="bg-[#f0fdf4] border-l-2 border-[#16ae4f] rounded-r-lg p-3 space-y-1">
                <div className="flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-[#16ae4f]" />
                  <p className="text-xs font-semibold text-[#16ae4f]">
                    Insight
                  </p>
                </div>
                <p className="text-xs text-[#16ae4f] italic leading-relaxed">
                  {etapa.blocoFinal.insight}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0">
              <CopyButton messages={etapa.blocoFinal.messages} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
