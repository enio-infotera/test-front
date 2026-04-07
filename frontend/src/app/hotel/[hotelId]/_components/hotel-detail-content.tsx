"use client"

import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { PhotoGallery } from "@/components/hotel/photo-gallery"
import { ReviewsSection } from "@/components/hotel/reviews-section"
import { RoomCard, RoomCardSkeleton } from "@/components/hotel/room-card"
import { hotelApi } from "@/lib/hotel-api"
import { BLUR_DATA_URL } from "@/lib/image-placeholder"
import { useSearchStore } from "@/store/search-store"
import type { Amenity, Hotel } from "@/types/api"

const AMENITY_LABELS: Partial<Record<Amenity, string>> = {
  wifi: "Wi-Fi",
  pool: "Piscina",
  spa: "Spa",
  restaurant: "Restaurante",
  gym: "Academia",
  parking: "Estacionamento",
  bar: "Bar",
  room_service: "Room service",
  beach_access: "Acesso à praia",
  kids_club: "Kids Club",
  business_center: "Centro de negócios",
  concierge: "Concierge",
  valet: "Manobrista",
  breakfast: "Café da manhã",
}

const CANCELLATION_CONFIG: Record<
  Hotel["cancellationPolicy"],
  { label: string; color: string; description: string }
> = {
  free: {
    label: "Cancelamento grátis",
    color: "text-green-600 bg-green-50 border-green-200",
    description: "Cancele sem custo até 24h antes do check-in.",
  },
  moderate: {
    label: "Cancelamento moderado",
    color: "text-yellow-700 bg-yellow-50 border-yellow-200",
    description: "Reembolso parcial até 5 dias antes do check-in.",
  },
  strict: {
    label: "Não reembolsável",
    color: "text-red-600 bg-red-50 border-red-200",
    description: "Esta reserva não pode ser cancelada após a confirmação.",
  },
}

const PROPERTY_TYPE_LABELS: Record<Hotel["propertyType"], string> = {
  hotel: "Hotel",
  pousada: "Pousada",
  resort: "Resort",
}

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < Math.floor(value) ? "text-amber-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function SimilarHotelCard({ hotel }: { hotel: Hotel }) {
  const cancellationColor: Record<Hotel["cancellationPolicy"], string> = {
    free: "text-green-600",
    moderate: "text-yellow-600",
    strict: "text-red-500",
  }
  const cancellationLabel: Record<Hotel["cancellationPolicy"], string> = {
    free: "Cancelamento grátis",
    moderate: "Cancelamento moderado",
    strict: "Não reembolsável",
  }

  return (
    <Link
      href={`/hotel/${hotel.id}`}
      className="group flex gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 overflow-hidden p-3"
    >
      <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden">
        <Image
          src={hotel.thumbnail}
          alt={hotel.name}
          fill
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="96px"
        />
      </div>

      <div className="flex flex-col flex-1 min-w-0 justify-between py-0.5">
        <div>
          <div className="flex items-center gap-1 mb-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 ${i < Math.floor(hotel.rating) ? "text-amber-400" : "text-gray-200"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-xs text-slate-500 ml-0.5">{hotel.rating.toFixed(1)}</span>
          </div>
          <p className="font-semibold text-slate-900 text-sm leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
            {hotel.name}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">{hotel.destination}</p>
        </div>

        <div className="flex items-end justify-between mt-2">
          <div>
            <span className="text-xs font-bold text-slate-900">
              {hotel.pricePerNight.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </span>
            <span className="text-xs text-slate-400">/noite</span>
          </div>
          <span className={`text-xs font-medium ${cancellationColor[hotel.cancellationPolicy]}`}>
            {cancellationLabel[hotel.cancellationPolicy]}
          </span>
        </div>
      </div>
    </Link>
  )
}

interface HotelDetailContentProps {
  hotelId: number
}

export function HotelDetailContent({ hotelId }: HotelDetailContentProps) {
  const searchParams = useSearchParams()
  const { lastSearch } = useSearchStore()

  const checkIn = searchParams.get("checkIn") || lastSearch?.checkIn || ""
  const checkOut = searchParams.get("checkOut") || lastSearch?.checkOut || ""
  const guests =
    Number(searchParams.get("adults") ?? lastSearch?.adults ?? 2) +
    Number(searchParams.get("children") ?? lastSearch?.children ?? 0)
  const rooms = Number(searchParams.get("rooms") ?? lastSearch?.rooms ?? 1)
  const [copied, setCopied] = useState(false)

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const {
    data: hotel,
    isLoading: hotelLoading,
    isError: hotelError,
  } = useQuery({
    queryKey: ["hotel", hotelId],
    queryFn: () => hotelApi.getHotelById(hotelId),
    staleTime: 5 * 60 * 1000,
  })

  const { data: roomList = [], isLoading: roomsLoading } = useQuery({
    queryKey: ["rooms", hotelId],
    queryFn: () => hotelApi.getRoomsByHotel(hotelId),
    staleTime: 5 * 60 * 1000,
  })

  const { data: allHotels = [] } = useQuery({
    queryKey: ["hotels", "all"],
    queryFn: () => hotelApi.getHotels({ limit: 100 }),
    staleTime: 10 * 60 * 1000,
  })

  const similarHotels = allHotels
    .filter(
      (h) =>
        h.id !== hotelId &&
        (h.destination === hotel?.destination || h.propertyType === hotel?.propertyType)
    )
    .slice(0, 3)

  if (hotelError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-slate-600 mb-4">Não foi possível carregar o hotel.</p>
        <Link
          href="/search"
          className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
        >
          Voltar para busca
        </Link>
      </div>
    )
  }

  if (hotelLoading) return <HotelDetailSkeleton />

  if (!hotel) return null

  const cancellation = CANCELLATION_CONFIG[hotel.cancellationPolicy]

  return (
    <main className="flex-1 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Início
          </Link>
          <span>›</span>
          <Link
            href={`/search?destination=${encodeURIComponent(hotel.destination)}`}
            className="hover:text-blue-600 transition-colors"
          >
            {hotel.destination}
          </Link>
          <span>›</span>
          <span className="text-slate-600 truncate">{hotel.name}</span>
        </nav>

        <div className="mb-8">
          <PhotoGallery images={hotel.images} hotelName={hotel.name} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-10">
            <section>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-1 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-full">
                      {PROPERTY_TYPE_LABELS[hotel.propertyType]}
                    </span>
                    {hotel.availableRooms <= 3 && (
                      <span className="px-2.5 py-1 text-xs font-semibold text-orange-700 bg-orange-100 rounded-full">
                        Apenas {hotel.availableRooms}{" "}
                        {hotel.availableRooms === 1 ? "quarto disponível" : "quartos disponíveis"}!
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                    {hotel.name}
                  </h1>
                </div>
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center gap-1.5 shrink-0 px-3 py-2 text-sm font-medium text-slate-600 border border-gray-200 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-colors"
                  aria-label="Compartilhar link"
                >
                  {copied ? (
                    <>
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-green-600 text-xs">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                      </svg>
                      <span className="text-xs">Compartilhar</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <StarRating value={hotel.rating} />
                <span className="font-semibold text-slate-800">{hotel.rating.toFixed(1)}</span>
                <span className="text-slate-400 text-sm">
                  ({hotel.reviewCount.toLocaleString("pt-BR")} avaliações)
                </span>
              </div>

              <p className="flex items-center gap-1.5 text-sm text-slate-500 mb-4">
                <svg
                  className="w-4 h-4 shrink-0"
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
                {hotel.address}
              </p>

              <p className="text-slate-600 leading-relaxed">{hotel.description}</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Comodidades</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {hotel.amenities.map((a) => {
                  const label = AMENITY_LABELS[a]
                  if (!label) return null
                  return (
                    <div
                      key={a}
                      className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl text-sm text-slate-700"
                    >
                      <svg
                        className="w-4 h-4 text-blue-500 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {label}
                    </div>
                  )
                })}
              </div>
            </section>

            <section id="quartos">
              <h2 className="text-xl font-bold text-slate-900 mb-5">Quartos disponíveis</h2>
              <div className="space-y-4">
                {roomsLoading
                  ? Array.from({ length: 2 }).map((_, i) => <RoomCardSkeleton key={i} />)
                  : roomList.map((room) => (
                      <RoomCard
                        key={room.id}
                        room={room}
                        hotel={hotel}
                        checkIn={checkIn}
                        checkOut={checkOut}
                        guests={guests}
                        rooms={rooms}
                      />
                    ))}
                {!roomsLoading && roomList.length === 0 && (
                  <p className="text-slate-400 text-sm py-4 text-center">
                    Nenhum quarto disponível.
                  </p>
                )}
              </div>
            </section>

            <ReviewsSection hotelId={hotel.id} total={hotel.reviewCount} />

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Localização</h2>
              <p className="flex items-center gap-1.5 text-sm text-slate-500 mb-3">
                <svg
                  className="w-4 h-4 shrink-0"
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
                {hotel.address}
              </p>
              <div className="overflow-hidden rounded-2xl border border-gray-200">
                <iframe
                  title={`Mapa - ${hotel.name}`}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${hotel.longitude - 0.015},${hotel.latitude - 0.01},${hotel.longitude + 0.015},${hotel.latitude + 0.01}&layer=mapnik&marker=${hotel.latitude},${hotel.longitude}`}
                  className="w-full h-64"
                  loading="lazy"
                />
              </div>
              <a
                href={`https://www.openstreetmap.org/?mlat=${hotel.latitude}&mlon=${hotel.longitude}#map=15/${hotel.latitude}/${hotel.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs text-blue-600 hover:underline"
              >
                Ver no mapa maior ↗
              </a>
            </section>

            {similarHotels.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Hotéis similares</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {similarHotels.map((h) => (
                    <SimilarHotelCard key={h.id} hotel={h} />
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <p className="text-xs text-slate-400 mb-1">A partir de</p>
                <p className="text-3xl font-extrabold text-slate-900 mb-1">
                  {hotel.pricePerNight.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
                <p className="text-sm text-slate-400 mb-5">por noite</p>

                <div className="flex gap-2 text-sm text-slate-600 mb-4">
                  <div className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5">
                    <p className="text-xs text-slate-400">Check-in</p>
                    <p className="font-medium">
                      {checkIn ? new Date(`${checkIn}T12:00`).toLocaleDateString("pt-BR") : "—"}
                    </p>
                  </div>
                  <div className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5">
                    <p className="text-xs text-slate-400">Check-out</p>
                    <p className="font-medium">
                      {checkOut ? new Date(`${checkOut}T12:00`).toLocaleDateString("pt-BR") : "—"}
                    </p>
                  </div>
                </div>

                <a
                  href="#quartos"
                  className="block w-full text-center py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Ver quartos
                </a>
              </div>

              <div className={`rounded-2xl border p-4 ${cancellation.color}`}>
                <p className="font-semibold text-sm mb-1">{cancellation.label}</p>
                <p className="text-xs leading-relaxed opacity-80">{cancellation.description}</p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 text-sm text-slate-600 space-y-2">
                <div className="flex justify-between">
                  <span>Check-in</span>
                  <span className="font-medium text-slate-800">{hotel.checkInTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-out</span>
                  <span className="font-medium text-slate-800">{hotel.checkOutTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function HotelDetailSkeleton() {
  return (
    <main className="flex-1 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
        <div className="h-[420px] bg-gray-200 rounded-2xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-3">
              <div className="h-8 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-100 rounded w-1/3" />
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-4/5" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="h-64 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    </main>
  )
}
