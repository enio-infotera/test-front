# 🏨 Desafio Frontend: Sistema de Reserva de Hotéis

## 💻 Sobre o Teste

Este teste avalia sua capacidade de construir uma aplicação web **production-ready** com arquitetura escalável, performance otimizada e boa experiência de usuário. Você vai desenvolver um sistema de busca e reserva de hotéis, lidando com cenários reais de complexidade.

---

## ⏱️ Prazo e esforço

Você tem **3 dias corridos** a partir do recebimento do teste. Esperamos que isso tome **de 8 a 12 horas** de trabalho. Não precisa passar disso.

Ninguém precisa fazer tudo o que está neste documento. Os requisitos básicos são obrigatórios. Os avançados são opcionais: escolha os que quiser. **Avaliamos profundidade, não quantidade.** Poucos itens bem feitos e bem justificados valem mais que muitos feitos pela metade.

## 🤖 Uso de IA

Pode usar IA (Copilot, Claude, Cursor, o que preferir). Partimos do princípio de que todo mundo usa. Na conversa depois da entrega, você vai explicar as decisões do código, então entenda tudo o que entregar.

---

## 📝 Cenário de Uso

Um usuário acessa a plataforma para buscar hotéis em um destino, filtrar resultados por múltiplos critérios, comparar opções, ver a disponibilidade e completar uma reserva.

A aplicação deve lidar com **estados complexos**, **sincronização de dados**, **otimizações de performance** e **edge cases** encontrados em sistemas reais.

---

## 🚀 Stack de Tecnologia Obrigatória

- **Framework:** Next.js 15 ou 16 com **App Router**
- **Linguagem:** TypeScript (strict mode)
- **Estilização:** Tailwind CSS
- **State Management:** Zustand ou Redux Toolkit
- **Data Fetching:** TanStack Query (React Query v5)
- **Formulários:** React Hook Form + Zod
- **API/Integração:** É **obrigatório** usar o `mock-api` fornecido na pasta do projeto para todas as chamadas de backend. A documentação dos endpoints está em [`mock-api/README.md`](mock-api/README.md).
- **URL da API:** leia a URL base de uma variável de ambiente (por exemplo `NEXT_PUBLIC_API_URL`), sem `localhost` fixo no código.

### Stack Adicional (Bônus mas recomendado):
- Biome ou ESLint + Prettier (linting)

---

## 📋 Requisitos Funcionais

> ⚠️ **Sobre os Requisitos Avançados:** você **não é obrigado** a implementar os recursos avançados listados abaixo. Eles são opções para você mostrar domínio técnico e ir além do básico. Escolha os que melhor mostram suas habilidades ou que você acha que agregam mais ao produto, e conte no README por que escolheu.

### 1. 🏠 Página Inicial (`/`)

**Requisitos Básicos:**
- Campo de busca com autocomplete consumindo o endpoint `/suggestions` do `mock-api`
- Seleção de datas (check-in/check-out) com validação:
  - Check-in não pode ser no passado
  - Check-out deve ser pelo menos 1 dia após check-in
  - Máximo 30 dias de estadia
- Seleção de número de quartos e hóspedes (adultos/crianças)
- Redirecionamento para `/search` com parâmetros na URL

**Requisitos Avançados (Opcionais):**
- **Debounce inteligente** no autocomplete (300ms)
- **Persistência de busca** no localStorage
- **Últimas buscas** (histórico das 5 últimas)
- **Validação em tempo real** com feedback visual
- Loading states durante o autocomplete

---

### 2. 🔍 Página de Busca (`/search`)

**Requisitos Básicos:**
- Listagem de hotéis consumindo via `/hotels` do `mock-api` com cards informativos
- Estados de loading com skeleton screens
- Tratamento de "nenhum resultado encontrado"
- Paginação ou infinite scroll

**Requisitos Avançados (Opcionais):**
- **Filtros múltiplos simultâneos:**
  - Faixa de preço (slider com valores)
  - Avaliação mínima (estrelas)
  - Comodidades (wifi, piscina, estacionamento, etc)
  - Tipo de propriedade (hotel, pousada, resort)
- **Ordenação:**
  - Menor preço
  - Maior avaliação
  - Mais popular
  - Distância (se houver localização)
- **URL State Sync:** Todos filtros devem refletir na URL
- **Share functionality:** Link pode ser compartilhado com filtros aplicados
- **Error boundaries** específicas para seções
- **Retry logic** em caso de falha de requisição

**Performance:**
- Virtualization para listas longas (react-virtual ou similar)
- Prefetch de hotéis ao hover no card
- Image optimization com blur placeholders

---

### 3. 🏨 Página de Detalhes (`/hotel/[hotelId]`)

**Requisitos Básicos:**
- Rota dinâmica com dados do endpoint `/hotels/[id]` do `mock-api`
- Galeria de fotos
- Informações do hotel
- Lista de quartos disponíveis
- Botão "Selecionar" que salva no estado global e redireciona

**Requisitos Avançados (Opcionais):**
- **Galeria interativa:**
  - Lightbox/modal para fotos
  - Navegação por teclado
  - Thumbnails com lazy loading
- **Disponibilidade:**
  - Mostrar quantos quartos restam
  - Indicador visual de escassez ("Apenas 2 quartos disponíveis!")
  - Hotel ou quarto esgotado
- **Comparação de quartos:**
  - Tabela comparativa de comodidades
  - Highlight de diferenças
- **Política de cancelamento** expandível
- **Mapa de localização** (pode ser estático)
- **Reviews de hóspedes** com paginação
- **Similar hotels** (recomendações)
- **Share button** (copiar link)
- **Breadcrumb navigation**
- **Scroll to section** (âncoras)

**Performance:**
- Server Component para dados estáticos
- Client Component apenas para interações
- Parallel data fetching (hotel + reviews + availability)
- Streaming com Suspense boundaries

---

### 4. 💳 Página de Checkout (`/checkout`)

**Requisitos Básicos:**
- Resumo do hotel e quarto selecionados
- Redirect se não houver seleção
- Formulário com validação (nome, email, telefone)
- Ao finalizar, criar a reserva com `POST /bookings` do `mock-api` e redirecionar para a confirmação

**Requisitos Avançados (Opcionais):**
- **Multi-step form:**
  - Step 1: Dados pessoais
  - Step 2: Dados de pagamento (simulado)
  - Step 3: Revisão e confirmação
- **Validação complexa:**
  - Email com verificação de formato
  - Telefone com máscara e validação por país
  - CPF/Passaporte com validação real
  - Cartão de crédito com Luhn algorithm
  - Data de validade não expirada
- **Múltiplos hóspedes:**
  - Formulário dinâmico para cada hóspede
  - Validação individual
- **Múltiplos quartos** na mesma reserva
- **Cálculo de preços:**
  - Preço base × número de noites
  - Taxas e impostos
  - Total com breakdown detalhado
- **Termos e condições:**
  - Checkbox obrigatório
  - Modal com texto completo
- **Código de desconto:**
  - Input com validação
  - Feedback visual de aplicação
- **Loading states específicos:**
  - Por seção do formulário
  - Skeleton para cálculos
- **Error handling granular:**
  - Erros por campo
  - Erros globais do formulário
  - Retry de submissão

**Performance:**
- Form persistence com debounce
- Validação assíncrona otimizada
- Optimistic updates no cálculo de preços

---

### 5. ✅ Página de Confirmação (`/confirmation/[bookingId]`)

**Requisitos Básicos:**
- Buscar a reserva com `GET /bookings/[bookingId]` do `mock-api` (a página tem que funcionar se o usuário recarregar)
- Mostrar o número da reserva
- Resumo completo da reserva
- Botão para nova busca

---

### Loading States
- **Skeleton screens** customizados por componente
- **Progress indicators** em operações longas
- **Optimistic UI** onde apropriado
- **Streaming** com Suspense

### Error Handling
- **Error boundaries** por feature
- **Fallback UI** informativos
- **Retry mechanisms** automáticos e manuais
- **Error logging** (console.error estruturado)
- **Toast notifications** para feedback

A `mock-api` simula lentidão e erro (`?_delay=`, `?_fail=1`, `--fail-rate`). Veja como em [`mock-api/README.md`](mock-api/README.md#simulando-lentidão-e-erro).

---

### 6. ➕ Outros avançados (qualquer página)

Também opcionais, com a mesma regra: escolha os que quiser.

**Features**
- **Favoritos** persistidos
- **Comparação** de hotéis (até 3)
- **Histórico** de reservas
- **Notificações** (toast system)
- **Animações** com Framer Motion
- **Mapas interativos** (Google Maps/Mapbox)
- **Modo offline** (cache de buscas)
- **PWA** capabilities
- **i18n** (pt-BR + en-US)

**Next.js**
- **Partial Prerendering**
- **Server Actions** para mutations
- **Parallel Routes** para modals
- **Incremental Static Regeneration**
- **Edge Runtime** onde apropriado

**Testes**
- Testes unitários da lógica crítica (validação de datas, cálculo de preço, schemas Zod), com Vitest ou Jest
- Testes de componente (Testing Library)
- Testes E2E do fluxo de reserva (Playwright ou Cypress)

---

## 🏗️ Requisitos de Arquitetura

### Componentização
- **Atomic Design** ou padrão similar
- Componentes **reutilizáveis** e **composable**
- Props **bem tipadas** com JSDoc
- **Separation of concerns** (lógica vs apresentação)

### Type Safety
- **Strict TypeScript** config
- Zero `any` types
- Inferência de tipos quando possível
- Shared types entre cliente/servidor

---

## 📦 Entregáveis

### 1. Código (repositório Git público)
- Crie um repositório **público** no seu GitHub com a sua solução e mande o link para a gente
- **Commits atômicos** com mensagens descritivas
- Seguir **Conventional Commits**
- Branch principal: `main`

### 2. README da sua solução
- **Como rodar:** os comandos para subir a `mock-api` e o front localmente, e as variáveis de ambiente necessárias (um `.env.example` ajuda)
- **Decisões e trade-offs:** por que organizou o código assim, quais avançados escolheu e por quê
- **O que ficou de fora:** o que você faria com mais tempo
- **Uso de IA (opcional):** se quiser, conte como usou IA e qual workflow funcionou bem para você

### 3. Deploy (bônus)
- Front e `mock-api` hospedados por você (por exemplo, front na Vercel e API no Render ou Railway)
- O [`mock-api/README.md`](mock-api/README.md) explica como subir a API (seção "Hospedando a API")
- Mande as URLs junto com a entrega

---

## ✅ Critérios de Avaliação

### 1. Código (45%)
- **Qualidade:** Clean code, SOLID, DRY
- **TypeScript:** Tipagem forte, zero any
- **Organização:** Estrutura clara, imports organizados
- **Componentização:** Reutilização, composição
- **Performance:** Otimizações aplicadas

### 2. Funcionalidade (35%)
- **Requisitos básicos:** Todos implementados consumindo o `mock-api`
- **Requisitos avançados:** Avaliamos os que forem implementados, pela profundidade (lembrando que são opcionais)
- **Edge cases:** Tratamento de erros, validações
- **UX:** Fluidez, feedback, loading states
- **Acessibilidade:** navegação por teclado, labels, foco visível, contraste

### 3. Arquitetura (15%)
- **Escalabilidade:** Código preparado para crescer
- **Manutenibilidade:** Fácil de entender e modificar
- **Patterns:** Uso apropriado de padrões
- **Type safety:** TypeScript aproveitado

### 4. Documentação (5%)
- **README:** Como rodar, decisões, o que ficou de fora
- **Comentários:** Onde necessário
- **JSDoc:** Em componentes complexos
- **Commits:** Histórico limpo

---

## 🚫 O que NÃO fazer

- ❌ Copiar código de tutoriais sem entender
- ❌ Usar `any` no TypeScript
- ❌ Ignorar acessibilidade
- ❌ Fazer commit de `node_modules` ou `.env`
- ❌ UI quebrada no mobile
- ❌ Requisitos básicos incompletos

---

## 🎓 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Boa sorte! 🚀**

Estamos ansiosos para ver sua solução e sua abordagem para os desafios propostos.
