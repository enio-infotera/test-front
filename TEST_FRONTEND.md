# 🏨 Desafio Frontend: Sistema de Reserva de Hotéis

## 💻 Sobre o Teste

Este teste avalia sua capacidade de construir uma aplicação web **production-ready** com arquitetura escalável, performance otimizada e experiência de usuário excepcional. Você desenvolverá um sistema de busca e reserva de hotéis, lidando com cenários reais de complexidade.

---

## 📝 Cenário de Uso

Um usuário acessa a plataforma para buscar hotéis em um destino, filtrar resultados por múltiplos critérios, comparar opções, visualizar disponibilidade em tempo real, e completar uma reserva com múltiplos quartos e hóspedes.

A aplicação deve lidar com **estados complexos**, **sincronização de dados**, **otimizações de performance** e **edge cases** encontrados em sistemas reais.

---

## 🚀 Stack de Tecnologia Obrigatória

- **Framework:** Next.js 15+ com **App Router**
- **Linguagem:** TypeScript (strict mode)
- **Estilização:** Tailwind CSS
- **State Management:** Zustand ou Redux Toolkit
- **Data Fetching:** TanStack Query (React Query v5)
- **Formulários:** React Hook Form + Zod
- **API/Integração:** É **obrigatório** utilizar o `mock-api` fornecido na pasta do projeto para todas as chamadas de backend simuladas.

### Stack Adicional (Bônus mas recomendado):
- Biome ou ESLint + Prettier (linting)

---

## 📋 Requisitos Funcionais

> ⚠️ **Aviso sobre os Requisitos Avançados:** Você **não é obrigado** a implementar todos os recursos avançados listados abaixo. Eles servem como opções para você demonstrar seu domínio técnico e ir além do básico. Escolha implementar aqueles que melhor destacam suas habilidades ou que você julga agregarem mais valor ao produto.

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
- **Disponibilidade em tempo real:**
  - Mostrar quantos quartos restam
  - Indicador visual de escassez ("Apenas 2 quartos disponíveis!")
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
- Mensagem de sucesso ao finalizar

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

**Novo requisito:**
- Após finalizar reserva, redirecionar para página de confirmação
- Mostrar número de reserva (pode ser gerado no cliente)
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

### 1. Código (Repositório Git)
- **Commits atômicos** com mensagens descritivas
- Seguir **Conventional Commits**
- Branch principal: `main`

### 2. Deploy (Bônus mas recomendado)
- Vercel ou similar
- URL funcional disponibilizada junto com a entrega

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
- **Requisitos avançados:** Avaliaremos os que forem implementados (lembrando que são opcionais)
- **Edge cases:** Tratamento de erros, validações
- **UX:** Fluidez, feedback, loading states

### 3. Arquitetura (15%)
- **Escalabilidade:** Código preparado para crescer
- **Manutenibilidade:** Fácil de entender e modificar
- **Patterns:** Uso apropriado de padrões
- **Type safety:** TypeScript aproveitado

### 4. Documentação (5%)
- **Comentários:** Onde necessário
- **JSDoc:** Em componentes complexos
- **Commits:** Histórico limpo

---

## 🌟 Diferenciais (Bônus)

### Técnicos
- [ ] **CI/CD** configurado (GitHub Actions)
- [ ] **Docker** setup completo
- [ ] **Analytics** tracking (simulado)
- [ ] **i18n** (pt-BR + en-US)
- [ ] **PWA** capabilities
- [ ] **Error monitoring** setup (Sentry simulado)

### Features
- [ ] **Modo offline** (cache de buscas)
- [ ] **Favoritos** persistidos
- [ ] **Comparação** de hotéis (até 3)
- [ ] **Histórico** de reservas
- [ ] **Notificações** (toast system)
- [ ] **Animações** com Framer Motion
- [ ] **Mapas interativos** (Google Maps/Mapbox)

### Performance
- [ ] **Partial Prerendering** (Next.js 15)
- [ ] **Server Actions** para mutations
- [ ] **Parallel Routes** para modals
- [ ] **Incremental Static Regeneration**
- [ ] **Edge Runtime** onde apropriado

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