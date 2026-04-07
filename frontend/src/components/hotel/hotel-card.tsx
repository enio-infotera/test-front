"use client"

import { useQueryClient } from "@tanstack/react-query"
import Image from "next/image"
import Link from "next/link"
import { hotelApi } from "@/lib/hotel-api"
import { BLUR_DATA_URL } from "@/lib/image-placeholder"
import type { Amenity, Hotel } from "@/types/api"

const AMENITY_LABELS: Partial<Record<Amenity, string>> = {
  wifi: "Wi-Fi",
  pool: "Piscina",
  spa: "Spa",
  restaurant: "Restaurante",
  gym: "Academia",
  parking: "Estacionamento",
  bar: "Bar",
  beach_access: "Praia",
  breakfast: "Café da manhã",
  kids_club: "Kids Club",
}

const PROPERTY_TYPE_LABELS: Record<Hotel["propertyType"], string> = {
  hotel: "Hotel",
  pousada: "Pousada",
  resort: "Resort",
}

const CANCELLATION_LABELS: Record<Hotel["cancellationPolicy"], { label: string; color: string }> = {
  free: { label: "Cancelamento grátis", color: "text-green-600" },
  moderate: { label: "Cancelamento moderado", color: "text-yellow-600" },
  strict: { label: "Não reembolsável", color: "text-red-500" },
}

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i < Math.floor(value) ? "text-amber-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export function HotelCard({ hotel }: { hotel: Hotel }) {
  const cancellation = CANCELLATION_LABELS[hotel.cancellationPolicy]
  const visibleAmenities = hotel.amenities.slice(0, 4)
  const queryClient = useQueryClient()

  function handleMouseEnter() {
    queryClient.prefetchQuery({
      queryKey: ["hotel", hotel.id],
      queryFn: () => hotelApi.getHotelById(hotel.id),
      staleTime: 5 * 60 * 1000,
    })
    queryClient.prefetchQuery({
      queryKey: ["rooms", hotel.id],
      queryFn: () => hotelApi.getRoomsByHotel(hotel.id),
      staleTime: 5 * 60 * 1000,
    })
  }

  return (
    <Link
      href={`/hotel/${hotel.id}`}
      onMouseEnter={handleMouseEnter}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative h-52 overflow-hidden shrink-0">
        <Image
          src={hotel.thumbnail}
          alt={hotel.name}
          fill
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold text-white bg-black/40 backdrop-blur-sm rounded-full capitalize">
          {PROPERTY_TYPE_LABELS[hotel.propertyType]}
        </span>
        {hotel.availableRooms <= 3 && (
          <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold text-orange-700 bg-orange-100 rounded-full">
            Apenas {hotel.availableRooms} {hotel.availableRooms === 1 ? "quarto" : "quartos"}!
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 mb-2">
          <StarRating value={hotel.rating} />
          <span className="text-xs text-slate-500">
            {hotel.rating.toFixed(1)} ({hotel.reviewCount.toLocaleString("pt-BR")})
          </span>
        </div>

        <h3 className="font-bold text-slate-900 text-base leading-snug mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
          {hotel.name}
        </h3>

        <p className="text-sm text-slate-500 mb-3 flex items-center gap-1">
          <svg
            className="w-3.5 h-3.5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {hotel.destination}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {visibleAmenities.map((a) =>
            AMENITY_LABELS[a] ? (
              <span
                key={a}
                className="px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600"
              >
                {AMENITY_LABELS[a]}
              </span>
            ) : null
          )}
        </div>

        <p className={`text-xs mb-4 ${cancellation.color}`}>{cancellation.label}</p>

        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-xl font-extrabold text-slate-900">
              {hotel.pricePerNight.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </span>
            <span className="text-xs text-slate-400 ml-1">/noite</span>
          </div>
          <span className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl group-hover:bg-blue-700 transition-colors whitespace-nowrap">
            Ver detalhes
          </span>
        </div>
      </div>
    </Link>
  )
}

export function HotelCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
      <div className="h-52 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-3.5 h-3.5 bg-gray-200 rounded" />
          ))}
          <div className="h-3.5 bg-gray-100 rounded w-20 ml-1" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="flex gap-2">
          <div className="h-5 bg-gray-100 rounded-full w-14" />
          <div className="h-5 bg-gray-100 rounded-full w-16" />
          <div className="h-5 bg-gray-100 rounded-full w-12" />
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-gray-200 rounded w-24" />
          <div className="h-9 bg-gray-200 rounded-xl w-28" />
        </div>
      </div>
    </div>
  )
}
