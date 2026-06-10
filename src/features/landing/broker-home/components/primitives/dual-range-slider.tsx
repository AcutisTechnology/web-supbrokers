'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface DualRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  /** Pair de valores [start, end]. Quando `undefined`, considera-se sem limite. */
  value: [number | undefined, number | undefined];
  onChange: (value: [number | undefined, number | undefined]) => void;
  formatValue?: (value: number) => string;
  ariaLabel?: string;
}

/**
 * Dual range slider acessível em dark theme.
 * Usa dois <input type="range"> empilhados para suportar teclado/screen reader
 * e renderiza o "trilho preenchido" via gradiente CSS.
 */
export function DualRangeSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue,
  ariaLabel,
}: DualRangeSliderProps) {
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  const [start, setStart] = useState<number>(value[0] ?? min);
  const [end, setEnd] = useState<number>(value[1] ?? max);

  useEffect(() => {
    setStart(value[0] ?? min);
    setEnd(value[1] ?? max);
  }, [value, min, max]);

  const commit = useCallback(
    (nextStart: number, nextEnd: number) => {
      const s = Math.min(nextStart, nextEnd);
      const e = Math.max(nextStart, nextEnd);
      onChange([s === min ? undefined : s, e === max ? undefined : e]);
    },
    [onChange, min, max]
  );

  const fmt = formatValue ?? ((v: number) => v.toString());

  const startPercent = ((start - min) / (max - min)) * 100;
  const endPercent = ((end - min) / (max - min)) * 100;

  return (
    <div className="select-none">
      <div className="flex items-center justify-between mb-3 text-xs text-white/70">
        <span>
          De <strong className="text-white">{fmt(start)}</strong>
        </span>
        <span>
          Até <strong className="text-white">{fmt(end)}</strong>
        </span>
      </div>

      <div className="relative h-6">
        {/* Trilho de fundo */}
        <div className="absolute top-1/2 -translate-y-1/2 inset-x-0 h-1 rounded-full bg-white/10" />
        {/* Trilho preenchido */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1 rounded-full bg-amber-300"
          style={{
            left: `${startPercent}%`,
            right: `${100 - endPercent}%`,
          }}
        />

        <input
          ref={startRef}
          type="range"
          min={min}
          max={max}
          step={step}
          value={start}
          aria-label={ariaLabel ? `${ariaLabel} mínimo` : 'mínimo'}
          onChange={e => {
            const v = Number(e.target.value);
            setStart(v);
          }}
          onMouseUp={() => commit(start, end)}
          onTouchEnd={() => commit(start, end)}
          onKeyUp={() => commit(start, end)}
          className="dual-range absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto"
        />
        <input
          ref={endRef}
          type="range"
          min={min}
          max={max}
          step={step}
          value={end}
          aria-label={ariaLabel ? `${ariaLabel} máximo` : 'máximo'}
          onChange={e => {
            const v = Number(e.target.value);
            setEnd(v);
          }}
          onMouseUp={() => commit(start, end)}
          onTouchEnd={() => commit(start, end)}
          onKeyUp={() => commit(start, end)}
          className="dual-range absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto"
        />
      </div>

      <style jsx>{`
        .dual-range::-webkit-slider-thumb {
          appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 9999px;
          background: #fff;
          border: 2px solid #fcd34d;
          box-shadow: 0 4px 12px -4px rgba(0, 0, 0, 0.4);
          cursor: pointer;
          margin-top: 0px;
        }
        .dual-range::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 9999px;
          background: #fff;
          border: 2px solid #fcd34d;
          box-shadow: 0 4px 12px -4px rgba(0, 0, 0, 0.4);
          cursor: pointer;
        }
        .dual-range::-webkit-slider-runnable-track {
          height: 6px;
          background: transparent;
        }
        .dual-range::-moz-range-track {
          height: 6px;
          background: transparent;
        }
      `}</style>
    </div>
  );
}
