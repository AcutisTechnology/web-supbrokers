'use client';

import {
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
  Sparkles,
  Youtube,
} from 'lucide-react';
import { useState } from 'react';
import { mockBrand } from '../data/mock';

const COLS = [
  {
    title: 'Navegação',
    links: ['Comprar Imóvel', 'Alugar Imóvel', 'Lançamentos', 'Investimentos'],
  },
  {
    title: 'Suporte',
    links: ['Privacidade', 'Termos de Uso', 'Mapa do Site', 'Contato'],
  },
];

export function PremiumFooter() {
  const [email, setEmail] = useState('');

  return (
    <footer className="bg-[#08040F] text-white pt-20">
      <div className="container mx-auto px-4 md:px-8">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-14 border-b border-white/5">
          {/* Brand */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span className="font-display text-xl tracking-wide">
                {mockBrand.name}
              </span>
            </div>
            <p className="text-sm text-white/55 leading-relaxed">
              Elevando o padrão imobiliário com exclusividade, tecnologia e
              transparência.
            </p>
            <div className="flex gap-2 pt-2">
              {[Instagram, Facebook, Linkedin, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-amber-300 hover:text-[#0F0820] text-white/70 flex items-center justify-center transition-all"
                  aria-label="social"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Cols */}
          {COLS.map(col => (
            <div key={col.title}>
              <h4 className="text-sm font-medium mb-5 text-white">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map(l => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-white/55 hover:text-amber-300 transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-medium mb-5 text-white">Newsletter</h4>
            <p className="text-sm text-white/55 mb-4 leading-relaxed">
              Receba lançamentos exclusivos e insights de mercado.
            </p>
            <form
              onSubmit={e => {
                e.preventDefault();
                setEmail('');
              }}
              className="relative"
            >
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Seu e-mail"
                className="w-full bg-white/5 border border-white/10 rounded-full pl-4 pr-12 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-amber-300/50 transition-colors"
              />
              <button
                type="submit"
                aria-label="Enviar"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-amber-300 text-[#0F0820] rounded-full flex items-center justify-center hover:bg-amber-200 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 space-y-2.5 text-xs text-white/55">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-300" />
                +55 (83) 99937-8382
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-300" />
                contato@luxuryestate.com.br
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-300 mt-0.5" />
                Av. Paulista, 1000 — São Paulo / SP
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                Seg–Sex 9h às 19h
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-white/40">
          <p>© {new Date().getFullYear()} {mockBrand.name}. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <span>CRECI 12345-J</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>CNPJ 13.345.678/0001-99</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
