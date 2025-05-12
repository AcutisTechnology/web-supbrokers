'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ColorPicker } from '@/features/dashboard/page-settings/components/color-picker';
import { ImageUpload } from '@/features/dashboard/page-settings/components/image-upload';
import { toast } from 'sonner';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Save } from 'lucide-react';

const pageSettingsSchema = z.object({
  primary_color: z.string().min(1, 'A cor primária é obrigatória'),
  title: z.string().min(1, 'O título é obrigatório'),
  subtitle: z.string().min(1, 'O subtítulo é obrigatório'),
  brand_image: z.string().min(1, 'A imagem da marca é obrigatória'),
});

type PageSettingsFormData = z.infer<typeof pageSettingsSchema>;

interface PageSettingsFormProps {
  initialData?: PageSettingsFormData;
  onSubmit: (data: PageSettingsFormData) => Promise<void>;
}

export function PageSettingsForm({ initialData, onSubmit }: PageSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PageSettingsFormData>({
    resolver: zodResolver(pageSettingsSchema),
    defaultValues: initialData || {
      primary_color: '#9747FF',
      title: '',
      subtitle: '',
      brand_image: '',
    },
  });

  const handleFormSubmit = async (data: PageSettingsFormData) => {
    try {
      setIsLoading(true);
      await onSubmit(data);
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="space-y-6">
          {/* Cor Primária */}
          <FormField
            control={form.control}
            name="primary_color"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Cor Primária</FormLabel>
                <FormControl>
                  <ColorPicker
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription className="text-xs text-gray-500">
                  Esta cor será usada como tema principal da sua página.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Logo da Marca */}
          <FormField
            control={form.control}
            name="brand_image"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Logo da Marca</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription className="text-xs text-gray-500">
                  Recomendamos uma imagem de pelo menos 150x50 pixels.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Título da Página */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Título da Página</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ex: Encontre o imóvel perfeito para você"
                    className="border-gray-300 focus:border-[#9747FF] focus:ring-[#9747FF]"
                  />
                </FormControl>
                <FormDescription className="text-xs text-gray-500">
                  Este título será exibido em destaque na sua página.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Subtítulo da Página */}
          <FormField
            control={form.control}
            name="subtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Subtítulo da Página</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ex: Confira os melhores imóveis disponíveis"
                    className="border-gray-300 focus:border-[#9747FF] focus:ring-[#9747FF]"
                  />
                </FormControl>
                <FormDescription className="text-xs text-gray-500">
                  Uma breve descrição que aparecerá abaixo do título.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-[#9747FF] hover:bg-[#9747FF]/90" 
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Salvando...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Salvar Configurações
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
} 