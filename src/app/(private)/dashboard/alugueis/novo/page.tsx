"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { TopNav } from "@/features/dashboard/imoveis/top-nav";
import { useCreateAluguel } from '@/features/dashboard/alugueis/hooks/use-create-aluguel';
import { MaskedInput } from '@/components/ui/masked-input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { FileUpload } from '@/components/ui/file-upload';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { aluguelSchema, AluguelFormValues, aluguelDefaultValues } from '@/features/dashboard/alugueis/types/aluguel-form-schema';

const DOC_ACCEPT = 'image/*,application/pdf';

export default function NovaLocacaoPage() {
  const router = useRouter();
  const form = useForm<AluguelFormValues>({
    resolver: zodResolver(aluguelSchema),
    defaultValues: aluguelDefaultValues,
  });
  const mutation = useCreateAluguel();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(data: AluguelFormValues) {
    setError(null);
    const formData = new FormData();

    const numericFields = ['valor', 'renda', 'multa'] as const;
    const docFields = ['doc_rg', 'doc_cpf', 'doc_renda'] as const;

    Object.entries(data).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      if (numericFields.includes(key as typeof numericFields[number])) {
        formData.append(key, String(value));
      } else if (docFields.includes(key as typeof docFields[number])) {
        const arr = value as File[];
        if (arr.length > 0 && arr[0] instanceof File) {
          formData.append(key, arr[0]);
        }
      } else {
        formData.append(key, value as Blob | string);
      }
    });

    mutation.mutate(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['alugueis'] });
        setSuccess(true);
        toast({ title: 'Locação criada com sucesso!', description: 'A locação foi cadastrada.' });
        setTimeout(() => router.push('/dashboard/alugueis'), 1500);
      },
      onError: () => {
        setError('Erro ao criar locação');
        toast({ title: 'Erro ao criar locação', description: 'Ocorreu um erro. Tente novamente.', variant: 'destructive' });
      },
    });
  }

  return (
    <div className="flex-1">
      <main className="p-4 sm:p-6">
        <TopNav title_secondary="Gestão de aluguéis" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            {/* Dados do Imóvel */}
            <Card className="p-4 sm:p-8 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-[#9747ff]">Dados do Imóvel</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <FormField name="imovel" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imóvel</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nome ou código do imóvel" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="endereco" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço do imóvel</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Rua, número, bairro, cidade" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </Card>

            {/* Dados do Inquilino */}
            <Card className="p-4 sm:p-8 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-[#9747ff]">Dados do Inquilino</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <FormField name="inquilino" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nome do inquilino" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="cpf" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <MaskedInput {...field} mask="###.###.###-##" placeholder="000.000.000-00" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="rg" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>RG</FormLabel>
                    <FormControl>
                      <MaskedInput {...field} mask="##.###.###-#" placeholder="00.000.000-0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="email" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="email@exemplo.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="telefone" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone / WhatsApp</FormLabel>
                    <FormControl>
                      <MaskedInput {...field} mask="(##) #####-####" placeholder="(00) 00000-0000" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="profissao" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profissão</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Profissão do inquilino" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="renda" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Renda mensal</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        value={Number(field.value) || 0}
                        onChange={(_, values) => field.onChange(values?.floatValue ?? 0)}
                        placeholder="R$ 0,00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </Card>

            {/* Documentação */}
            <Card className="p-4 sm:p-8 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-[#9747ff]">Documentação</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField name="doc_rg" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>RG</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={field.value ?? []}
                        onChange={field.onChange}
                        multiple={false}
                        accept={DOC_ACCEPT}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="doc_cpf" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={field.value ?? []}
                        onChange={field.onChange}
                        multiple={false}
                        accept={DOC_ACCEPT}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="doc_renda" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comprovante de renda</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={field.value ?? []}
                        onChange={field.onChange}
                        multiple={false}
                        accept={DOC_ACCEPT}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </Card>

            {/* Dados do Contrato */}
            <Card className="p-4 sm:p-8 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-[#9747ff]">Dados do Contrato</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <FormField name="valor" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor do aluguel</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        value={Number(field.value) || 0}
                        onChange={(_, values) => field.onChange(values?.floatValue ?? 0)}
                        placeholder="R$ 0,00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="data_inicio" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de início</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="data_fim" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de término</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="garantia" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Garantia</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Fiador, Caução, Seguro-fiança" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="multa" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Multa rescisória</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        value={Number(field.value) || 0}
                        onChange={(_, values) => field.onChange(values?.floatValue ?? 0)}
                        placeholder="R$ 0,00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="reajuste" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reajuste anual (%)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        placeholder="Ex: 3,5"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </Card>

            {/* Observações */}
            <Card className="p-4 sm:p-8 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-[#9747ff]">Observações</h2>
              <FormField name="observacoes" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea {...field} placeholder="Informações adicionais sobre o contrato" rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </Card>

            {error && <div className="text-red-500 text-center text-sm">{error}</div>}

            <div className="flex justify-center sm:justify-end">
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full sm:w-40 h-12 text-lg bg-[#9747ff] hover:bg-[#7c2ae8] text-white border-none"
              >
                {mutation.isPending ? 'Salvando...' : success ? 'Salvo!' : 'Salvar'}
              </Button>
            </div>

          </form>
        </Form>
      </main>
    </div>
  );
}
