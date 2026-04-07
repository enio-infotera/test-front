import { Suspense } from "react"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { HotelDetailContent } from "./_components/hotel-detail-content"

interface HotelPageProps {
  params: Promise<{ hotelId: string }>
}

export default async function HotelPage({ params }: HotelPageProps) {
  const { hotelId } = await params
  const id = Number(hotelId)

  return (
    <ErrorBoundary>
      <Suspense fallback={<HotelPageFallback />}>
        <HotelDetailContent hotelId={id} />
      </Suspense>
    </ErrorBoundary>
  )
}

function HotelPageFallback() {
  return (
    <main className="flex-1 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
        <div className="h-[420px] bg-gray-200 rounded-2xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-100 rounded w-1/3" />
            <div className="h-4 bg-gray-100 rounded w-full" />
          </div>
          <div className="h-64 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    </main>
  )
}
