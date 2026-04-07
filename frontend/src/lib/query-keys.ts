import type { HotelSearchParams } from "@/types/api"

export const queryKeys = {
  hotels: {
    all: ["hotels"] as const,
    search: (params: HotelSearchParams) => ["hotels", "search", params] as const,
    detail: (id: number) => ["hotels", id] as const,
  },
  rooms: {
    byHotel: (hotelId: number) => ["rooms", hotelId] as const,
  },
  reviews: {
    byHotel: (hotelId: number, page?: number) => ["reviews", hotelId, page ?? 1] as const,
  },
  suggestions: {
    search: (query: string) => ["suggestions", query] as const,
  },
}
