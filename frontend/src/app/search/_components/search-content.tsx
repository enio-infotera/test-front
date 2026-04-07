"use client"

import { useQuery } from "@tanstack/react-query"
import { useLayoutEffect, useRef, useState } from "react"
import { useWindowVirtualizer } from "@tanstack/react-virtual"
import { useSearchParams } from "next/navigation"
import { hotelApi } from "@/lib/hotel-api"
import { useHotelFilters } from "@/hooks/use-hotel-filters"
import type { SortOption } from "@/hooks/use-hotel-filters"
import { HotelCard, HotelCardSkeleton } from "@/components/hotel/hotel-card"
import { HotelFilters } from "@/components/search/hotel-filters"
import { HotelSortBar } from "@/components/search/hotel-sort-bar"
import type { Hotel } from "@/types/api"

const COLS = 3

function applyClientFilters(hotels: Hotel[], filters: ReturnType<typeof useHotelFilters>["filters"]): Hotel[] {
  return hotels.filter((hotel) => {
    if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(hotel.propertyType)) return false
    if (filters.amenities.length > 0 && !filters.amenities.every((a) => hotel.amenities.includes(a))) return false
    if (filters.minPrice > 0 && hotel.pricePerNight < filters.minPrice) return false
    if (filters.maxPrice < 5000 && hotel.pricePerNight > filters.maxPrice) return false
    if (filters.minRating > 0 && hotel.rating < filters.minRating) return false
    return true
  })
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">Nenhum hotel encontrado</h3>
      <p className="text-sm text-slate-500 mb-5 max-w-xs">
        Tente ajustar os filtros ou buscar em outro destino.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
      >
        Limpar filtros
      </button>
    </div>
  )
}

function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void }) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex items-center justify-center gap-1 pt-8">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-slate-600 hover:border-blue-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Página anterior"
      >
        ‹
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
            p === page
              ? "bg-blue-600 text-white border border-blue-600"
              : "border border-gray-200 text-slate-600 hover:border-blue-300"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-slate-600 hover:border-blue-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Próxima página"
      >
        ›
      </button>
    </div>
  )
}

export function SearchContent() {
  const { filters, setFilters, toApiParams } = useHotelFilters()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const [scrollMargin, setScrollMargin] = useState(0)

  const { data: allHotels = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["hotels", "search", toApiParams()],
    queryFn: () => hotelApi.getHotels({ ...toApiParams(), limit: 100 }),
    staleTime: 2 * 60 * 1000,
  })

  const filtered = applyClientFilters(allHotels, filters)

  // Group into rows of COLS for virtualization
  const rows: Hotel[][] = []
  for (let i = 0; i < filtered.length; i += COLS) {
    rows.push(filtered.slice(i, i + COLS))
  }

  useLayoutEffect(() => {
    if (listRef.current) {
      setScrollMargin(listRef.current.offsetTop)
    }
  }, [filtered.length, isLoading])

  const rowVirtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: () => 440,
    overscan: 3,
    scrollMargin,
  })

  const hasActiveFilters =
    filters.minPrice > 0 ||
    filters.maxPrice < 5000 ||
    filters.minRating > 0 ||
    filters.amenities.length > 0 ||
    filters.propertyTypes.length > 0

  function handleReset() {
    setFilters({
      minPrice: 0,
      maxPrice: 5000,
      minRating: 0,
      amenities: [],
      propertyTypes: [],
    })
  }

  return (
    <main className="flex-1 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {filters.destination && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">
              Hotéis em{" "}
              <span className="text-blue-600">{filters.destination}</span>
            </h1>
            {filters.checkIn && filters.checkOut && (
              <p className="text-sm text-slate-500 mt-1">
                {new Date(filters.checkIn).toLocaleDateString("pt-BR")} →{" "}
                {new Date(filters.checkOut).toLocaleDateString("pt-BR")}
              </p>
            )}
          </div>
        )}

        <div className="flex gap-7">
          <div className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <HotelFilters filters={filters} onFiltersChange={setFilters} />
            </div>
          </div>

          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setMobileFiltersOpen(false)}
              />
              <div className="absolute inset-y-0 left-0 w-80 bg-white overflow-y-auto shadow-2xl p-5">
                <HotelFilters
                  filters={filters}
                  onFiltersChange={(updates) => {
                    setFilters(updates)
                    setMobileFiltersOpen(false)
                  }}
                  onClose={() => setMobileFiltersOpen(false)}
                />
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="mb-5">
              <HotelSortBar
                total={filtered.length}
                sortBy={filters.sortBy}
                onSortChange={(sort: SortOption) => setFilters({ sortBy: sort })}
                onOpenFilters={() => setMobileFiltersOpen(true)}
                hasActiveFilters={hasActiveFilters}
              />
            </div>

            {isError && (
              <div className="flex flex-col items-center py-16 text-center">
                <p className="text-slate-600 mb-4">Erro ao carregar hotéis.</p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Tentar novamente
                </button>
              </div>
            )}

            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <HotelCardSkeleton key={i} />
                ))}
              </div>
            )}

            {!isLoading && !isError && filtered.length === 0 && (
              <EmptyState onReset={handleReset} />
            )}

            {!isLoading && !isError && rows.length > 0 && (
              <div
                ref={listRef}
                style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: "relative" }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => (
                  <div
                    key={virtualRow.index}
                    data-index={virtualRow.index}
                    ref={rowVirtualizer.measureElement}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      transform: `translateY(${virtualRow.start - rowVirtualizer.options.scrollMargin}px)`,
                    }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 pb-5">
                      {rows[virtualRow.index].map((hotel) => (
                        <HotelCard key={hotel.id} hotel={hotel} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
