/**
 * Types para a API de Hotel Booking
 * 
 * Uso:
 * import { Hotel, Room, Review, Suggestion } from '@/types/api'
 */

export interface Suggestion {
  id: number
  name: string
  type: 'city' | 'beach' | 'island' | 'nature'
  country: string
  /** Nome sem acentos e em minúsculas, usado pela busca `?q=` */
  searchName: string
}

export interface Hotel {
  id: number
  name: string
  slug: string
  destination: string
  description: string
  rating: number
  reviewCount: number
  pricePerNight: number
  currency: 'BRL'
  propertyType: 'hotel' | 'pousada' | 'resort'
  address: string
  latitude: number
  longitude: number
  images: string[]
  thumbnail: string
  amenities: Amenity[]
  checkInTime: string
  checkOutTime: string
  cancellationPolicy: 'free' | 'moderate' | 'strict'
  availableRooms: number
  featured: boolean
}

export interface Room {
  id: number
  hotelId: number
  name: string
  description: string
  size: number
  maxGuests: number
  beds: Bed[]
  pricePerNight: number
  amenities: RoomAmenity[]
  images: string[]
  available: number
}

export interface Bed {
  type: 'single' | 'double' | 'queen' | 'king' | 'twin' | 'sofa_bed'
  quantity: number
}

export interface Review {
  id: number
  hotelId: number
  guestName: string
  guestAvatar: string
  rating: number
  title: string
  comment: string
  date: string
  helpful: number
  verified: boolean
}

export type Amenity = 
  | 'wifi'
  | 'breakfast'
  | 'pool'
  | 'spa'
  | 'restaurant'
  | 'gym'
  | 'parking'
  | 'bar'
  | 'room_service'
  | 'beach_access'
  | 'kids_club'
  | 'business_center'
  | 'concierge'
  | 'valet'
  | 'lounge_access'

export type RoomAmenity =
  | 'ocean_view'
  | 'city_view'
  | 'garden_view'
  | 'balcony'
  | 'terrace'
  | 'bathtub'
  | 'minibar'
  | 'safe'
  | 'aircon'
  | 'desk'
  | 'kitchen'
  | 'living_room'
  | 'sound_system'
  | 'butler'
  | 'pool_access'
  | 'garden'
  | 'lounge_access'

// API Response types
export interface HotelSearchParams {
  destination?: string
  pricePerNight_gte?: number
  pricePerNight_lte?: number
  rating_gte?: number
  propertyType?: Hotel['propertyType']
  featured?: boolean
  _sort?: keyof Hotel
  _order?: 'asc' | 'desc'
  _page?: number
  _limit?: number
}

/**
 * A API não devolve esse formato: com `_page`/`_limit` ela responde um array
 * e manda o total no header `X-Total-Count`. Use este tipo se quiser montar
 * a resposta paginada no cliente.
 */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

// Form types para checkout
export interface GuestData {
  firstName: string
  lastName: string
  email: string
  phone: string
  cpf: string
  // Adicione campos extras conforme necessário
}

export interface BookingData {
  hotel: Hotel
  room: Room
  checkIn: Date
  checkOut: Date
  guests: GuestData[]
  totalPrice: number
}

/**
 * Reserva salva via `POST /bookings` e lida via `GET /bookings/:id`.
 * O json-server aceita qualquer JSON e gera o `id` se você não mandar.
 * Este é um formato sugerido: adapte se precisar.
 */
export interface Booking {
  id: number | string
  hotelId: number
  roomId: number
  /** Datas em ISO (YYYY-MM-DD) */
  checkIn: string
  checkOut: string
  rooms: number
  adults: number
  children: number
  guests: GuestData[]
  totalPrice: number
  /** Data/hora em ISO */
  createdAt: string
}

// Utility types
export type HotelWithRooms = Hotel & {
  rooms: Room[]
}

export type HotelWithReviews = Hotel & {
  reviews: Review[]
}

export type HotelComplete = Hotel & {
  rooms: Room[]
  reviews: Review[]
}
