import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface SearchParams {
  destination: string
  checkIn: string
  checkOut: string
  adults: number
  children: number
  rooms: number
}

interface RecentSearch {
  id: string
  destination: string
  checkIn: string
  checkOut: string
  adults: number
  children: number
  rooms: number
  searchedAt: string
}

interface SearchStore {
  lastSearch: SearchParams | null
  recentSearches: RecentSearch[]
  setLastSearch: (params: SearchParams) => void
  addRecentSearch: (params: SearchParams) => void
  clearRecentSearches: () => void
}

const DEFAULT_SEARCH: SearchParams = {
  destination: "",
  checkIn: "",
  checkOut: "",
  adults: 2,
  children: 0,
  rooms: 1,
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set) => ({
      lastSearch: null,
      recentSearches: [],

      setLastSearch: (params) => set({ lastSearch: params }),

      addRecentSearch: (params) =>
        set((state) => {
          const entry: RecentSearch = {
            id: crypto.randomUUID(),
            ...params,
            searchedAt: new Date().toISOString(),
          }
          const filtered = state.recentSearches.filter(
            (s) => s.destination !== params.destination
          )
          return { recentSearches: [entry, ...filtered].slice(0, 5) }
        }),

      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: "hotel-search",
      partialize: (state) => ({
        lastSearch: state.lastSearch,
        recentSearches: state.recentSearches,
      }),
    }
  )
)

export { DEFAULT_SEARCH }
