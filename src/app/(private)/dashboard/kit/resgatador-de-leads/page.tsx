import Link from "next/link";
import { TopNav } from "@/shared/components/top-nav";
import { NICHOS } from "@/features/kit/data/resgatador-de-leads";

export default function ResgatadorNichosPage() {
  return (
    <>
      <TopNav title_secondary="O Resgatador de Leads" />

      <p className="text-sm text-[#777777] mb-8 leading-relaxed">
        Leads frios não estão perdidos, eles apenas esqueceram o motivo pelo qual te procuraram.
        Escolha o segmento abaixo para acessar a cadência de 10 dias validada para ressuscitar o
        desejo de compra.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {NICHOS.map((nicho) => (
          <Link
            key={nicho.id}
            href={`/dashboard/kit/resgatador-de-leads/${nicho.id}`}
            className="group"
          >
            <div
              className={`${nicho.bgColorClass} border ${nicho.borderColorClass} rounded-2xl p-6 flex flex-col gap-4 min-h-[200px] transition-transform group-hover:-translate-y-0.5`}
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl ${nicho.bgColorClass} border ${nicho.borderColorClass}`}
              >
                {nicho.iconEmoji}
              </div>

              <div className="flex-1">
                <h2 className={`text-base font-bold ${nicho.titleColorClass} mb-1.5 leading-snug`}>
                  {nicho.title}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed">{nicho.description}</p>
              </div>

              <p className={`text-xs font-bold tracking-widest uppercase ${nicho.ctaColorClass}`}>
                Acessar sequência →
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
