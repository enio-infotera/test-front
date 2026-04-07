import { api } from "@/lib/api-client"
import type { Hotel, HotelSearchParams, Review, Room, Suggestion } from "@/types/api"

const SORT_FIELD: Partial<Record<NonNullable<HotelSearchParams["sortBy"]>, string>> = {
  price_asc: "pricePerNight",
  price_desc: "pricePerNight",
  rating: "rating",
}

export const hotelApi = {
  getSuggestions: (query: string) => api.get<Suggestion[]>("/suggestions", { q: query }),

  getHotels: (params?: HotelSearchParams) => {
    const { destination, minPrice, maxPrice, minRating, propertyType, sortBy, page, limit } =
      params ?? {}

    return api.get<Hotel[]>("/hotels", {
      q: destination,
      pricePerNight_gte: minPrice,
      pricePerNight_lte: maxPrice,
      rating_gte: minRating,
      propertyType: propertyType?.length === 1 ? propertyType[0] : undefined,
      _sort: sortBy ? SORT_FIELD[sortBy] : undefined,
      _order: sortBy === "price_desc" ? "desc" : "asc",
      _page: page,
      _limit: limit ?? 12,
    })
  },

  getHotelById: (id: number) => api.get<Hotel>(`/hotels/${id}`),

  getRoomsByHotel: (hotelId: number) => api.get<Room[]>("/rooms", { hotelId }),

  getReviewsByHotel: (hotelId: number, page?: number) =>
    api.get<Review[]>("/reviews", { hotelId, _page: page, _limit: 5 }),
}
