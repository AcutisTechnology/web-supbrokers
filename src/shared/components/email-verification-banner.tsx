"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { useAuth } from "@/shared/hooks/auth/use-auth";

/**
 * Aviso não-bloqueante exibido quando a conta do usuário ainda não teve o
 * e-mail confirmado. O login continua permitido (decisão "Sim, mas com aviso").
 * Contas criadas pelo fluxo de cadastro já nascem verificadas, então este
 * banner aparece apenas para usuários legados ou criados por um administrador.
 */
export function EmailVerificationBanner() {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  const isVerified = !!user?.user?.email_verified_at;

  if (!user || isVerified || dismissed) {
    return null;
  }

  return (
    <div className="mb-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
      <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
      <div className="flex-1 text-sm">
        <p className="font-medium text-amber-800">Confirme seu e-mail</p>
        <p className="text-amber-700">
          Seu e-mail{user.user.email ? ` (${user.user.email})` : ""} ainda não foi verificado.
          Verifique sua caixa de entrada para confirmar e garantir o acesso a todos os recursos.
        </p>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dispensar aviso"
        className="flex-shrink-0 rounded-md p-1 text-amber-500 transition-colors hover:bg-amber-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
