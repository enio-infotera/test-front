import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Hotel, Room } from "@/types/api"

interface BookingSelection {
  hotel: Hotel
  room: Room
  checkIn: string
  checkOut: string
  guests: number
  rooms: number
}

export interface BookingDetails {
  subtotal: number
  taxes: number
  discount: number
  discountRate: number
  total: number
  nights: number
}

interface BookingStore {
  selection: BookingSelection | null
  bookingDetails: BookingDetails | null
  setSelection: (selection: BookingSelection) => void
  setBookingDetails: (details: BookingDetails) => void
  clearSelection: () => void
}

export const useBookingStore = create<BookingStore>()(
  persist(
    (set) => ({
      selection: null,
      bookingDetails: null,
      setSelection: (selection) => set({ selection }),
      setBookingDetails: (bookingDetails) => set({ bookingDetails }),
      clearSelection: () => set({ selection: null, bookingDetails: null }),
    }),
    {
      name: "hotel-booking-selection",
    }
  )
)
