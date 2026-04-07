"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { BLUR_DATA_URL } from "@/lib/image-placeholder"
import { useBookingStore } from "@/store/booking-store"
import type { Hotel, Room, RoomAmenity } from "@/types/api"

const BED_LABELS: Record<Room["beds"][number]["type"], string> = {
  single: "Solteiro",
  double: "Casal",
  queen: "Queen",
  king: "King",
  twin: "Twin",
  sofa_bed: "Sofá-cama",
}

const ROOM_AMENITY_LABELS: Partial<Record<RoomAmenity, string>> = {
  ocean_view: "Vista para o mar",
  city_view: "Vista para a cidade",
  garden_view: "Vista para o jardim",
  balcony: "Varanda",
  terrace: "Terraço",
  bathtub: "Banheira",
  minibar: "Frigobar",
  safe: "Cofre",
  aircon: "Ar-condicionado",
  desk: "Mesa de trabalho",
  kitchen: "Cozinha",
  living_room: "Sala de estar",
}

interface RoomCardProps {
  room: Room
  hotel: Hotel
  checkIn: string
  checkOut: string
  guests: number
  rooms: number
}

function nights(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 1
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime()
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)))
}

export function RoomCard({ room, hotel, checkIn, checkOut, guests, rooms }: RoomCardProps) {
  const router = useRouter()
  const { setSelection } = useBookingStore()

  const nightCount = nights(checkIn, checkOut)
  const total = room.pricePerNight * nightCount

  function handleSelect() {
    setSelection({ hotel, room, checkIn, checkOut, guests, rooms })
    router.push("/checkout")
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
      {room.images[0] && (
        <div className="relative w-full md:w-52 h-44 md:h-auto shrink-0">
          <Image
            src={room.images[0]}
            alt={room.name}
            fill
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 208px"
          />
        </div>
      )}

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="font-bold text-slate-900 text-base">{room.name}</h3>
          {room.available <= 3 && (
            <span className="shrink-0 px-2.5 py-1 text-xs font-semibold text-orange-700 bg-orange-100 rounded-full">
              Apenas {room.available} {room.available === 1 ? "quarto" : "quartos"}!
            </span>
          )}
        </div>

        <p className="text-sm text-slate-500 mb-3 leading-relaxed">{room.description}</p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-3">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
            {room.size} m²
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Até {room.maxGuests} hóspedes
          </span>
          {room.beds.map((bed) => (
            <span key={`${bed.type}-${bed.quantity}`} className="flex items-center gap-1">
              {bed.quantity}× {BED_LABELS[bed.type]}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {room.amenities.slice(0, 6).map((a) =>
            ROOM_AMENITY_LABELS[a] ? (
              <span
                key={a}
                className="px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600"
              >
                {ROOM_AMENITY_LABELS[a]}
              </span>
            ) : null
          )}
        </div>

        <div className="flex items-end justify-between mt-auto pt-4 border-t border-gray-100">
          <div>
            <p className="text-xl font-extrabold text-slate-900">
              {room.pricePerNight.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              <span className="text-xs font-normal text-slate-400 ml-1">/noite</span>
            </p>
            {nightCount > 1 && (
              <p className="text-xs text-slate-400">
                Total: {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} (
                {nightCount} noites)
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleSelect}
            disabled={room.available === 0}
            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {room.available === 0 ? "Indisponível" : "Selecionar quarto"}
          </button>
        </div>
      </div>
    </div>
  )
}

export function RoomCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row animate-pulse">
      <div className="w-full md:w-52 h-44 bg-gray-200 shrink-0" />
      <div className="flex-1 p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-100 rounded w-3/4" />
        <div className="flex gap-2">
          <div className="h-5 bg-gray-100 rounded-full w-16" />
          <div className="h-5 bg-gray-100 rounded-full w-20" />
        </div>
        <div className="flex justify-between items-end pt-3 border-t border-gray-100">
          <div className="h-6 bg-gray-200 rounded w-24" />
          <div className="h-10 bg-gray-200 rounded-xl w-36" />
        </div>
      </div>
    </div>
  )
}
