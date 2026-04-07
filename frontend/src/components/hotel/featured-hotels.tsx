"use client"

import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { HotelCard, HotelCardSkeleton } from "@/components/hotel/hotel-card"
import { api } from "@/lib/api-client"
import type { Hotel } from "@/types/api"

export function FeaturedHotels() {
  const {
    data: hotels,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["hotels", "featured"],
    queryFn: () => api.get<Hotel[]>("/hotels", { featured: true, _limit: 3 }),
    staleTime: 5 * 60 * 1000,
  })

  return (
    <section className="px-4 py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-1">
              Selecionados para você
            </p>
            <h2 className="text-3xl font-bold text-slate-900">Hotéis em destaque</h2>
          </div>
          <Link
            href="/search"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Ver todos
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading && Array.from({ length: 3 }).map((_, i) => <HotelCardSkeleton key={i} />)}

          {isError && (
            <div className="col-span-3 text-center py-12 text-slate-400">
              Não foi possível carregar os hotéis em destaque.
            </div>
          )}

          {hotels?.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors"
          >
            Ver todos os hotéis
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
