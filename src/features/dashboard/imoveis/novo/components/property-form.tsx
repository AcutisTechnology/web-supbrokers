"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export function PropertyForm() {
  const form = useForm();
  const router = useRouter();

  return (
    <div className="mx-auto">
      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <div>
            <h1 className="mb-1 text-xl font-semibold">Dados do imóvel</h1>
            <p className="text-sm text-muted-foreground">
              Preencha os dados do seu imóvel, capriche :)
            </p>
          </div>
          <Card className="border-l-4 border-l-yellow-500 bg-yellow-50/50 p-4">
            <p className="text-sm">Os itens com (*) são obrigatórios</p>
          </Card>
          <Form {...form}>
            <div className="space-y-8">
              <FormField
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nome ou título do imóvel
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white"
                        placeholder="Título ou nome do imóvel"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Descrição<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva o seu imóvel"
                        className="min-h-[120px] bg-white"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Tipo<span className="text-red-500">*</span>
                      </FormLabel>
                      <Select>
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Escolha" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="apartment">Apartamento</SelectItem>
                          <SelectItem value="house">Casa</SelectItem>
                          <SelectItem value="commercial">Comercial</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Vender ou alugar?<span className="text-red-500">*</span>
                      </FormLabel>
                      <Select>
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Escolha" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sell">Vender</SelectItem>
                          <SelectItem value="rent">Alugar</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <FormField
                  name="rooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Número de quartos<span className="text-red-500">*</span>
                      </FormLabel>
                      <Select>
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Escolha" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4+</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Área(m²)<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="bg-white"
                          type="number"
                          placeholder="m²"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="parking"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vagas na garagem</FormLabel>
                      <Select>
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Escolha" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">0</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3+</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <h2 className="mb-4 text-lg font-medium">Detalhes do imóvel</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    name="serviceArea"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Área de serviço
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="bedroomCloset"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Armários no quarto
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="kitchenCabinets"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Armários na cozinha
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="furnished"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox />
                        </FormControl>
                        <FormLabel className="font-normal">Mobiliado</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="airConditioning"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Ar condicionado
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="bbq"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Churrasqueira
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="balcony"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox />
                        </FormControl>
                        <FormLabel className="font-normal">Varanda</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="gym"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox />
                        </FormControl>
                        <FormLabel className="font-normal">Academia</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="pool"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox />
                        </FormControl>
                        <FormLabel className="font-normal">Piscina</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="serviceRoom"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Quarto de serviço
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </Form>
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="mb-1 text-lg font-medium">Visualização</h2>
            <Card className="overflow-hidden">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Supbrokers__C_C3_B3pia_S_C3_A9rgio_-i5IjBZhamqbTXLQvYD1E6xOv8YJ5Vg.png"
                alt="Property Preview"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="p-4">
                <div className="mb-4">
                  <div className="mb-1 text-2xl font-semibold text-[#9747ff]">
                    R$ 330.000
                  </div>
                  <div className="font-medium">Bessa, João Pessoa</div>
                  <div className="text-sm text-muted-foreground">
                    Rua Randal Cavalcanti Pimentel
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div>55m²</div>
                  <div>3 quartos</div>
                  <div>Piscina</div>
                </div>
              </div>
            </Card>
          </div>
          <div className="bg-white p-4 rounded-lg border border-border shadow-md">
            <h2 className="mb-4 text-lg font-medium">Integração</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-pink-50">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17.5 7.5L17.5 16.5M6.5 9.5V14.5M12 6.5V17.5M12 12L12 12.01M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2Z"
                        stroke="#E1306C"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">Instagram</div>
                    <div className="text-sm text-muted-foreground">
                      @supbrokersbr
                    </div>
                  </div>
                </div>
                <Switch checked />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="#287EFF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.5 12H15.5"
                        stroke="#287EFF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 8.5V15.5"
                        stroke="#287EFF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">Viva Real</div>
                    <div className="text-sm text-muted-foreground">
                      vivareal.com
                    </div>
                  </div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-red-50">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="#EF4444"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.5 12H15.5"
                        stroke="#EF4444"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 8.5V15.5"
                        stroke="#EF4444"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">Chaves na mão</div>
                    <div className="text-sm text-muted-foreground">
                      chavesnamao.com
                    </div>
                  </div>
                </div>
                <Switch checked />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-orange-50">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="#F97316"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.5 12H15.5"
                        stroke="#F97316"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 8.5V15.5"
                        stroke="#F97316"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">Zap Imóveis</div>
                    <div className="text-sm text-muted-foreground">
                      zapimoveis.com
                    </div>
                  </div>
                </div>
                <Switch checked />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-purple-50">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="#9333EA"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.5 12H15.5"
                        stroke="#9333EA"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 8.5V15.5"
                        stroke="#9333EA"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">OLX</div>
                    <div className="text-sm text-muted-foreground">
                      /supbrokersbr
                    </div>
                  </div>
                </div>
                <Switch />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 flex items-center justify-end gap-4 border-t pt-8">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/imoveis")}
        >
          Cancelar
        </Button>
        <Button
          className="bg-[#219653] hover:bg-[#219653]/90"
          onClick={() => router.push("/dashboard/imoveis")}
        >
          Salvar e publicar imóvel
        </Button>
      </div>
    </div>
  );
}
