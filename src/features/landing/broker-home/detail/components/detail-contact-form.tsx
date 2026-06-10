'use client';

import { api } from '@/shared/configs/api';
import { useMutation } from '@tanstack/react-query';
import { Check, Loader2, MessageCircle, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useWhatsapp } from '../../hooks/whatsapp-context';

interface DetailContactFormProps {
  propertyTitle: string;
  propertySlug: string;
  whatsappNumber: string;
  variant?: 'sidebar' | 'block';
}

interface InterestFormData {
  name: string;
  email: string;
  phone: string;
  message?: string;
}

interface InterestPayload extends InterestFormData {
  interested_property_slug: string;
}

export function DetailContactForm({
  propertyTitle,
  propertySlug,
  variant = 'sidebar',
}: DetailContactFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<InterestFormData>({
    mode: 'onChange',
    defaultValues: { name: '', email: '', phone: '', message: '' },
  });

  const { url: whatsappUrl } = useWhatsapp('interest_property', {
    property: { title: propertyTitle },
  });

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async (data: InterestPayload) =>
      api.post('customers', { json: data }).json(),
    onSuccess: () => {
      toast.success('Recebemos seu contato! O corretor falará com você em instantes.');
      reset();
      window.open(whatsappUrl, '_blank');
    },
    onError: () => {
      toast.error('Não conseguimos enviar agora. Tente novamente em instantes.');
    },
  });

  const onSubmit = (data: InterestFormData) => {
    mutate({ ...data, interested_property_slug: propertySlug });
  };

  const isBlock = variant === 'block';

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`space-y-3 ${isBlock ? 'max-w-2xl mx-auto' : ''}`}
    >
      <Field error={errors.name?.message}>
        <input
          {...register('name', { required: 'Informe seu nome' })}
          placeholder="Nome completo"
          aria-invalid={!!errors.name}
          className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 text-sm text-[#0F0820] placeholder:text-[#0F0820]/40 outline-none focus:border-[#9747FF]/50 aria-[invalid=true]:border-rose-400"
        />
      </Field>

      <div className={`grid gap-3 ${isBlock ? 'md:grid-cols-2' : ''}`}>
        <Field error={errors.email?.message}>
          <input
            type="email"
            {...register('email', {
              required: 'Informe seu e-mail',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'E-mail inválido',
              },
            })}
            placeholder="E-mail"
            aria-invalid={!!errors.email}
            className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 text-sm text-[#0F0820] placeholder:text-[#0F0820]/40 outline-none focus:border-[#9747FF]/50 aria-[invalid=true]:border-rose-400"
          />
        </Field>

        <Field error={errors.phone?.message}>
          <input
            type="tel"
            inputMode="numeric"
            {...register('phone', {
              required: 'Informe seu telefone',
              pattern: {
                value: /^\D*\d{2}\D*\d{4,5}\D*\d{4}\D*$/,
                message: 'Telefone inválido',
              },
            })}
            placeholder="Telefone com DDD"
            aria-invalid={!!errors.phone}
            className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 text-sm text-[#0F0820] placeholder:text-[#0F0820]/40 outline-none focus:border-[#9747FF]/50 aria-[invalid=true]:border-rose-400"
          />
        </Field>
      </div>

      {isBlock && (
        <textarea
          {...register('message')}
          placeholder={`Olá! Tenho interesse no imóvel "${propertyTitle}".`}
          rows={3}
          className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 text-sm text-[#0F0820] placeholder:text-[#0F0820]/40 outline-none focus:border-[#9747FF]/50 resize-none"
        />
      )}

      <button
        type="submit"
        disabled={isPending || !isValid}
        className="w-full inline-flex items-center justify-center gap-2 bg-[#0F0820] text-white font-medium text-sm px-5 py-3 rounded-full hover:bg-[#1f1240] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Enviando…
          </>
        ) : isSuccess ? (
          <>
            <Check className="w-4 h-4" />
            Enviado
          </>
        ) : (
          <>
            <User className="w-4 h-4" />
            Solicitar atendimento
          </>
        )}
      </button>

      <p className="text-[10px] text-center text-[#0F0820]/40 leading-relaxed">
        Ao enviar, você concorda em ser contatado por nossa equipe. Seus dados
        ficam protegidos conforme a LGPD.
      </p>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 text-white font-medium text-sm px-5 py-3 rounded-full hover:bg-emerald-400 transition-colors"
      >
        <MessageCircle className="w-4 h-4" />
        Prefiro falar no WhatsApp
      </a>
    </form>
  );
}

function Field({
  children,
  error,
}: {
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div>
      {children}
      {error && (
        <p className="text-xs text-rose-500 mt-1 px-1">{error}</p>
      )}
    </div>
  );
}
