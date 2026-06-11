"use client";

import { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SignupFormData, StepSharedProps } from "../signup-wizard";
import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle, Loader2, Mail, RefreshCw } from "lucide-react";
import { api } from "@/shared/configs/api";
import { HTTPError } from "ky";

interface EmailVerificationStepProps extends StepSharedProps {
  form: UseFormReturn<SignupFormData>;
  onNext: () => void;
}

const RESEND_COOLDOWN = 60;

async function readError(error: unknown, fallback: string): Promise<{ message: string; retryIn?: number }> {
  if (error instanceof HTTPError) {
    try {
      const body = await error.response.json<{ message?: string; retry_in?: number }>();
      return { message: body?.message ?? fallback, retryIn: body?.retry_in };
    } catch {
      return { message: fallback };
    }
  }
  return { message: fallback };
}

export function EmailVerificationStep({
  form,
  onNext,
  emailVerified = false,
  onEmailVerifiedChange,
}: EmailVerificationStepProps) {
  const email = (form.getValues().email ?? "").trim();

  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  // Garante que o envio automático ocorre uma única vez por montagem/e-mail.
  const sentForEmail = useRef<string | null>(null);

  const sendCode = useCallback(async () => {
    if (!email) return;
    setSending(true);
    setError(null);
    setInfo(null);
    try {
      await api.post("email/verification/send", { json: { email } }).json();
      setInfo("Enviamos um código para o seu e-mail.");
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      const { message, retryIn } = await readError(err, "Não foi possível enviar o código. Tente novamente.");
      setError(message);
      if (retryIn) setCooldown(retryIn);
    } finally {
      setSending(false);
    }
  }, [email]);

  // Envio automático ao entrar no passo (apenas se ainda não verificado).
  useEffect(() => {
    if (emailVerified) return;
    if (!email) return;
    if (sentForEmail.current === email) return;
    sentForEmail.current = email;
    void sendCode();
  }, [email, emailVerified, sendCode]);

  // Contagem regressiva do cooldown de reenvio.
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const verifyCode = useCallback(async () => {
    const digits = code.replace(/\D/g, "");
    if (digits.length !== 6) {
      setError("Digite o código de 6 dígitos.");
      return;
    }
    setVerifying(true);
    setError(null);
    setInfo(null);
    try {
      await api.post("email/verification/verify", { json: { email, code: digits } }).json();
      onEmailVerifiedChange?.(true);
      setInfo("E-mail verificado com sucesso!");
    } catch (err) {
      const { message } = await readError(err, "Código inválido. Tente novamente.");
      setError(message);
      onEmailVerifiedChange?.(false);
    } finally {
      setVerifying(false);
    }
  }, [code, email, onEmailVerifiedChange]);

  // Verifica automaticamente ao completar 6 dígitos.
  useEffect(() => {
    const digits = code.replace(/\D/g, "");
    if (digits.length === 6 && !verifying && !emailVerified) {
      void verifyCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-2">
          <div className="bg-[#9747FF]/10 p-3 rounded-2xl">
            <Mail className="w-6 h-6 text-[#9747FF]" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-[#141414] font-display">
          Confirme seu e-mail
        </h2>
        <p className="text-[#989898] text-sm">
          Enviamos um código de 6 dígitos para{" "}
          <span className="font-medium text-[#141414]">{email || "seu e-mail"}</span>
        </p>
      </div>

      {emailVerified ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center gap-3 py-6"
        >
          <CheckCircle className="w-12 h-12 text-green-500" />
          <p className="text-green-600 font-medium">E-mail verificado!</p>
          <p className="text-[#989898] text-sm text-center">
            Tudo certo. Clique em &quot;Continuar&quot; para prosseguir.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="code" className="text-[#141414] text-sm font-medium">
              Código de verificação
            </label>
            <Input
              id="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                if (error) setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void verifyCode();
                }
              }}
              placeholder="______"
              className="h-14 text-center text-2xl font-semibold tracking-[0.5em] border-[#D8D8D8] focus:border-[#9747FF] focus:ring-[#9747FF]/20"
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            {!error && info && <p className="text-xs text-green-600">{info}</p>}
          </div>

          <Button
            type="button"
            onClick={() => void verifyCode()}
            disabled={verifying || code.replace(/\D/g, "").length !== 6}
            className="w-full h-12 bg-[#9747FF] hover:bg-[#9747FF]/90 text-white font-medium"
          >
            {verifying ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Verificando...
              </span>
            ) : (
              "Verificar código"
            )}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => void sendCode()}
              disabled={sending || cooldown > 0}
              className="inline-flex items-center gap-1.5 text-sm text-[#9747FF] hover:underline disabled:text-[#989898] disabled:no-underline disabled:cursor-not-allowed"
            >
              {sending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              {cooldown > 0
                ? `Reenviar código em ${cooldown}s`
                : sending
                ? "Enviando..."
                : "Reenviar código"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
