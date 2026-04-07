export interface Suggestion {
  id: number
  name: string
  type: "city" | "beach" | "island" | "nature"
  country: string
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
  currency: "BRL"
  propertyType: "hotel" | "pousada" | "resort"
  address: string
  latitude: number
  longitude: number
  images: string[]
  thumbnail: string
  amenities: Amenity[]
  checkInTime: string
  checkOutTime: string
  cancellationPolicy: "free" | "moderate" | "strict"
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
  type: "single" | "double" | "queen" | "king" | "twin" | "sofa_bed"
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
  | "wifi"
  | "pool"
  | "spa"
  | "restaurant"
  | "gym"
  | "parking"
  | "bar"
  | "room_service"
  | "beach_access"
  | "kids_club"
  | "business_center"
  | "concierge"
  | "valet"
  | "lounge_access"
  | "breakfast"

export type RoomAmenity =
  | "ocean_view"
  | "city_view"
  | "garden_view"
  | "garden"
  | "pool_access"
  | "balcony"
  | "terrace"
  | "bathtub"
  | "minibar"
  | "safe"
  | "aircon"
  | "desk"
  | "kitchen"
  | "living_room"
  | "sound_system"
  | "butler"
  | "lounge_access"

export interface HotelSearchParams {
  destination?: string
  checkIn?: string
  checkOut?: string
  guests?: number
  rooms?: number
  minPrice?: number
  maxPrice?: number
  minRating?: number
  amenities?: Amenity[]
  propertyType?: Hotel["propertyType"][]
  sortBy?: SortOption
  page?: number
  limit?: number
}

export type SortOption = "price_asc" | "price_desc" | "rating" | "popular"

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}
