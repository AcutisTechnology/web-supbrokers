"use client";

import { Camera, ChevronLeft, FileSignature, Mail, MapPin, Pencil, Phone, User } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingState } from "@/components/ui/loading-state";
import { VisitStatusBadge } from "@/features/dashboard/visitas/components/status-badge";
import { TopNav } from "@/features/dashboard/visitas/components/top-nav";
import { useVisit } from "@/features/dashboard/visitas/services/visits-service";
import {
  INTEREST_TYPE_LABELS,
  PROPERTY_TYPE_LABELS,
  SOURCE_LABELS,
  formatVisitDate,
} from "@/features/dashboard/visitas/utils/visit-labels";

export default function VisitDetailPage() {
  const params = useParams<{ id: string }>();
  const visitId = Number(params.id);
  const { data: visit, isLoading, isError, error, refetch } = useVisit(
    Number.isFinite(visitId) ? visitId : null,
  );

  if (!Number.isFinite(visitId) || visitId <= 0) {
    return (
      <>
        <TopNav title_secondary="Visita" />
        <Card>
          <CardContent className="py-8 text-center text-[#777777]">
            Visita inválida.
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <TopNav title_secondary="Visita" />

      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <Link
          href="/dashboard/visitas"
          className="inline-flex items-center text-sm text-[#777777] hover:text-[#9747FF] transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar para a lista
        </Link>
        {visit ? (
          <div className="flex items-center gap-2">
            <VisitStatusBadge status={visit.status} />
            <Button asChild className="gap-2">
              <Link href={`/dashboard/visitas/${visit.id}/editar`}>
                <Pencil className="h-4 w-4" /> Editar
              </Link>
            </Button>
          </div>
        ) : null}
      </div>

      <LoadingState
        isLoading={isLoading}
        isError={isError}
        error={error as Error | null}
        onRetry={refetch}
      />

      {!isLoading && !isError && visit ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 border border-gray-100 shadow-sm rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Resumo da visita</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <InfoRow icon={<User className="h-4 w-4" />} label="Cliente">
                  {visit.visitor_name}
                </InfoRow>
                <InfoRow icon={<Phone className="h-4 w-4" />} label="Telefone">
                  {visit.visitor_phone}
                </InfoRow>
                <InfoRow icon={<Mail className="h-4 w-4" />} label="E-mail">
                  {visit.visitor_email || "—"}
                </InfoRow>
                <InfoRow icon={<User className="h-4 w-4" />} label="Corretor responsável">
                  {visit.user?.name ?? "—"}
                </InfoRow>
              </div>

              <hr className="border-gray-100" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <InfoRow icon={<MapPin className="h-4 w-4" />} label="Imóvel">
                  {visit.property_name || "—"}
                </InfoRow>
                <InfoRow icon={<MapPin className="h-4 w-4" />} label="Endereço">
                  {visit.property_address || "—"}
                </InfoRow>
                <InfoRow label="Tipo">
                  {visit.property_type ? PROPERTY_TYPE_LABELS[visit.property_type] : "—"}
                </InfoRow>
                <InfoRow label="Interesse">
                  {visit.interest_type ? INTEREST_TYPE_LABELS[visit.interest_type] : "—"}
                </InfoRow>
                <InfoRow label="Como conheceu">
                  {visit.source ? SOURCE_LABELS[visit.source] : "—"}
                </InfoRow>
                <InfoRow label="Data da visita">{formatVisitDate(visit.visited_at)}</InfoRow>
              </div>

              {visit.customer_notes ? (
                <NotesBlock title="Observações do cliente">{visit.customer_notes}</NotesBlock>
              ) : null}

              {visit.broker_notes ? (
                <NotesBlock
                  title={`Observações do corretor${visit.broker_notes_private ? " (privadas)" : ""}`}
                >
                  {visit.broker_notes}
                </NotesBlock>
              ) : null}

              {visit.has_partner_broker ? (
                <div className="rounded-xl bg-purple-50/50 border border-purple-100 p-3">
                  <p className="text-xs font-medium text-purple-700 uppercase tracking-wider mb-2">
                    Corretor parceiro
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <InfoRow label="Nome">{visit.partner_broker_name || "—"}</InfoRow>
                    <InfoRow label="CRECI">{visit.partner_broker_creci || "—"}</InfoRow>
                    <InfoRow label="Telefone">{visit.partner_broker_phone || "—"}</InfoRow>
                    <InfoRow label="Imobiliária">{visit.partner_broker_company || "—"}</InfoRow>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="border border-gray-100 shadow-sm rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileSignature className="h-4 w-4" /> Assinatura
                </CardTitle>
              </CardHeader>
              <CardContent>
                {visit.signature_url ? (
                  <div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={visit.signature_url}
                      alt="Assinatura"
                      className="w-full max-h-40 rounded-lg border border-gray-200 bg-white object-contain"
                    />
                    {visit.signed_at ? (
                      <p className="mt-2 text-xs text-[#777777]">
                        Assinado em {formatVisitDate(visit.signed_at)}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <p className="text-sm text-[#777777]">Sem assinatura registrada.</p>
                )}
              </CardContent>
            </Card>

            <Card className="border border-gray-100 shadow-sm rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Camera className="h-4 w-4" /> Fotos ({visit.files?.length ?? 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {visit.files && visit.files.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {visit.files.map((file) => (
                      <a
                        key={file.id}
                        href={file.url ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative block aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
                      >
                        {file.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={file.url}
                            alt={file.name ?? "Foto da visita"}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        ) : null}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#777777]">Nenhuma foto anexada.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </>
  );
}

function InfoRow({
  label,
  children,
  icon,
}: {
  label: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <p className="flex items-center gap-1 text-xs uppercase tracking-wide text-gray-400">
        {icon}
        {label}
      </p>
      <p className="mt-0.5 text-[#141414]">{children}</p>
    </div>
  );
}

function NotesBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-1">{title}</p>
      <p className="whitespace-pre-wrap text-sm text-[#141414] bg-gray-50 rounded-lg p-3">{children}</p>
    </div>
  );
}
