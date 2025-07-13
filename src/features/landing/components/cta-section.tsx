'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Shield, 
  Zap, 
  Star,
  Gift,
  Users
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface CTASectionProps {
  onOpenWhatsApp: () => void;
}

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-center space-x-2 text-white">
      <Clock className="h-5 w-5" />
      <span className="font-medium">Oferta expira em:</span>
      <div className="flex space-x-1">
        <div className="bg-white/20 rounded px-2 py-1 font-mono font-bold">
          {String(timeLeft.hours).padStart(2, '0')}
        </div>
        <span>:</span>
        <div className="bg-white/20 rounded px-2 py-1 font-mono font-bold">
          {String(timeLeft.minutes).padStart(2, '0')}
        </div>
        <span>:</span>
        <div className="bg-white/20 rounded px-2 py-1 font-mono font-bold">
          {String(timeLeft.seconds).padStart(2, '0')}
        </div>
      </div>
    </div>
  );
}

export function CTASection({ onOpenWhatsApp }: CTASectionProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const benefits = [
    'Setup completo em 5 minutos',
    'Suporte dedicado 24/7',
    'Treinamento personalizado incluído',
    'Garantia de satisfação 30 dias',
    'Sem taxa de setup ou cancelamento'
  ];

  const urgencyFeatures = [
    { icon: <Gift className="h-5 w-5" />, text: '3 meses grátis' },
    { icon: <Zap className="h-5 w-5" />, text: 'Setup prioritário' },
    { icon: <Users className="h-5 w-5" />, text: 'Treinamento VIP' },
  ];

  return (
    <section id="contato" className="relative py-20 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#9747FF] via-purple-600 to-indigo-700"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Urgency Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center bg-red-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
              <Gift className="h-6 w-6 mr-2" />
              OFERTA LIMITADA - Apenas hoje!
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Pronto para
              <span className="block text-yellow-300">transformar seu negócio?</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
              Junte-se a mais de <span className="font-bold text-yellow-300">1.500 corretores</span> que já estão 
              vendendo 40% mais com nossa plataforma completa.
            </p>

            {/* Special Offer Box */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                {urgencyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center justify-center space-x-2 text-white">
                    <div className="text-yellow-300">{feature.icon}</div>
                    <span className="font-semibold">{feature.text}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-white/20 pt-6">
                <CountdownTimer />
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
          >
            <button
              onClick={() => router.push('/signup')}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group relative bg-white text-[#9747FF] px-10 py-5 rounded-2xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2"
            >
              <span className="relative z-10 flex items-center">
                Começar Agora - 3 Meses Grátis
                <ArrowRight className={`ml-3 h-6 w-6 transition-transform duration-300 ${isHovered ? 'translate-x-2' : ''}`} />
              </span>
              
              {/* Button Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-300 to-orange-300 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
            
            <button
              onClick={onOpenWhatsApp}
              className="group bg-transparent border-2 border-white text-white px-10 py-5 rounded-2xl hover:bg-white/10 transition-all duration-300 flex items-center justify-center font-bold text-xl backdrop-blur-sm"
            >
              Falar com Especialista
              <div className="ml-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </button>
          </motion.div>

          {/* Benefits List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12"
          >
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3 text-white/90">
                <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                <span className="font-medium">{benefit}</span>
              </div>
            ))}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center items-center gap-8 text-white/80"
          >
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-green-400" />
              <span className="font-medium">SSL Seguro</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="font-medium">4.9/5 (324 avaliações)</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-blue-400" />
              <span className="font-medium">+1.500 clientes ativos</span>
            </div>
          </motion.div>

          {/* Risk Reversal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-12"
          >
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full border border-white/20">
              <Shield className="h-5 w-5 mr-2 text-green-400" />
              <span className="font-medium">
                Garantia de 30 dias - Teste sem riscos
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 right-20 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse delay-500"></div>
    </section>
  );
}