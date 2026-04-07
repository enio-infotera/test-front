import { Suspense } from "react"
 import { ErrorBoundary } from "@/components/ui/error-boundary"
import { SearchContent } from "./_components/search-content"

export const metadata = {
  title: "Buscar Hotéis — HotelBook",
  description: "Encontre e compare hotéis, resorts e pousadas no Brasil.",
}

export default function SearchPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<SearchFallback />}>
        <SearchContent />
      </Suspense>
    </ErrorBoundary>
  )
}

function SearchFallback() {
  return (
    <main className="flex-1 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="flex gap-7">
          <div className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="flex gap-2">
                    <div className="h-7 bg-gray-100 rounded-full w-16" />
                    <div className="h-7 bg-gray-100 rounded-full w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                <div className="h-52 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-6 bg-gray-200 rounded w-24" />
                    <div className="h-9 bg-gray-200 rounded-xl w-28" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
