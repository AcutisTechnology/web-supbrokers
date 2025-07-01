"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { TopNav } from "@/features/dashboard/imoveis/top-nav";
import { api } from '@/shared/configs/api';
import { useCreateAluguel } from '@/features/dashboard/alugueis/hooks/use-create-aluguel';
import { MaskedInput } from '@/components/ui/masked-input';
import { CurrencyInput } from '@/components/ui/currency-input';
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
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === 'valor') {
          formData.append(key, String(value));
        } else {
          formData.append(key, value as Blob | string);
        }
      }
    });
    mutation.mutate(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['alugueis'] });
        setSuccess(true);
        toast({ title: 'Locação criada com sucesso!', description: 'A locação foi cadastrada.', });
        setTimeout(() => router.push('/dashboard/alugueis'), 1500);
      },
      onError: () => {
        setError('Erro ao criar locação');
        toast({ title: 'Erro ao criar locação', description: 'Ocorreu um erro ao criar a locação. Tente novamente.', variant: 'destructive', });
      },
    });
  }

  return (
    <div className="flex-1">
      <main className="p-4 sm:p-6">
          <TopNav title_secondary="Gestão de aluguéis" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card className="p-4 sm:p-8 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-[#9747ff]">Dados do Imóvel</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <FormField name="imovel" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imóvel</FormLabel>
                    <FormControl>
                      <Input {...field} required placeholder="Imóvel" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="endereco" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço do imóvel</FormLabel>
                    <FormControl>
                      <Input {...field} required placeholder="Endereço" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </Card>
            <Card className="p-4 sm:p-8 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-[#9747ff]">Dados do Inquilino</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <FormField name="inquilino" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do inquilino</FormLabel>
                    <FormControl>
                      <Input {...field} required placeholder="Nome do inquilino" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="cpf" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF do inquilino</FormLabel>
                    <FormControl>
                      <MaskedInput {...field} mask="###.###.###-##" required placeholder="CPF" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="rg" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>RG do inquilino</FormLabel>
                    <FormControl>
                      <MaskedInput {...field} mask="##.###.###-#" required placeholder="RG" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="email" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail do inquilino</FormLabel>
                    <FormControl>
                      <Input {...field} required placeholder="E-mail" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="telefone" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone do inquilino</FormLabel>
                    <FormControl>
                      <MaskedInput {...field} mask="(##) #####-####" required placeholder="Telefone" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="profissao" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profissão do inquilino</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Profissão" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="renda" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Renda mensal do inquilino</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Renda mensal" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </Card>
            <Card className="p-4 sm:p-8 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-[#9747ff]">Documentação</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <FormField name="doc_rg" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>RG (upload)</FormLabel>
                    <FormControl>
                      <input type="file" onChange={e => field.onChange(e.target.files?.[0] || null)} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="doc_cpf" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF (upload)</FormLabel>
                    <FormControl>
                      <input type="file" onChange={e => field.onChange(e.target.files?.[0] || null)} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="doc_renda" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comprovante de renda (upload)</FormLabel>
                    <FormControl>
                      <input type="file" onChange={e => field.onChange(e.target.files?.[0] || null)} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </Card>
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
                        required
                        placeholder="Valor do aluguel"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="data_inicio" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de início do contrato</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" required placeholder="Data de início" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="data_fim" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de término do contrato</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" required placeholder="Data de término" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="garantia" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Garantia</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Garantia" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="multa" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Multa rescisória</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Multa rescisória" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="reajuste" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reajuste anual (%)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Reajuste anual (%)" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </Card>
            <Card className="p-4 sm:p-8 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-[#9747ff]">Observações</h2>
              <FormField name="observacoes" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações adicionais</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Observações adicionais" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </Card>
            <div className="flex justify-center sm:justify-end">
              <Button type="submit" disabled={mutation.isPending} className="w-full sm:w-40 h-12 text-lg bg-[#9747ff] hover:bg-[#7c2ae8] text-white border-none">
                {mutation.isPending ? 'Salvando...' : success ? 'Salvo!' : 'Salvar'}
              </Button>
            </div>
            {error && <div className="text-red-500 text-center mb-4 text-sm sm:text-base">{error}</div>}
          </form>
        </Form>
      </main>
    </div>
  );
} 