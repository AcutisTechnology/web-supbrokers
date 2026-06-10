"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { getCopyText } from "@/features/kit/data/scripts-de-vendas";

interface CopyButtonProps {
  messages: string[];
  label?: string;
}

export function CopyButton({ messages, label = "Copiar Mensagem" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getCopyText(messages));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for environments without clipboard API
      const el = document.createElement("textarea");
      el.value = getCopyText(messages);
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="w-full flex items-center justify-center gap-2 bg-[#16ae4f] hover:bg-[#15a047] active:bg-[#138f40] text-white font-medium py-3 px-4 rounded-lg transition-colors text-sm"
    >
      {copied ? (
        <Check className="w-4 h-4 shrink-0" />
      ) : (
        <Copy className="w-4 h-4 shrink-0" />
      )}
      {copied ? "Mensagem Copiada!" : label}
    </button>
  );
}
