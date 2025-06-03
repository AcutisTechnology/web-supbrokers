"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { TopNav } from "@/features/dashboard/imoveis/top-nav";

export default function NovaLocacaoPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    imovel: "",
    endereco: "",
    inquilino: "",
    cpf: "",
    rg: "",
    email: "",
    telefone: "",
    profissao: "",
    renda: "",
    doc_rg: null as File | null,
    doc_cpf: null as File | null,
    doc_renda: null as File | null,
    valor: "",
    data_inicio: "",
    data_fim: "",
    garantia: "",
    multa: "",
    reajuste: "",
    observacoes: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  }

  function handleChangeTextarea(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => router.push("/dashboard/alugueis"), 1500);
    }, 1200);
  }

  return (
    <div className="flex-1">
      <main className="p-6">
          <TopNav title_secondary="Gestão de aluguéis" />
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* DADOS DO IMÓVEL */}
          <Card className="p-8 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-[#9747ff]">Dados do Imóvel</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input name="imovel" value={form.imovel} onChange={handleChange} required placeholder="Imóvel" />
              <Input name="endereco" value={form.endereco} onChange={handleChange} required placeholder="Endereço" />
            </div>
          </Card>
          {/* DADOS DO INQUILINO */}
          <Card className="p-8 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-[#9747ff]">Dados do Inquilino</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input name="inquilino" value={form.inquilino} onChange={handleChange} required placeholder="Nome do inquilino" />
              <Input name="cpf" value={form.cpf} onChange={handleChange} required placeholder="CPF" />
              <Input name="rg" value={form.rg} onChange={handleChange} required placeholder="RG" />
              <Input name="email" value={form.email} onChange={handleChange} required placeholder="E-mail" />
              <Input name="telefone" value={form.telefone} onChange={handleChange} required placeholder="Telefone" />
              <Input name="profissao" value={form.profissao} onChange={handleChange} placeholder="Profissão" />
              <Input name="renda" value={form.renda} onChange={handleChange} placeholder="Renda mensal" />
            </div>
          </Card>
          {/* DOCUMENTAÇÃO */}
          <Card className="p-8 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-[#9747ff]">Documentação</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#1c1b1f] mb-1">RG (upload)</label>
                <input type="file" name="doc_rg" onChange={handleChange} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1c1b1f] mb-1">CPF (upload)</label>
                <input type="file" name="doc_cpf" onChange={handleChange} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1c1b1f] mb-1">Comprovante de renda (upload)</label>
                <input type="file" name="doc_renda" onChange={handleChange} className="w-full" />
              </div>
            </div>
          </Card>
          {/* DADOS DO CONTRATO */}
          <Card className="p-8 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-[#9747ff]">Dados do Contrato</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input name="valor" value={form.valor} onChange={handleChange} required placeholder="Valor do aluguel" />
              <Input name="data_inicio" value={form.data_inicio} onChange={handleChange} type="date" required placeholder="Data de início" />
              <Input name="data_fim" value={form.data_fim} onChange={handleChange} type="date" required placeholder="Data de término" />
              <Input name="garantia" value={form.garantia} onChange={handleChange} placeholder="Garantia" />
              <Input name="multa" value={form.multa} onChange={handleChange} placeholder="Multa rescisória" />
              <Input name="reajuste" value={form.reajuste} onChange={handleChange} placeholder="Reajuste anual (%)" />
            </div>
          </Card>
          {/* OBSERVAÇÕES */}
          <Card className="p-8 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-[#9747ff]">Observações</h2>
            <Textarea name="observacoes" value={form.observacoes} onChange={handleChangeTextarea} placeholder="Observações adicionais" />
          </Card>
          {/* BOTÃO DE SALVAR */}
          <div className="flex justify-end">
            <Button type="submit" disabled={loading} className="w-40 h-12 text-lg bg-[#9747ff] hover:bg-[#7c2ae8] text-white border-none">
              {loading ? 'Salvando...' : success ? 'Salvo!' : 'Salvar'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
} 