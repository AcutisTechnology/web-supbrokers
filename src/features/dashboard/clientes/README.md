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
│   └── index.ts                 # Exports dos componentes
├── services/             # Serviços e hooks
│   └── customer-service.ts      # API calls e React Query hooks
├── utils/               # Utilitários e lógica de negócio
│   └── cliente-utils.ts         # Funções auxiliares
├── index.ts             # Export principal da feature
└── README.md            # Esta documentação
```

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

## Serviços

### customer-service.ts
Contém os hooks do React Query para interagir com a API de clientes.

**Hooks disponíveis:**
- `useCustomers(page)` - Lista clientes com paginação
- `useCustomer(id)` - Busca um cliente específico

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

## Princípios aplicados

1. **Separação de responsabilidades**: Cada componente tem uma responsabilidade específica
2. **Reutilização**: Componentes podem ser reutilizados em outras partes da aplicação
3. **Testabilidade**: Componentes pequenos e focados são mais fáceis de testar
4. **Manutenibilidade**: Estrutura clara facilita manutenção e evolução
5. **Clean Architecture**: Separação clara entre UI, lógica de negócio e serviços 