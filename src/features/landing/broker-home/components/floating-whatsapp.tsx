'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useWhatsapp } from '../hooks/whatsapp-context';

export function FloatingWhatsapp() {
  const [visible, setVisible] = useState(false);
  const { url } = useWhatsapp('default');

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () => window.open(url, '_blank');

  return (
    <motion.button
      onClick={handleClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: visible ? 1 : 0, opacity: visible ? 1 : 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      aria-label="Abrir WhatsApp"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(16,185,129,0.5)] hover:bg-emerald-400 transition-colors"
    >
      <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-30" />
      <MessageCircle className="relative w-6 h-6" />
    </motion.button>
  );
}
