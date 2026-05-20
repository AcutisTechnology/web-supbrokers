"use client";

import Image from "next/image";
import { Facebook, Globe, Instagram, Linkedin, Mail, MapPin, MessageCircle, Phone, Youtube } from "lucide-react";
import type { PublicSite, PublicSocialLink } from "@/features/landing/services/broker-service";

const PLATFORM_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  youtube: Youtube,
  tiktok: Globe,
  whatsapp: MessageCircle,
  twitter: Globe,
  custom: Globe,
};

interface BrokerFooterProps {
  site: PublicSite | null | undefined;
}

export function BrokerFooter({ site }: BrokerFooterProps) {
  const footer = site?.footer ?? null;
  const showSocial = footer?.show_social_links !== false;
  const socialLinks: PublicSocialLink[] = showSocial ? site?.social_links ?? [] : [];

  const hasFooterContent =
    !!footer &&
    (footer.company_name ||
      footer.email ||
      footer.phone ||
      footer.whatsapp ||
      footer.address ||
      footer.city ||
      footer.creci ||
      footer.footer_text);

  const hasSocial = socialLinks.length > 0;

  if (!hasFooterContent && !hasSocial) {
    return (
      <footer className="py-8 text-center text-sm text-[#777777]">
        <div className="flex flex-row items-center gap-2 justify-center">
          <p>Esse site foi feito na</p>
          <Image src="/logo-extendida.svg" width={81} height={12} alt="logo pequena" />
        </div>
        <p className="mb-4">Copyright © iMoobile. Todos os direitos reservados</p>
      </footer>
    );
  }

  const addressLine = [
    [footer?.address, footer?.address_number].filter(Boolean).join(", "),
    footer?.district,
    [footer?.city, footer?.state].filter(Boolean).join("/"),
    footer?.zipcode,
  ]
    .filter((part) => part && part.trim() !== "")
    .join(" - ");

  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-3">
          {footer?.company_name && (
            <h3 className="text-lg font-semibold">{footer.company_name}</h3>
          )}
          {footer?.creci && <p className="text-sm text-gray-300">{footer.creci}</p>}
          {footer?.footer_text && (
            <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">{footer.footer_text}</p>
          )}
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold">Contato</h4>
          {footer?.email && (
            <div className="flex items-start gap-2 text-sm text-gray-300">
              <Mail className="h-4 w-4 mt-0.5 shrink-0" />
              <a href={`mailto:${footer.email}`} className="hover:text-white break-all">{footer.email}</a>
            </div>
          )}
          {footer?.phone && (
            <div className="flex items-start gap-2 text-sm text-gray-300">
              <Phone className="h-4 w-4 mt-0.5 shrink-0" />
              <a href={`tel:${footer.phone.replace(/\D/g, "")}`} className="hover:text-white">{footer.phone}</a>
            </div>
          )}
          {footer?.whatsapp && (
            <div className="flex items-start gap-2 text-sm text-gray-300">
              <MessageCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <a
                href={`https://wa.me/55${footer.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                WhatsApp: {footer.whatsapp}
              </a>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {addressLine && (
            <>
              <h4 className="font-semibold">Endereço</h4>
              <div className="flex items-start gap-2 text-sm text-gray-300">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{addressLine}</span>
              </div>
            </>
          )}

          {hasSocial && (
            <div className="pt-2">
              <h4 className="font-semibold mb-3">Redes sociais</h4>
              <div className="flex gap-2 flex-wrap">
                {socialLinks.map((link) => {
                  const Icon = PLATFORM_ICON[link.platform] ?? Globe;
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={link.platform}
                      className="w-9 h-9 bg-gray-800 rounded-xl flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#9747FF] transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4 text-center text-xs text-gray-400 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <span>
            © {new Date().getFullYear()} {footer?.company_name || "iMoobile"}. Todos os direitos reservados.
          </span>
          <span className="flex items-center justify-center gap-2">
            Feito na
            <Image src="/logo-extendida.svg" width={70} height={10} alt="iMoobile" className="inline-block" />
          </span>
        </div>
      </div>
    </footer>
  );
}
