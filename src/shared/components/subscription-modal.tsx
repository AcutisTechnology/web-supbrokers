import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { X, Sparkles } from "lucide-react";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleViewPlans = () => {
    // Fecha o modal e redireciona
    onClose();
    router.push('/dashboard/planos?from=no_subscription');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative animate-in fade-in-0 zoom-in-95">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Desbloqueie Todo o Potencial
          </h2>
          <p className="text-gray-600 mb-6">
            Para aproveitar todos os recursos e aumentar suas vendas, escolha o plano ideal para o seu negócio.
          </p>

          <div className="space-y-3">
            <Button 
              onClick={handleViewPlans}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Ver planos disponíveis
            </Button>
            <Button 
              variant="outline"
              onClick={onClose}
              className="w-full"
            >
              Voltar mais tarde
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 