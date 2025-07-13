'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ModernHeader } from './modern-header';
import { HeroSection } from './hero-section';
import { StatsSection } from './stats-section';
import { FeaturesSection } from './features-section';
import { TestimonialsSection } from './testimonials-section';
import { CTASection } from './cta-section';
import { ModernFooter } from './modern-footer';

// Componente de Loading para melhor UX
function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-white z-50 flex items-center justify-center"
    >
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#9747FF]/20 border-t-[#9747FF] rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Carregando...</p>
      </div>
    </motion.div>
  );
}

// Componente de Scroll to Top
function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        scale: isVisible ? 1 : 0 
      }}
      transition={{ duration: 0.3 }}
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-40 w-12 h-12 bg-[#9747FF] text-white rounded-full shadow-lg hover:bg-[#9747FF]/90 transition-all duration-300 flex items-center justify-center hover:shadow-xl"
      aria-label="Voltar ao topo"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </motion.button>
  );
}

// Componente de Analytics e Tracking
function AnalyticsTracker() {
  useEffect(() => {
    // Tracking de scroll depth
    const trackScrollDepth = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      // Enviar eventos para analytics em marcos específicos
      if (scrollPercent === 25 || scrollPercent === 50 || scrollPercent === 75 || scrollPercent === 100) {
        // Aqui você pode integrar com Google Analytics, Mixpanel, etc.
        console.log(`Scroll depth: ${scrollPercent}%`);
      }
    };

    // Tracking de tempo na página
    const startTime = Date.now();
    const trackTimeOnPage = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      console.log(`Time on page: ${timeSpent} seconds`);
    };

    window.addEventListener('scroll', trackScrollDepth);
    window.addEventListener('beforeunload', trackTimeOnPage);

    return () => {
      window.removeEventListener('scroll', trackScrollDepth);
      window.removeEventListener('beforeunload', trackTimeOnPage);
    };
  }, []);

  return null;
}

export function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento inicial
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Função para abrir WhatsApp
  const handleOpenWhatsApp = () => {
    const phoneNumber = '5583999378382'; // Substitua pelo número real
    const message = encodeURIComponent(
      'Olá! Gostaria de conhecer melhor a plataforma iMoobile e agendar uma demonstração gratuita.'
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    // Tracking do evento
    console.log('WhatsApp CTA clicked');
    
    window.open(whatsappUrl, '_blank');
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Analytics Tracker */}
      <AnalyticsTracker />
      
      {/* Header */}
      <ModernHeader onOpenWhatsApp={handleOpenWhatsApp} />
      
      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section id="hero" className="pt-20">
          <HeroSection onOpenWhatsApp={handleOpenWhatsApp} />
        </section>
        
        {/* Stats Section */}
        <section id="estatisticas" className="py-20 bg-gray-50">
          <StatsSection />
        </section>
        
        {/* Features Section */}
        <section id="recursos" className="py-20">
          <FeaturesSection />
        </section>
        
        {/* Testimonials Section */}
        <section id="depoimentos" className="py-20 bg-gray-50">
          <TestimonialsSection />
        </section>
        
        {/* Final CTA Section */}
        <section id="cta" className="py-20">
          <CTASection onOpenWhatsApp={handleOpenWhatsApp} />
        </section>
      </main>
      
      {/* Footer */}
      <ModernFooter />
      
      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}