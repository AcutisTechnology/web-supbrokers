'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  ChevronDown, 
  ArrowRight, 
  Star, 
  Users, 
  Building,
  Zap
} from 'lucide-react';

interface ModernHeaderProps {
  onOpenWhatsApp: () => void;
}

interface NavItem {
  label: string;
  href: string;
  description?: string;
  icon?: React.ReactNode;
}

interface DropdownMenuProps {
  items: NavItem[];
  isOpen: boolean;
  onClose: () => void;
}

function DropdownMenu({ items, isOpen, onClose }: DropdownMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 py-4 z-50"
          onMouseLeave={onClose}
        >
          {items.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="flex items-start space-x-3 px-6 py-3 hover:bg-gray-50 transition-colors duration-200"
            >
              {item.icon && (
                <div className="w-10 h-10 bg-[#9747FF]/10 rounded-xl flex items-center justify-center text-[#9747FF] mt-1">
                  {item.icon}
                </div>
              )}
              <div>
                <div className="font-semibold text-gray-900">{item.label}</div>
                {item.description && (
                  <div className="text-sm text-gray-500 mt-1">{item.description}</div>
                )}
              </div>
            </a>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MobileMenu({ isOpen, onClose, onOpenWhatsApp }: {
  isOpen: boolean;
  onClose: () => void;
  onOpenWhatsApp: () => void;
}) {
  const router = useRouter();

  const menuItems = [
    { label: 'Recursos', href: '#recursos' },
    { label: 'Dashboard', href: '#dashboard' },
    { label: 'Depoimentos', href: '#depoimentos' },
    { label: 'Contato', href: '#contato' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 lg:hidden"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          
          {/* Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <Image
                  src="/logo-extendida.svg"
                  alt="iMoobile logo"
                  width={120}
                  height={20}
                  className="h-6 w-auto"
                />
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation */}
              <div className="flex-1 py-6">
                <nav className="space-y-2 px-6">
                  {menuItems.map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      onClick={onClose}
                      className="block py-3 px-4 rounded-xl text-gray-700 hover:bg-[#9747FF]/5 hover:text-[#9747FF] transition-colors font-medium"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>

                {/* Trust Indicators */}
                <div className="mt-8 px-6">
                  <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Users className="h-4 w-4 text-[#9747FF]" />
                      <span>+1.500 corretores ativos</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>4.9/5 de satisfação</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Zap className="h-4 w-4 text-green-500" />
                      <span>Setup em 5 minutos</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="p-6 border-t border-gray-100 space-y-3">
                <button
                  onClick={() => {
                    router.push('/signup');
                    onClose();
                  }}
                  className="w-full bg-[#9747FF] text-white py-3 rounded-xl font-semibold hover:bg-[#9747FF]/90 transition-colors flex items-center justify-center"
                >
                  Começar Grátis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
                
                <button
                  onClick={() => {
                    onOpenWhatsApp();
                    onClose();
                  }}
                  className="w-full border border-[#9747FF] text-[#9747FF] py-3 rounded-xl font-semibold hover:bg-[#9747FF]/5 transition-colors"
                >
                  Falar com Especialista
                </button>
                
                <button
                  onClick={() => {
                    router.push('/login');
                    onClose();
                  }}
                  className="w-full text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Já tenho conta
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ModernHeader({ onOpenWhatsApp }: ModernHeaderProps) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const resourcesItems: NavItem[] = [
    {
      label: 'Gestão de Imóveis',
      href: '#recursos',
      description: 'Cadastre e gerencie seu portfólio',
      icon: <Building className="h-5 w-5" />
    },
    {
      label: 'Leads Qualificados',
      href: '#recursos',
      description: 'Receba clientes interessados',
      icon: <Users className="h-5 w-5" />
    },
    {
      label: 'Site Personalizado',
      href: '#recursos',
      description: 'Seu site profissional incluso',
      icon: <Zap className="h-5 w-5" />
    },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`
          fixed top-0 left-0 right-0 z-40 transition-all duration-300
          ${isScrolled 
            ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100' 
            : 'bg-transparent'
          }
        `}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Image
                src="/logo-extendida.svg"
                alt="iMoobile logo"
                width={155}
                height={27}
                className="h-8 w-auto"
                priority
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {/* Resources Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('resources')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center space-x-1 text-gray-700 hover:text-[#9747FF] transition-colors font-medium py-2">
                  <span>Recursos</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <DropdownMenu 
                  items={resourcesItems}
                  isOpen={activeDropdown === 'resources'}
                  onClose={() => setActiveDropdown(null)}
                />
              </div>

              <a href="#dashboard" className="text-gray-700 hover:text-[#9747FF] transition-colors font-medium">
                Dashboard
              </a>
              <a href="#depoimentos" className="text-gray-700 hover:text-[#9747FF] transition-colors font-medium">
                Depoimentos
              </a>
              <a href="#contato" className="text-gray-700 hover:text-[#9747FF] transition-colors font-medium">
                Contato
              </a>
            </nav>

            {/* Desktop CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <button
                onClick={() => router.push('/login')}
                className="text-gray-700 hover:text-[#9747FF] transition-colors font-medium px-4 py-2"
              >
                Entrar
              </button>
              
              <button
                onClick={onOpenWhatsApp}
                className="bg-white border border-[#9747FF] text-[#9747FF] px-5 py-2.5 rounded-xl hover:bg-[#9747FF]/5 transition-all duration-300 font-semibold"
              >
                Demo Grátis
              </button>
              
              <button
                onClick={() => router.push('/signup')}
                className="bg-[#9747FF] text-white px-6 py-2.5 rounded-xl hover:bg-[#9747FF]/90 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl flex items-center"
              >
                Começar Grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Trust Bar */}
        {!isScrolled && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden lg:block bg-[#9747FF]/5 border-t border-[#9747FF]/10"
          >
            <div className="container mx-auto px-4 py-2">
              <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>+1.500 corretores ativos</span>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-1">4.9/5 (324 avaliações)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-3 w-3 text-[#9747FF]" />
                  <span>Setup em 5 minutos</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenWhatsApp={onOpenWhatsApp}
      />
    </>
  );
}