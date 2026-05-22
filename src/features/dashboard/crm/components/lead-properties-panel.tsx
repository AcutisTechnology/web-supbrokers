"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  LeadProperty,
  useAttachLeadProperty,
  useDetachLeadProperty,
  useLeadProperties,
} from "@/features/dashboard/crm/services/crm-service";
import { useProperties } from "@/features/dashboard/imoveis/services/property-service";
import { Home, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

const INTEREST_LABELS: Record<string, string> = {
  compra: "Compra",
  aluguel: "Aluguel",
  permuta: "Permuta",
};

const formatCurrency = (value: string | null | undefined) => {
  const numeric = value ? Number(value) : 0;
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    Number.isFinite(numeric) ? numeric : 0,
  );
};

export function LeadPropertiesPanel({ leadId }: { leadId: number }) {
  const { data: properties, isLoading } = useLeadProperties(leadId);
  const { data: allProperties } = useProperties(1);
  const attach = useAttachLeadProperty();
  const detach = useDetachLeadProperty();

  const [propertyId, setPropertyId] = useState<string>("");
  const [interestType, setInterestType] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const availableProperties = useMemo(() => allProperties?.data ?? [], [allProperties]);

  const onAttach = async () => {
    if (!propertyId) return;
    await attach.mutateAsync({
      leadId,
      property_id: Number(propertyId),
      interest_type: interestType || undefined,
      notes: notes || undefined,
    });
    setPropertyId("");
    setInterestType("");
    setNotes("");
  };

  return (
    <div className="space-y-6">
      <Card className="border border-gray-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Vincular imóvel ao lead</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Imóvel</Label>
              <Select value={propertyId} onValueChange={setPropertyId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um imóvel" />
                </SelectTrigger>
                <SelectContent>
                  {availableProperties.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.code ? `${p.code} — ` : ""}
                      {p.title}
                    </SelectItem>
                  ))}
                  {availableProperties.length === 0 && (
                    <div className="px-3 py-2 text-sm text-[#777777]">Nenhum imóvel disponível.</div>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Interesse</Label>
              <Select value={interestType} onValueChange={setInterestType}>
                <SelectTrigger>
                  <SelectValue placeholder="(opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compra">Compra</SelectItem>
                  <SelectItem value="aluguel">Aluguel</SelectItem>
                  <SelectItem value="permuta">Permuta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs">Anotações</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Notas internas (opcional)" />
          </div>
          <div className="flex justify-end">
            <Button onClick={onAttach} disabled={!propertyId || attach.isPending}>
              Vincular imóvel
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Imóveis vinculados ({properties?.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
            </div>
          ) : (properties?.length ?? 0) === 0 ? (
            <EmptyState
              icon={<Home className="h-6 w-6 text-[#9747FF]" />}
              title="Nenhum imóvel vinculado"
              description="Selecione um imóvel acima para vincular este lead ao seu interesse."
            />
          ) : (
            <div className="space-y-3">
              <AnimatePresence initial={false} mode="popLayout">
              {(properties ?? []).map((p: LeadProperty) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.16 }}
                  className="flex items-start justify-between gap-3 border rounded-lg p-3"
                >
                  <div className="flex items-start gap-3">
                    <Home className="h-5 w-5 text-[#9747FF] mt-1" />
                    <div>
                      <Link
                        href={`/dashboard/imoveis/${p.id}`}
                        className="font-medium text-[#141414] hover:underline"
                      >
                        {p.code ? `${p.code} — ` : ""}
                        {p.title ?? "Imóvel"}
                      </Link>
                      <div className="text-xs text-[#777777]">
                        {[p.street, p.neighborhood].filter(Boolean).join(", ")}
                      </div>
                      <div className="text-xs text-[#777777] mt-1">
                        {formatCurrency(p.value)}
                        {p.pivot?.interest_type && (
                          <span className="ml-2">· {INTEREST_LABELS[p.pivot.interest_type] ?? p.pivot.interest_type}</span>
                        )}
                      </div>
                      {p.pivot?.notes && (
                        <div className="text-xs text-[#444444] mt-1 italic">&ldquo;{p.pivot.notes}&rdquo;</div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => detach.mutate({ leadId, propertyId: p.id })}
                    disabled={detach.isPending}
                  >
                    <Trash2 className="h-4 w-4 text-rose-500" />
                  </Button>
                </motion.div>
              ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
