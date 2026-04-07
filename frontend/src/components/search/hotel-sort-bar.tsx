"use client"

import type { SortOption } from "@/types/api"

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Mais popular" },
  { value: "price_asc", label: "Menor preço" },
  { value: "price_desc", label: "Maior preço" },
  { value: "rating", label: "Melhor avaliação" },
]

interface HotelSortBarProps {
  total: number
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  onOpenFilters: () => void
  hasActiveFilters: boolean
}

export function HotelSortBar({
  total,
  sortBy,
  onSortChange,
  onOpenFilters,
  hasActiveFilters,
}: HotelSortBarProps) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <p className="text-sm text-slate-500">
        <span className="font-semibold text-slate-900">{total}</span>{" "}
        {total === 1 ? "hotel encontrado" : "hotéis encontrados"}
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenFilters}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors lg:hidden ${
            hasActiveFilters
              ? "border-blue-600 text-blue-600 bg-blue-50"
              : "border-gray-200 text-slate-600 hover:border-blue-300"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
            />
          </svg>
          Filtros
          {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-blue-600" />}
        </button>

        <div className="flex items-center gap-2">
          <label
            htmlFor="sort-select"
            className="text-sm text-slate-500 whitespace-nowrap hidden sm:block"
          >
            Ordenar por:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
