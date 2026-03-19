# 🏨 Hotel Booking Mock API

API mockada completa para o teste técnico de frontend, usando **json-server**.

---

## 🚀 Instalação e Uso

### Opção 1: Rodar localmente

```bash
# 1. Instalar dependências
npm install
# ou
pnpm install
# ou
yarn install

# 2. Iniciar servidor (com delay de 300ms para simular rede)
npm run server

# 3. API disponível em:
http://localhost:3333
```

### Opção 2: Sem delay (testes rápidos)

```bash
npm run server:fast
```

### Opção 3: Acesso em rede local

```bash
npm run server:prod
# Acessível em http://SEU_IP:3333
```

---

## 📡 Endpoints Disponíveis

### Base URL
```
http://localhost:3333
```

### 1. Sugestões de Destinos (Autocomplete)

**GET** `/suggestions`

Buscar por query string:
```bash
GET /suggestions?q=Rio
GET /suggestions?name_like=São
```

**Resposta:**
```json
[
  {
    "id": 1,
    "name": "Rio de Janeiro, RJ",
    "type": "city",
    "country": "Brasil"
  }
]
```

---

### 2. Lista de Hotéis

**GET** `/hotels`

**Query params suportados:**

```bash
# Buscar por destino
GET /hotels?destination=Rio de Janeiro, RJ

# Buscar por nome
GET /hotels?name_like=Palace

# Filtrar por preço (range)
GET /hotels?pricePerNight_gte=200&pricePerNight_lte=1000

# Filtrar por avaliação mínima
GET /hotels?rating_gte=4.5

# Filtrar por tipo de propriedade
GET /hotels?propertyType=hotel

# Ordenar (asc/desc)
GET /hotels?_sort=pricePerNight&_order=asc
GET /hotels?_sort=rating&_order=desc

# Paginação
GET /hotels?_page=1&_limit=10

# Featured hotels
GET /hotels?featured=true

# Combinar filtros
GET /hotels?destination=São Paulo, SP&pricePerNight_lte=500&rating_gte=4.0&_sort=pricePerNight&_order=asc
```

**Resposta:**
```json
[
  {
    "id": 1,
    "name": "Hotel Copacabana Palace",
    "destination": "Rio de Janeiro, RJ",
    "rating": 4.8,
    "pricePerNight": 1200,
    "thumbnail": "...",
    "propertyType": "hotel",
    "amenities": ["wifi", "pool", "spa"],
    "availableRooms": 12
  }
]
```

---

### 3. Detalhes do Hotel

**GET** `/hotels/:id`

```bash
GET /hotels/1
```

**Resposta:**
```json
{
  "id": 1,
  "name": "Hotel Copacabana Palace",
  "slug": "copacabana-palace",
  "destination": "Rio de Janeiro, RJ",
  "description": "...",
  "rating": 4.8,
  "reviewCount": 2847,
  "pricePerNight": 1200,
  "images": ["url1", "url2"],
  "amenities": ["wifi", "pool", "spa"],
  "address": "...",
  "latitude": -22.9683,
  "longitude": -43.1792,
  "checkInTime": "15:00",
  "checkOutTime": "12:00",
  "cancellationPolicy": "free"
}
```

---

### 4. Quartos do Hotel

**GET** `/rooms?hotelId=:id`

```bash
GET /rooms?hotelId=1
```

**Resposta:**
```json
[
  {
    "id": 1,
    "hotelId": 1,
    "name": "Suíte Deluxe Ocean View",
    "description": "...",
    "size": 45,
    "maxGuests": 3,
    "beds": [{ "type": "king", "quantity": 1 }],
    "pricePerNight": 1200,
    "amenities": ["ocean_view", "balcony"],
    "images": ["url1"],
    "available": 8
  }
]
```

---

### 5. Reviews do Hotel

**GET** `/reviews?hotelId=:id`

```bash
GET /reviews?hotelId=1
GET /reviews?hotelId=1&_sort=date&_order=desc
GET /reviews?hotelId=1&_page=1&_limit=5
```

**Resposta:**
```json
[
  {
    "id": 1,
    "hotelId": 1,
    "guestName": "Maria Silva",
    "guestAvatar": "...",
    "rating": 5,
    "title": "Experiência inesquecível!",
    "comment": "...",
    "date": "2024-03-10",
    "helpful": 42,
    "verified": true
  }
]
```

---

### 6. Relacionamentos (Expand)

**GET** com `_embed` para incluir dados relacionados:

```bash
# Hotel com seus quartos
GET /hotels/1?_embed=rooms

# Hotel com reviews
GET /hotels/1?_embed=reviews

# Hotel com ambos
GET /hotels/1?_embed=rooms&_embed=reviews
```

---

## 🔍 Operadores de Busca (json-server)

| Operador | Descrição | Exemplo |
|----------|-----------|---------|
| `_gte` | Maior ou igual | `pricePerNight_gte=500` |
| `_lte` | Menor ou igual | `pricePerNight_lte=1000` |
| `_ne` | Diferente | `propertyType_ne=pousada` |
| `_like` | Contém (regex) | `name_like=Palace` |
| `q` | Full-text search | `q=luxo` |
| `_sort` | Ordenar por campo | `_sort=rating` |
| `_order` | Ordem (asc/desc) | `_order=desc` |
| `_page` | Número da página | `_page=1` |
| `_limit` | Items por página | `_limit=10` |

---

## 💡 Exemplos de Uso

### 1. Busca com filtros múltiplos

```typescript
// Hotéis no Rio, entre R$300-800, rating > 4.5, ordenados por preço
const response = await fetch(
  'http://localhost:3333/hotels?' +
  'destination=Rio de Janeiro, RJ' +
  '&pricePerNight_gte=300' +
  '&pricePerNight_lte=800' +
  '&rating_gte=4.5' +
  '&_sort=pricePerNight' +
  '&_order=asc'
);
```

### 2. Autocomplete de destinos

```typescript
// Debounced search
const searchDestination = async (query: string) => {
  const response = await fetch(
    `http://localhost:3333/suggestions?q=${query}`
  );
  return response.json();
};
```

### 3. Detalhes completos do hotel

```typescript
// Hotel + quartos + reviews em uma única request
const response = await fetch(
  'http://localhost:3333/hotels/1?_embed=rooms&_embed=reviews'
);
```

### 4. Paginação

```typescript
// Página 2, 10 items por página
const response = await fetch(
  'http://localhost:3333/hotels?_page=2&_limit=10'
);

// Total de items vem no header
const total = response.headers.get('X-Total-Count');
```

---

## 🎨 Dados Mockados

### Estatísticas:
- **10 destinos** diferentes
- **8 hotéis** com dados completos
- **12 quartos** variados
- **8 reviews** verificadas
- Imagens reais do Unsplash
- Preços realistas (R$ 220 - R$ 1800/noite)

### Tipos de Propriedade:
- `hotel` - Hotéis tradicionais
- `pousada` - Pousadas
- `resort` - Resorts

### Amenities disponíveis:
```
wifi, pool, spa, restaurant, gym, parking, bar, 
room_service, beach_access, kids_club, business_center, 
concierge, valet, lounge_access
```

### Room amenities:
```
ocean_view, city_view, garden_view, balcony, terrace, 
bathtub, minibar, safe, aircon, desk, kitchen, 
living_room, sound_system, butler
```

---

## 🧪 Testando a API

### cURL

```bash
# Listar hotéis
curl http://localhost:3333/hotels

# Detalhes de um hotel
curl http://localhost:3333/hotels/1

# Buscar com filtros
curl "http://localhost:3333/hotels?destination=Rio%20de%20Janeiro,%20RJ&rating_gte=4.5"
```

---

## 🔧 Customizações

### Adicionar delay customizado

Edite `package.json`:
```json
"server": "json-server --watch db.json --port 3333 --delay 500"
```

### Mudar porta

```json
"server": "json-server --watch db.json --port 4000"
```

### Adicionar mais dados

Edite `db.json` e adicione mais itens nos arrays.

---

## 🚨 Troubleshooting

### Erro: `EADDRINUSE`
Porta 3333 já está em uso.

**Solução:**
```bash
# Linux/Mac
lsof -ti:3333 | xargs kill -9

# Windows
netstat -ano | findstr :3333
taskkill /PID <PID> /F

# Ou use outra porta
npm run server -- --port 4000
```

---

### API não responde

**Checklist:**
- [ ] `npm install` foi executado?
- [ ] `npm run server` está rodando?
- [ ] Porta 3333 está livre?
- [ ] URL está correta? (`http://localhost:3333`)

---

## 🎯 Alternativas

### Opção 1: MSW (Mock Service Worker)

Se preferir mockar no cliente:

```bash
npm install msw --save-dev
```

```typescript
// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw'
import db from './db.json'

export const handlers = [
  http.get('/hotels', ({ request }) => {
    const url = new URL(request.url)
    const destination = url.searchParams.get('destination')
    
    let hotels = db.hotels
    if (destination) {
      hotels = hotels.filter(h => h.destination === destination)
    }
    
    return HttpResponse.json(hotels)
  })
]
```

### Opção 2: Dados estáticos

Copie `db.json` para seu projeto:

```typescript
// src/data/hotels.ts
import data from './db.json'

export const hotels = data.hotels
export const rooms = data.rooms
export const reviews = data.reviews
```

---

## 📚 Documentação json-server

- [GitHub](https://github.com/typicode/json-server)
- [Docs Completas](https://github.com/typicode/json-server#readme)

---

Se tiver problemas, documente no README do seu projeto e use dados mockados estaticamente.
