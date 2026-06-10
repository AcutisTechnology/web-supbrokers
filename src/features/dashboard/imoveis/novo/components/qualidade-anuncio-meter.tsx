"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { PropertyFormValues } from "../schemas/property-schema";

interface QualidadeAnuncioMeterProps {
  data: Partial<PropertyFormValues>;
}

type CategoryId = "localizacao" | "valores" | "descricao" | "caracteristicas" | "midias";

interface CategoryScore {
  id: CategoryId;
  label: string;
  earned: number;
  max: number;
  tips: string[];
}

function calcCategories(data: Partial<PropertyFormValues>): CategoryScore[] {
  // Localização (20 pts) — 5 pts por campo
  const locTips: string[] = [];
  let locEarned = 0;
  if (data.neighborhood?.trim()) locEarned += 5; else locTips.push("Informe o bairro");
  if (data.city?.trim()) locEarned += 5; else locTips.push("Informe a cidade");
  if (data.state?.trim()) locEarned += 5; else locTips.push("Informe o estado (UF)");
  if (data.zipcode?.trim()) locEarned += 5; else locTips.push("Informe o CEP");

  // Valores (20 pts)
  const valTips: string[] = [];
  let valEarned = 0;
  if (data.purpose === "both") {
    if ((data.value ?? 0) > 0) valEarned += 10; else valTips.push("Informe o valor de venda");
    if ((data.rent_price ?? 0) > 0) valEarned += 10; else valTips.push("Informe o valor de aluguel");
  } else {
    if ((data.value ?? 0) > 0) valEarned += 20;
    else valTips.push(data.purpose === "rent" ? "Informe o valor do aluguel" : "Informe o valor de venda");
  }

  // Descrição (30 pts) — 15 pts pelo comprimento + até 15 pts por palavras-chave
  const descTips: string[] = [];
  let descEarned = 0;
  const desc = data.description ?? "";
  if (desc.length >= 100) {
    descEarned += 15;
  } else {
    descTips.push(`Mínimo de 100 caracteres (faltam ${100 - desc.length})`);
  }

  const descLower = desc.toLowerCase();
  const kwGroups: [string, string[]][] = [
    ["quarto", ["quarto", "quartos"]],
    ["banheiro", ["banheiro", "banheiros"]],
    ["área", ["área", "area", "m²"]],
    ["suíte", ["suíte", "suite", "suites", "suítes"]],
    ["varanda", ["varanda", "varandas"]],
  ];
  const foundKws = kwGroups.filter(([, variants]) => variants.some((v) => descLower.includes(v)));
  descEarned += foundKws.length * 3;
  if (foundKws.length < kwGroups.length) {
    const missing = kwGroups
      .filter(([, variants]) => !variants.some((v) => descLower.includes(v)))
      .map(([label]) => label)
      .join(", ");
    descTips.push(`Mencione: ${missing}`);
  }

  // Características (15 pts)
  const charTips: string[] = [];
  let charEarned = 0;
  const charCount = (data.characteristics ?? []).length;
  if (charCount >= 5) charEarned = 15;
  else if (charCount >= 3) charEarned = 10;
  else if (charCount >= 1) charEarned = 5;
  if (charCount < 5) {
    charTips.push(
      charCount === 0
        ? "Selecione ao menos 3 características do imóvel"
        : `Selecione mais ${5 - charCount} característica(s) (tem ${charCount})`
    );
  }

  // Mídias (30 pts)
  const mediaTips: string[] = [];
  let mediaEarned = 0;
  const photoCount = (data.attachments ?? []).length;
  if (photoCount >= 5) mediaEarned = 30;
  else if (photoCount >= 3) mediaEarned = 20;
  else if (photoCount >= 1) mediaEarned = 10;
  if (photoCount < 5) {
    mediaTips.push(
      photoCount === 0
        ? "Adicione fotos do imóvel (mínimo recomendado: 5)"
        : `Adicione mais ${5 - photoCount} foto(s) para nota máxima (tem ${photoCount})`
    );
  }

  return [
    { id: "localizacao", label: "Localização", earned: locEarned, max: 20, tips: locTips },
    { id: "valores", label: "Valores", earned: valEarned, max: 20, tips: valTips },
    { id: "descricao", label: "Descrição", earned: descEarned, max: 30, tips: descTips },
    { id: "caracteristicas", label: "Características", earned: charEarned, max: 15, tips: charTips },
    { id: "midias", label: "Mídias", earned: mediaEarned, max: 30, tips: mediaTips },
  ];
}

const TOTAL_MAX = 115; // 20+20+30+15+30

function scoreColor(score: number) {
  if (score >= 7) return "#22c55e";
  if (score >= 4) return "#f59e0b";
  return "#ef4444";
}

export function QualidadeAnuncioMeter({ data }: QualidadeAnuncioMeterProps) {
  const categories = useMemo(() => calcCategories(data), [data]);

  const totalEarned = categories.reduce((s, c) => s + c.earned, 0);
  const score = Math.round((totalEarned / TOTAL_MAX) * 100) / 10;
  const color = scoreColor(score);

  // Default to first incomplete category
  const firstIncomplete = categories.find((c) => c.tips.length > 0)?.id ?? "localizacao";
  const [activeId, setActiveId] = useState<CategoryId>(firstIncomplete);
  const active = categories.find((c) => c.id === activeId)!;

  // SVG ring
  const R = 32;
  const circ = 2 * Math.PI * R;
  const dashOffset = circ * (1 - score / 10);

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-gray-800">Qualidade do Anúncio</h3>

      {/* Circular score */}
      <div className="mb-1 flex flex-col items-center">
        <div className="relative flex items-center justify-center">
          <svg width="84" height="84" viewBox="0 0 84 84">
            <circle cx="42" cy="42" r={R} fill="none" stroke="#e5e7eb" strokeWidth="7" />
            <circle
              cx="42"
              cy="42"
              r={R}
              fill="none"
              stroke={color}
              strokeWidth="7"
              strokeDasharray={circ}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform="rotate(-90 42 42)"
              style={{ transition: "stroke-dashoffset 0.5s ease, stroke 0.4s ease" }}
            />
          </svg>
          <span
            className="absolute text-xl font-bold tabular-nums"
            style={{ color, transition: "color 0.4s ease" }}
          >
            {score.toFixed(1)}
          </span>
        </div>
        <div className="mt-1 flex w-full max-w-[84px] justify-between text-[10px] text-muted-foreground">
          <span>0</span>
          <span>10</span>
        </div>
      </div>

      {/* Category pills */}
      <div className="mb-3 mt-4">
        <p className="mb-2 text-xs font-medium text-gray-700">O que pode melhorar sua nota?</p>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => {
            const done = cat.earned === cat.max;
            const isActive = activeId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveId(cat.id)}
                className={[
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-violet-700 text-white shadow-sm"
                    : done
                    ? "border border-green-300 bg-green-50 text-green-700"
                    : "border border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200",
                ].join(" ")}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tips panel */}
      {active.tips.length > 0 ? (
        <div className="rounded-lg bg-amber-50 p-3">
          <div className="mb-1.5 flex items-center gap-1.5 text-amber-700">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span className="text-xs font-medium">
              Ao descrever {active.label === "Mídias" ? "as mídias" : `a ${active.label.toLowerCase()}`}, atente-se:
            </span>
          </div>
          <ul className="space-y-0.5">
            {active.tips.map((tip, i) => (
              <li key={i} className="text-xs text-amber-800">
                – {tip}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 rounded-lg bg-green-50 p-3">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-600" />
          <p className="text-xs font-medium text-green-700">{active.label} completa!</p>
        </div>
      )}

      {/* Progress bar per category */}
      <div className="mt-4 space-y-2">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center gap-2">
            <span className="w-24 text-[10px] text-gray-500 truncate">{cat.label}</span>
            <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(cat.earned / cat.max) * 100}%`,
                  backgroundColor: scoreColor((cat.earned / cat.max) * 10),
                }}
              />
            </div>
            <span className="w-6 text-right text-[10px] tabular-nums text-gray-400">
              {cat.earned}/{cat.max}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
