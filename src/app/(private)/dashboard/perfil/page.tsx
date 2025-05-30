"use client";

import { useState, useEffect } from "react";
import { useProfile, useUpdateProfile } from "@/features/dashboard/profile/services/profile-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingState } from "@/components/ui/loading-state";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, Lock, Save, Edit, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Schema de validação para o formulário
const profileFormSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres").nullable().optional(),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres").optional(),
  password_confirmation: z.string().optional(),
}).refine(data => {
  if (data.password && !data.password_confirmation) {
    return false;
  }
  if (!data.password && data.password_confirmation) {
    return false;
  }
  if (data.password && data.password_confirmation && data.password !== data.password_confirmation) {
    return false;
  }
  return true;
}, {
  message: "As senhas não coincidem",
  path: ["password_confirmation"],
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function PerfilPage() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Buscar dados do perfil
  const { 
    data: profileData, 
    isLoading, 
    isError, 
    error,
    refetch
  } = useProfile();
  
  // Mutation para atualizar o perfil
  const updateProfileMutation = useUpdateProfile();
  
  // Configurar o formulário
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: profileData?.data?.name || "",
      email: profileData?.data?.email || "",
      phone: profileData?.data?.phone || "",
      password: "",
      password_confirmation: "",
    },
  });
  
  // Atualizar os valores do formulário quando os dados do perfil forem carregados
  useEffect(() => {
    if (profileData?.data) {
      form.reset({
        name: profileData.data.name || "",
        email: profileData.data.email,
        phone: profileData.data.phone,
        password: "",
        password_confirmation: "",
      });
    }
  }, [profileData, form]);
  
  // Função para lidar com o envio do formulário
  const onSubmit = async (values: ProfileFormValues) => {
    try {
      // Remover campos vazios
      const dataToUpdate = Object.fromEntries(
        Object.entries(values).filter(([_, v]) => v !== "" && v !== null)
      );
      
      // Enviar dados para a API
      await updateProfileMutation.mutateAsync(dataToUpdate);
      
      // Mostrar mensagem de sucesso
      toast({
        title: "Perfil atualizado com sucesso!",
        description: "Suas informações foram salvas.",
      });
      
      // Atualizar dados do perfil
      refetch();
      
      // Desativar modo de edição
      setIsEditing(false);
      
      // Limpar campos de senha
      form.setValue("password", "");
      form.setValue("password_confirmation", "");
    } catch (error) {
      // Mostrar mensagem de erro
      toast({
        title: "Erro ao atualizar perfil",
        description: "Ocorreu um erro ao atualizar seus dados. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-gradient-to-r from-[#9747ff]/10 to-white p-6 rounded-xl">
        <div>
          <h1 className="text-3xl font-bold text-[#141414]">Meu Perfil</h1>
          <p className="text-[#969696] mt-1">Gerencie suas informações pessoais</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button 
            variant={isEditing ? "outline" : "default"}
            className={isEditing ? "" : "bg-[#9747ff] hover:bg-[#9747ff]/90"}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <>
                <AlertCircle className="w-4 h-4 mr-2" />
                Cancelar
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Editar Perfil
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Estado de carregamento e erro */}
      <LoadingState 
        isLoading={isLoading} 
        isError={isError} 
        error={error as Error} 
        onRetry={() => refetch()}
      />

      {!isLoading && !isError && profileData && (
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#9747ff]/5 to-transparent p-6">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#9747ff]" />
              <CardTitle className="text-lg font-medium">Informações Pessoais</CardTitle>
            </div>
            <CardDescription>
              Seus dados cadastrais no sistema
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="max-w-2xl mx-auto">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Informações do usuário */}
                  <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                    <div className="w-24 h-24 rounded-full bg-[#9747ff]/10 flex items-center justify-center">
                      <User className="w-12 h-12 text-[#9747ff]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-medium">
                        {profileData.data.name || "Usuário"}
                      </h2>
                      <p className="text-[#969696]">ID: {profileData.data.id}</p>
                      {profileData.data.email_verified_at ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                          Email verificado
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-2">
                          Email não verificado
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Campos do formulário */}
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                placeholder="Seu nome completo" 
                                {...field} 
                                value={field.value || ""}
                                disabled={!isEditing}
                                className="pl-10"
                              />
                            </FormControl>
                            <User className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                          </div>
                          <FormDescription>
                            Este é o nome que será exibido no sistema
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                placeholder="seu@email.com" 
                                {...field} 
                                disabled={!isEditing}
                                className="pl-10"
                              />
                            </FormControl>
                            <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                          </div>
                          <FormDescription>
                            Este é o email usado para acessar sua conta
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                placeholder="(00) 00000-0000" 
                                {...field} 
                                disabled={!isEditing}
                                className="pl-10"
                              />
                            </FormControl>
                            <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                          </div>
                          <FormDescription>
                            Seu número de telefone para contato
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {isEditing && (
                      <>
                        <div className="border-t pt-6 mt-6">
                          <h3 className="text-lg font-medium mb-4">Alterar Senha</h3>
                          
                          <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nova Senha</FormLabel>
                                <div className="relative">
                                  <FormControl>
                                    <Input 
                                      type={showPassword ? "text" : "password"}
                                      placeholder="Nova senha" 
                                      {...field} 
                                      className="pl-10"
                                    />
                                  </FormControl>
                                  <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                                </div>
                                <FormDescription>
                                  Deixe em branco para manter a senha atual
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="password_confirmation"
                            render={({ field }) => (
                              <FormItem className="mt-4">
                                <FormLabel>Confirmar Nova Senha</FormLabel>
                                <div className="relative">
                                  <FormControl>
                                    <Input 
                                      type={showPassword ? "text" : "password"}
                                      placeholder="Confirme a nova senha" 
                                      {...field} 
                                      className="pl-10"
                                    />
                                  </FormControl>
                                  <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                                </div>
                                <FormDescription>
                                  <Button 
                                    type="button" 
                                    variant="link" 
                                    className="p-0 h-auto text-xs"
                                    onClick={() => setShowPassword(!showPassword)}
                                  >
                                    {showPassword ? "Ocultar senha" : "Mostrar senha"}
                                  </Button>
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="flex justify-end mt-6">
                          <Button 
                            type="submit" 
                            className="bg-[#9747ff] hover:bg-[#9747ff]/90"
                            disabled={updateProfileMutation.isPending}
                          >
                            {updateProfileMutation.isPending ? (
                              "Salvando..."
                            ) : (
                              <>
                                <Save className="w-4 h-4 mr-2" />
                                Salvar Alterações
                              </>
                            )}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 