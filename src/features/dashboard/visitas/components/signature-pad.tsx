"use client";

import { Eraser, Pen } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

type Props = {
  value?: string | null;
  onChange: (dataUrl: string | null) => void;
  height?: number;
  className?: string;
};

type Point = { x: number; y: number };

export function SignaturePad({ value, onChange, height = 220, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastPointRef = useRef<Point | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ratio = window.devicePixelRatio || 1;
    const width = container.clientWidth;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(ratio, ratio);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#141414";
      ctx.lineWidth = 2.2;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
    }
  }, [height]);

  useEffect(() => {
    resizeCanvas();
    const handler = () => resizeCanvas();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [resizeCanvas]);

  // Hidrata canvas com valor inicial (edição)
  useEffect(() => {
    if (!value) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.drawImage(img, 0, 0, rect.width, rect.height);
      setIsEmpty(false);
    };
    img.src = value;
  }, [value]);

  const getPoint = (event: PointerEvent | React.PointerEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const startDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(event.pointerId);

    setIsDrawing(true);
    lastPointRef.current = getPoint(event);
  };

  const draw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const point = getPoint(event);
    const last = lastPointRef.current || point;

    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();

    lastPointRef.current = point;
    if (isEmpty) setIsEmpty(false);
  };

  const stopDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    lastPointRef.current = null;

    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.releasePointerCapture(event.pointerId);
    } catch {
      /* noop */
    }

    const dataUrl = canvas.toDataURL("image/png");
    onChange(dataUrl);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);
    setIsEmpty(true);
    onChange(null);
  };

  return (
    <div className={className}>
      <div
        ref={containerRef}
        className="relative w-full rounded-xl border border-dashed border-gray-300 bg-white overflow-hidden touch-none"
      >
        <canvas
          ref={canvasRef}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
          onPointerCancel={stopDrawing}
          className="block w-full touch-none"
        />
        {isEmpty ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-gray-400">
            <Pen className="mr-2 h-4 w-4" />
            Assine no quadro acima
          </div>
        ) : null}
      </div>

      <div className="mt-2 flex justify-end">
        <Button type="button" variant="ghost" size="sm" onClick={handleClear} className="gap-2">
          <Eraser className="h-4 w-4" />
          Limpar assinatura
        </Button>
      </div>
    </div>
  );
}
