"use client"

import type { HotelFilters as HotelFiltersType } from "@/hooks/use-hotel-filters"
import type { Amenity, Hotel } from "@/types/api"

const AMENITY_OPTIONS: { value: Amenity; label: string }[] = [
  { value: "wifi", label: "Wi-Fi" },
  { value: "pool", label: "Piscina" },
  { value: "spa", label: "Spa" },
  { value: "gym", label: "Academia" },
  { value: "restaurant", label: "Restaurante" },
  { value: "parking", label: "Estacionamento" },
  { value: "bar", label: "Bar" },
  { value: "breakfast", label: "Café da manhã" },
  { value: "beach_access", label: "Acesso à praia" },
  { value: "kids_club", label: "Kids Club" },
]

const PROPERTY_TYPE_OPTIONS: { value: Hotel["propertyType"]; label: string }[] = [
  { value: "hotel", label: "Hotel" },
  { value: "pousada", label: "Pousada" },
  { value: "resort", label: "Resort" },
]

const RATING_OPTIONS = [
  { value: 4.5, label: "4.5+" },
  { value: 4, label: "4.0+" },
  { value: 3.5, label: "3.5+" },
  { value: 0, label: "Todos" },
]

interface HotelFiltersProps {
  filters: HotelFiltersType
  onFiltersChange: (updates: Partial<HotelFiltersType>) => void
  onClose?: () => void
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <h3 className="text-sm font-semibold text-slate-800 mb-3">{title}</h3>
      {children}
    </div>
  )
}

export function HotelFilters({ filters, onFiltersChange, onClose }: HotelFiltersProps) {
  function togglePropertyType(type: Hotel["propertyType"]) {
    const current = filters.propertyTypes
    const next = current.includes(type) ? current.filter((t) => t !== type) : [...current, type]
    onFiltersChange({ propertyTypes: next })
  }

  function toggleAmenity(amenity: Amenity) {
    const current = filters.amenities
    const next = current.includes(amenity)
      ? current.filter((a) => a !== amenity)
      : [...current, amenity]
    onFiltersChange({ amenities: next })
  }

  function handleReset() {
    onFiltersChange({
      minPrice: 0,
      maxPrice: 5000,
      minRating: 0,
      amenities: [],
      propertyTypes: [],
    })
  }

  const hasActiveFilters =
    filters.minPrice > 0 ||
    filters.maxPrice < 5000 ||
    filters.minRating > 0 ||
    filters.amenities.length > 0 ||
    filters.propertyTypes.length > 0

  return (
    <aside className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-bold text-slate-900">Filtros</h2>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              Limpar
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 text-slate-500 lg:hidden"
              aria-label="Fechar filtros"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <FilterSection title="Tipo de propriedade">
        <div className="flex flex-wrap gap-2">
          {PROPERTY_TYPE_OPTIONS.map((opt) => {
            const active = filters.propertyTypes.includes(opt.value)
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => togglePropertyType(opt.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  active
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-600 border-gray-200 hover:border-blue-300"
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </FilterSection>

      <FilterSection title="Avaliação mínima">
        <div className="flex flex-wrap gap-2">
          {RATING_OPTIONS.map((opt) => {
            const active = filters.minRating === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onFiltersChange({ minRating: opt.value })}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  active
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-600 border-gray-200 hover:border-blue-300"
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </FilterSection>

      <FilterSection title="Faixa de preço (por noite)">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label htmlFor="price-min" className="text-xs text-slate-500 mb-1 block">Mín.</label>
              <input
                id="price-min"
                type="number"
                min={0}
                max={filters.maxPrice - 50}
                step={50}
                value={filters.minPrice}
                onChange={(e) => onFiltersChange({ minPrice: Number(e.target.value) })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <span className="text-slate-300 mt-5">—</span>
            <div className="flex-1">
              <label htmlFor="price-max" className="text-xs text-slate-500 mb-1 block">Máx.</label>
              <input
                id="price-max"
                type="number"
                min={filters.minPrice + 50}
                max={5000}
                step={50}
                value={filters.maxPrice}
                onChange={(e) => onFiltersChange({ maxPrice: Number(e.target.value) })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <p className="text-xs text-slate-400 text-center">
            {filters.minPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} –{" "}
            {filters.maxPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </p>
        </div>
      </FilterSection>

      <FilterSection title="Comodidades">
        <div className="space-y-2">
          {AMENITY_OPTIONS.map((opt) => {
            const active = filters.amenities.includes(opt.value)
            return (
              <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => toggleAmenity(opt.value)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                  {opt.label}
                </span>
              </label>
            )
          })}
        </div>
      </FilterSection>
    </aside>
  )
}
