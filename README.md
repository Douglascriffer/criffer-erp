# CRIFFER ERP — SaaS Dashboard Financeiro

Dashboard financeiro SaaS com Next.js 14, Supabase, Recharts e mapa heatmap do Brasil.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 14 (App Router) + React 18 |
| Estilo | TailwindCSS + Design System Criffer |
| Gráficos | Recharts + react-simple-maps + d3-scale |
| Auth + DB | Supabase (PostgreSQL + Row Level Security) |
| Deploy | Vercel |

---

## Setup Local (5 minutos)

### 1. Clone e instale

```bash
git clone https://github.com/seu-usuario/criffer-erp.git
cd criffer-erp
npm install
```

### 2. Configure o Supabase

1. Crie uma conta em [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Vá em **SQL Editor** e cole o conteúdo de `supabase-schema.sql`
4. Execute o script

### 3. Variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Edite `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Encontre essas chaves em: Supabase → Settings → API

### 4. Rode localmente

```bash
npm run dev
```

Acesse: http://localhost:3000

---

## Deploy na Vercel

### Opção A: Deploy automático (recomendado)

1. Fork este repositório no GitHub
2. Acesse [vercel.com](https://vercel.com) → New Project
3. Importe o repositório
4. Adicione as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Clique **Deploy**

### Opção B: Via CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## Funcionalidades

### Dashboard
- KPIs: Receita Total, Vendas, Serviços, Locação, Meta, % Atingido
- Filtros por ano (2025/2026) e mês
- Comparação automática com período anterior

### Aba Desempenho
- Gráfico de barras empilhadas (Vendas + Serviços + Locação)
- Comparativo horizontal atual vs anterior
- Meta vs Realizado (linha)
- Bloco meta mensal com barra de progresso

### Aba Mapa
- Heatmap do Brasil por estado
- Escala de cor: #FFE5D9 (menor) → #FF6A22 (maior)
- Tooltip com nome e valor
- Ranking dos top 12 estados

### Aba Orçamento
- Gráfico Meta vs Realizado anual
- Tabela detalhada com % de atingimento por mês

### Aba Fluxo de Caixa
- Entradas brutas, devoluções, receita líquida
- Gráfico por categoria

### Upload Excel
- Suporta o formato nativo da Criffer
- Arraste ou clique para fazer upload
- Progresso em tempo real
- Persistência no Supabase com RLS

---

## Estrutura do Projeto

```
criffer-erp/
├── app/
│   ├── layout.jsx          # Root layout com fontes
│   ├── globals.css         # Design system + Tailwind
│   ├── page.jsx            # Redirect → /dashboard
│   ├── login/page.jsx      # Auth (login + cadastro)
│   └── dashboard/page.jsx  # Dashboard principal
├── components/
│   ├── KpiCards.jsx         # Cards de KPI
│   ├── FiltroPeriodo.jsx    # Filtros ano/mês
│   ├── MapaHeatBrasil.jsx   # Heatmap react-simple-maps
│   ├── GraficoMetaRealizado.jsx  # LineChart recharts
│   ├── GraficoReceitas.jsx  # BarChart empilhado
│   ├── GraficoComparativo.jsx    # Barras horizontais
│   ├── UploadExcel.jsx      # Upload com drag & drop
│   └── Sidebar.jsx          # Navegação lateral
├── lib/
│   ├── supabaseClient.js    # Cliente Supabase singleton
│   ├── excelParser.js       # Parser do Excel Criffer
│   └── hooks.js             # useFinancialData, cache, paginação
├── public/
│   └── data/dados.json      # Dados pré-processados do Excel
├── supabase-schema.sql      # Schema completo do banco
└── .env.local.example       # Template de variáveis
```

---

## Performance & Boas Práticas

- **Cache em memória** de 5 minutos para dados da API
- **Dynamic imports** para componentes pesados (mapa, gráficos)
- **Paginação** via `usePagination` hook
- **Row Level Security** no Supabase
- **Suspense boundaries** com skeletons de loading
- **Modo demo** sem autenticação para apresentações

---

## Atualização de Dados

Para atualizar a base de dados:

1. Acesse o dashboard
2. Clique em **Upload Excel**
3. Arraste o arquivo `BASE DE DADOS - RECEITAS 2025-2026.xlsx`
4. Os dados são processados e persistidos automaticamente

---

## Variáveis de Ambiente (Produção)

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # Opcional: operações privilegiadas
```
