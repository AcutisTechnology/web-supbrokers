'use client';

import { useState } from 'react';
import { Check, Facebook, Linkedin, Link2, MessageCircle } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  className?: string;
  variant?: 'row' | 'stack';
}

export function ShareButtons({ title, className = '', variant = 'row' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const url = typeof window !== 'undefined' ? window.location.href : '';
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      key: 'facebook',
      label: 'Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  };

  const isStack = variant === 'stack';

  return (
    <div
      className={`flex ${isStack ? 'flex-col items-stretch' : 'items-center'} gap-2 ${className}`}
    >
      {links.map(l => {
        const Icon = l.icon;
        return (
          <a
            key={l.key}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`Compartilhar no ${l.label}`}
            className={`inline-flex items-center gap-2 rounded-full border border-[#0F0820]/10 text-[#555] hover:border-[#9747FF] hover:text-[#9747FF] transition-colors ${
              isStack ? 'px-4 py-2.5 justify-center text-sm' : 'w-10 h-10 justify-center'
            }`}
          >
            <Icon className="w-4 h-4" />
            {isStack && <span>{l.label}</span>}
          </a>
        );
      })}
      <button
        type="button"
        onClick={copy}
        aria-label="Copiar link"
        className={`inline-flex items-center gap-2 rounded-full border transition-colors ${
          copied
            ? 'border-green-500 text-green-600'
            : 'border-[#0F0820]/10 text-[#555] hover:border-[#9747FF] hover:text-[#9747FF]'
        } ${isStack ? 'px-4 py-2.5 justify-center text-sm' : 'w-10 h-10 justify-center'}`}
      >
        {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
        {isStack && <span>{copied ? 'Link copiado!' : 'Copiar link'}</span>}
      </button>
    </div>
  );
}
