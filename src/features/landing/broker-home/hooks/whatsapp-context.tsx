'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import {
  buildWhatsappUrl,
  resolveWhatsappMessage,
  type WhatsappTemplateKey,
} from './use-broker-home-data';

interface WhatsappTemplate {
  key: string;
  message: string;
}

interface WhatsappContextValue {
  number: string;
  templates: WhatsappTemplate[];
}

const Ctx = createContext<WhatsappContextValue | null>(null);

interface WhatsappProviderProps {
  number: string;
  templates: WhatsappTemplate[];
  children: ReactNode;
}

export function WhatsappProvider({ number, templates, children }: WhatsappProviderProps) {
  const value = useMemo(() => ({ number, templates }), [number, templates]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/**
 * Hook que retorna helpers prontos para abrir WhatsApp com a mensagem do template.
 * Componentes consomem assim:
 *
 *   const { url, message } = useWhatsapp('interest_property', { property: { title } });
 *   window.open(url, '_blank');
 */
export function useWhatsapp(
  key: WhatsappTemplateKey,
  vars: Record<string, Record<string, string | number | null | undefined>> = {}
) {
  const ctx = useContext(Ctx);
  const number = ctx?.number ?? '';
  const templates = ctx?.templates ?? [];

  const message = resolveWhatsappMessage(templates, key, vars);
  const url = buildWhatsappUrl(number, message);

  return { url, message, number };
}

export function useWhatsappContext() {
  return useContext(Ctx);
}
