# 🏨 Hotel Booking Mock API

API mockada para o teste técnico de frontend, feita com **json-server 0.17**.

---

## 🚀 Instalação e uso

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar o servidor (atraso de 300ms por requisição, para simular rede)
npm run server

# 3. API disponível em
http://localhost:3333
```

A cada start, o servidor copia `db.seed.json` para `db.json` e usa essa cópia. As reservas que você criar duram até o próximo start. O `db.json` está no `.gitignore`, então não vai parar no seu commit. Para mudar os dados de partida, edite o `db.seed.json` e reinicie.

### Opções

| Script / flag | O que faz |
|---|---|
| `npm run server` | Porta 3333, atraso de 300ms |
| `npm run server:fast` | Sem atraso |
| `npm start` | Escuta em `0.0.0.0` e lê a porta da variável `PORT` (use este para hospedar) |
| `--port 4000` ou `PORT=4000` | Muda a porta |
| `--delay 1000` ou `DELAY=1000` | Muda o atraso padrão (ms) |
| `--fail-rate 0.2` ou `FAIL_RATE=0.2` | ~20% das requisições respondem `500` |

As flags vão depois de `--`, por exemplo `npm run server -- --fail-rate 0.2`.

### Simulando lentidão e erro

Para ver seus loading states, retries e error boundaries funcionando:

```bash
# Uma requisição lenta
GET /hotels?destination=Gramado, RS&_delay=3000

# Uma requisição que falha (sempre 500)
GET /hotels/1?_fail=1

# Falhas aleatórias em toda a API
npm run server -- --fail-rate 0.3
```

A resposta de erro é `{ "error": "Falha simulada pela mock API" }` com status `500`.

---

## 📡 Endpoints

Base URL: `http://localhost:3333`

### 1. Sugestões de destinos (autocomplete)

**GET** `/suggestions`

```bash
GET /suggestions?q=sao        # ignora acentos: encontra "São Paulo, SP"
GET /suggestions?q=florianop
GET /suggestions?name_like=^Rio
```

```json
[
  {
    "id": 1,
    "name": "Rio de Janeiro, RJ",
    "type": "city",
    "country": "Brasil",
    "searchName": "rio de janeiro, rj"
  }
]
```

O `?q=` ignora acentos só em `/suggestions`. Em `/hotels` a busca textual é a do json-server, que diferencia "Florianópolis" de "Florianopolis".

---

### 2. Lista de hotéis

**GET** `/hotels`

```bash
# Por destino (o valor é exatamente o "name" da sugestão)
GET /hotels?destination=Rio de Janeiro, RJ

# Por nome
GET /hotels?name_like=Palace

# Faixa de preço
GET /hotels?pricePerNight_gte=200&pricePerNight_lte=1000

# Avaliação mínima
GET /hotels?rating_gte=4.5

# Tipo de propriedade (repita o parâmetro para mais de um)
GET /hotels?propertyType=hotel&propertyType=pousada

# Comodidade (amenities é um array, então use _like)
GET /hotels?amenities_like=pool
# Repetir o parâmetro funciona como OU (piscina OU spa).
# Para exigir todas as comodidades, filtre no cliente.
GET /hotels?amenities_like=pool&amenities_like=spa

# Ordenação
GET /hotels?_sort=pricePerNight&_order=asc
GET /hotels?_sort=rating&_order=desc
GET /hotels?_sort=reviewCount&_order=desc   # "mais popular"

# Paginação (o total vem no header X-Total-Count)
GET /hotels?_page=1&_limit=10

# Destaques
GET /hotels?featured=true

# Combinando
GET /hotels?destination=São Paulo, SP&pricePerNight_lte=500&rating_gte=4.0&_sort=pricePerNight&_order=asc
```

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

`pricePerNight` do hotel é o preço do quarto mais barato. `availableRooms` é a soma do `available` dos quartos; quando dá `0`, o hotel está esgotado.

---

### 3. Detalhes do hotel

**GET** `/hotels/:id`

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

Um id que não existe responde `404`.

---

### 4. Quartos do hotel

**GET** `/rooms?hotelId=:id`

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

### 5. Reviews do hotel

**GET** `/reviews?hotelId=:id`

```bash
GET /reviews?hotelId=1&_sort=date&_order=desc
GET /reviews?hotelId=1&_page=1&_limit=5
```

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

### 6. Reservas

**POST** `/bookings` cria uma reserva. O json-server grava o corpo que você mandar e gera um `id` numérico se você não enviar um. O formato sugerido é o tipo `Booking` em `types.ts`.

```bash
curl -X POST http://localhost:3333/bookings \
  -H 'Content-Type: application/json' \
  -d '{"hotelId":1,"roomId":1,"checkIn":"2026-12-01","checkOut":"2026-12-04","rooms":1,"adults":2,"children":0,"guests":[],"totalPrice":3600,"createdAt":"2026-11-10T12:00:00Z"}'
```

Responde `201` com a reserva salva, incluindo o `id`.

**GET** `/bookings/:id` busca uma reserva. **GET** `/bookings` lista todas.

A API não valida nada: quem garante os dados é o seu formulário.

---

### 7. Relacionamentos

```bash
GET /hotels/1?_embed=rooms
GET /hotels/1?_embed=reviews
GET /hotels/1?_embed=rooms&_embed=reviews
GET /rooms/1?_expand=hotel
```

---

## 🔍 Operadores do json-server

| Operador | Descrição | Exemplo |
|----------|-----------|---------|
| `_gte` | Maior ou igual | `pricePerNight_gte=500` |
| `_lte` | Menor ou igual | `pricePerNight_lte=1000` |
| `_ne` | Diferente | `propertyType_ne=pousada` |
| `_like` | Contém (regex) | `name_like=Palace` |
| `q` | Busca em todos os campos | `q=praia` |
| `_sort` | Ordenar por campo | `_sort=rating` |
| `_order` | Ordem (asc/desc) | `_order=desc` |
| `_page` | Número da página | `_page=1` |
| `_limit` | Itens por página | `_limit=10` |

---

## 🎨 Dados

- 10 destinos. Bonito, MS não tem hotel nenhum, de propósito, para você tratar o estado vazio.
- 60 hotéis: Rio e São Paulo têm 14 cada (dá mais de uma página com `_limit=10`), os outros destinos têm de 2 a 8.
- 162 quartos e 328 reviews. Alguns hotéis têm uma review só, outros têm 14.
- Dois hotéis estão esgotados (todos os quartos com `available: 0`).
- Preços de R$ 180 a R$ 3.180 por noite.
- Imagens do Unsplash e avatares do pravatar.cc.

Os hotéis 1 a 8 são os originais. Os outros são fictícios.

### Tipos de propriedade

`hotel`, `pousada`, `resort`

### Comodidades do hotel

```
wifi, breakfast, pool, spa, restaurant, gym, parking, bar, room_service,
beach_access, kids_club, business_center, concierge, valet, lounge_access
```

### Comodidades do quarto

```
ocean_view, city_view, garden_view, balcony, terrace, bathtub, minibar, safe,
aircon, desk, kitchen, living_room, sound_system, butler, pool_access, garden,
lounge_access
```

---

## ☁️ Hospedando a API (para o deploy bônus)

Qualquer serviço que rode Node serve (Render, Railway, Fly.io e outros). Configure:

- Root directory: `mock-api`
- Build: `npm install`
- Start: `npm start`

O serviço define `PORT` e o servidor usa. Depois aponte o front para a URL pública por variável de ambiente.

O CORS já vem liberado. As reservas somem quando o serviço reinicia, e isso é esperado.

---

## 🚨 Problemas comuns

### `EADDRINUSE`

A porta 3333 já está em uso. Use outra com `npm run server -- --port 4000`, ou encerre o processo:

```bash
# Linux/Mac
lsof -ti:3333 | xargs kill -9

# Windows
netstat -ano | findstr :3333
taskkill /PID <PID> /F
```

### A API não responde

- Rodou `npm install` dentro de `mock-api`?
- O `npm run server` está rodando?
- A URL é `http://localhost:3333`?

---

## 📚 json-server

- [README da versão 0.17](https://github.com/typicode/json-server/tree/v0.17.4)
