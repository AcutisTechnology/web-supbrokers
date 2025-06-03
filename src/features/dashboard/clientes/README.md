# Feature: Clientes

Esta feature implementa a gestão de clientes (leads) seguindo os princípios de Clean Architecture baseada em features.

## Estrutura

```
src/features/dashboard/clientes/
├── components/           # Componentes React
│   ├── clientes-page.tsx        # Componente principal da página
│   ├── clientes-header.tsx      # Cabeçalho da página
│   ├── clientes-tabs.tsx        # Tabs para filtrar clientes
│   ├── clientes-table.tsx       # Tabela principal
│   ├── cliente-desktop-row.tsx  # Linha da tabela desktop
│   ├── cliente-mobile-card.tsx  # Card para mobile
│   ├── cliente-timeline.tsx     # Dialog da timeline do cliente
│   ├── timeline-step.tsx        # Componente de step da timeline
│   ├── timeline-actions.tsx     # Ações da timeline
│   └── index.ts                 # Exports dos componentes
├── services/             # Serviços e hooks
│   └── customer-service.ts      # API calls e React Query hooks
├── hooks/               # Hooks customizados
│   └── use-cliente-timeline.ts  # Hook para gerenciar timeline
├── types/               # Tipos TypeScript
│   └── timeline.ts              # Tipos da timeline
├── utils/               # Utilitários e lógica de negócio
│   └── cliente-utils.ts         # Funções auxiliares
├── index.ts             # Export principal da feature
└── README.md            # Esta documentação
```

## Funcionalidades

### 📋 Gestão de Clientes
- Listagem de clientes com paginação
- Filtros por status (Todos, Interessados, Sem interesse, Em análise)
- Visualização responsiva (desktop/mobile)
- Informações detalhadas dos imóveis de interesse

### ⏱️ Timeline do Cliente (NOVA!)
- **Linha do tempo visual** do progresso do atendimento
- **7 etapas predefinidas** do processo de vendas/locação:
  1. 👀 Interesse Demonstrado
  2. 📞 Primeiro Contato
  3. 🏠 Visita Agendada
  4. 💬 Negociação
  5. 📋 Análise de Documentação
  6. ✅ Aprovação
  7. 📝 Assinatura do Contrato

- **Ações disponíveis:**
  - Iniciar etapa
  - Concluir etapa
  - Reabrir etapa
  - Avançar/voltar etapas
  - Barra de progresso visual

- **Persistência local:** Timeline salva no localStorage
- **Feedback visual:** Toasts informativos para ações
- **Interface intuitiva:** Design minimalista e funcional

## Componentes

### ClientesPage
Componente principal que orquestra toda a funcionalidade da página de clientes.

**Responsabilidades:**
- Gerenciar estado de paginação
- Fazer chamadas para a API
- Renderizar componentes filhos

### ClientesHeader
Componente responsável pelo cabeçalho da página.

### ClientesTabs
Componente que implementa as abas para filtrar clientes por status.

**Filtros disponíveis:**
- Todos
- Interessados
- Sem interesse
- Em análise

### ClientesTable
Componente que renderiza a tabela de clientes, adaptando-se para desktop e mobile.

### ClienteDesktopRow
Componente que renderiza uma linha da tabela para desktop.

### ClienteMobileCard
Componente que renderiza um card de cliente para dispositivos móveis.

### ClienteTimelineDialog
Dialog modal que exibe a timeline completa do cliente com:
- Informações básicas do cliente
- Linha do tempo visual com status de cada etapa
- Ações para gerenciar o progresso
- Barra de progresso geral

### TimelineStepComponent
Componente individual que representa cada etapa da timeline:
- Ícone visual da etapa
- Status (concluído, atual, pendente)
- Data/hora da última atualização
- Botões de ação contextuais

### TimelineActions
Componente de ações rápidas da timeline:
- Barra de progresso geral
- Botões para avançar/voltar etapas
- Indicador de processo concluído

## Serviços

### customer-service.ts
Contém os hooks do React Query para interagir com a API de clientes.

**Hooks disponíveis:**
- `useCustomers(page)` - Lista clientes com paginação
- `useCustomer(id)` - Busca um cliente específico

## Hooks

### useClienteTimeline
Hook customizado para gerenciar a timeline do cliente:
- Carregamento da timeline
- Atualização de etapas
- Persistência no localStorage
- Lógica de consistência entre etapas

## Tipos

### TimelineStep
```typescript
interface TimelineStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  date?: string;
  icon: string;
}
```

### ClienteTimeline
```typescript
interface ClienteTimeline {
  clienteId: number;
  currentStep: number;
  steps: TimelineStep[];
  lastUpdate: string;
}
```

## Utilitários

### cliente-utils.ts
Contém funções auxiliares para lógica de negócio.

**Funções disponíveis:**
- `getClienteSituacao(cliente)` - Determina a situação do cliente
- `getCorSituacao(situacao)` - Retorna a cor correspondente à situação

## Como usar

```typescript
import { ClientesPage } from "@/features/dashboard/clientes/components";

export default function Page() {
  return <ClientesPage />;
}
```

### Timeline Individual
```typescript
import { ClienteTimelineDialog } from "@/features/dashboard/clientes/components";

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <ClienteTimelineDialog
      cliente={cliente}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    />
  );
}
```

## Fluxo de Uso da Timeline

1. **Acesso:** Clique no botão "Timeline" em qualquer cliente
2. **Visualização:** Veja o progresso atual e histórico
3. **Atualização:** Use os botões para avançar/voltar etapas
4. **Ações rápidas:** Use os botões de ação rápida na parte inferior
5. **Persistência:** Todas as mudanças são salvas automaticamente

## Princípios aplicados

1. **Separação de responsabilidades**: Cada componente tem uma responsabilidade específica
2. **Reutilização**: Componentes podem ser reutilizados em outras partes da aplicação
3. **Testabilidade**: Componentes pequenos e focados são mais fáceis de testar
4. **Manutenibilidade**: Estrutura clara facilita manutenção e evolução
5. **Clean Architecture**: Separação clara entre UI, lógica de negócio e serviços
6. **UX/UI**: Interface intuitiva e minimalista para melhor experiência do usuário 