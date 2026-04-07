"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo } from "react"
import type { Amenity, Hotel, HotelSearchParams } from "@/types/api"

export type SortOption = "price_asc" | "price_desc" | "rating" | "popular"

export interface HotelFilters {
  destination: string
  checkIn: string
  checkOut: string
  minPrice: number
  maxPrice: number
  minRating: number
  amenities: Amenity[]
  propertyTypes: Hotel["propertyType"][]
  sortBy: SortOption
  page: number
}

const DEFAULTS: HotelFilters = {
  destination: "",
  checkIn: "",
  checkOut: "",
  minPrice: 0,
  maxPrice: 5000,
  minRating: 0,
  amenities: [],
  propertyTypes: [],
  sortBy: "popular",
  page: 1,
}

function parseList<T>(value: string | null): T[] {
  if (!value) return []
  return value.split(",").filter(Boolean) as T[]
}

export function useHotelFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const filters: HotelFilters = useMemo(
    () => ({
      destination: searchParams.get("destination") ?? DEFAULTS.destination,
      checkIn: searchParams.get("checkIn") ?? DEFAULTS.checkIn,
      checkOut: searchParams.get("checkOut") ?? DEFAULTS.checkOut,
      minPrice: Number(searchParams.get("minPrice") ?? DEFAULTS.minPrice),
      maxPrice: Number(searchParams.get("maxPrice") ?? DEFAULTS.maxPrice),
      minRating: Number(searchParams.get("minRating") ?? DEFAULTS.minRating),
      amenities: parseList<Amenity>(searchParams.get("amenities")),
      propertyTypes: parseList<Hotel["propertyType"]>(searchParams.get("propertyTypes")),
      sortBy: (searchParams.get("sortBy") as SortOption) ?? DEFAULTS.sortBy,
      page: Number(searchParams.get("page") ?? DEFAULTS.page),
    }),
    [searchParams]
  )

  const setFilters = useCallback(
    (updates: Partial<HotelFilters>) => {
      const next = new URLSearchParams(searchParams.toString())
      const merged = { ...filters, ...updates, page: updates.page ?? 1 }

      const entries: Array<[string, string]> = [
        ["destination", merged.destination],
        ["checkIn", merged.checkIn],
        ["checkOut", merged.checkOut],
        ["minPrice", String(merged.minPrice)],
        ["maxPrice", String(merged.maxPrice)],
        ["minRating", String(merged.minRating)],
        ["amenities", merged.amenities.join(",")],
        ["propertyTypes", merged.propertyTypes.join(",")],
        ["sortBy", merged.sortBy],
        ["page", String(merged.page)],
      ]

      for (const [key, value] of entries) {
        if (!value || value === "0" || value === String(DEFAULTS[key as keyof HotelFilters])) {
          next.delete(key)
        } else {
          next.set(key, value)
        }
      }

      router.push(`/search?${next.toString()}`, { scroll: false })
    },
    [filters, router, searchParams]
  )

  const toApiParams = useCallback(
    (): HotelSearchParams => ({
      destination: filters.destination || undefined,
      checkIn: filters.checkIn || undefined,
      checkOut: filters.checkOut || undefined,
      minPrice: filters.minPrice > 0 ? filters.minPrice : undefined,
      maxPrice: filters.maxPrice < DEFAULTS.maxPrice ? filters.maxPrice : undefined,
      minRating: filters.minRating > 0 ? filters.minRating : undefined,
      sortBy: filters.sortBy,
    }),
    [filters]
  )

  return { filters, setFilters, toApiParams, DEFAULTS }
}
