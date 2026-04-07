"use client"

import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import { useState } from "react"
import { hotelApi } from "@/lib/hotel-api"
import type { Review } from "@/types/api"

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < value ? "text-amber-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start gap-3 mb-3">
        <Image
          src={review.guestAvatar}
          alt={review.guestName}
          width={40}
          height={40}
          className="rounded-full shrink-0"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-slate-900 text-sm">{review.guestName}</p>
            {review.verified && (
              <span className="flex items-center gap-1 text-xs text-green-600">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Verificado
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            {new Date(review.date).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="ml-auto shrink-0">
          <StarRating value={review.rating} />
        </div>
      </div>

      <h4 className="font-semibold text-slate-800 text-sm mb-1">"{review.title}"</h4>
      <p className="text-slate-500 text-sm leading-relaxed">{review.comment}</p>

      {review.helpful > 0 && (
        <p className="mt-3 text-xs text-slate-400">{review.helpful} pessoas acharam útil</p>
      )}
    </div>
  )
}

function ReviewCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-gray-200 rounded w-28" />
          <div className="h-3 bg-gray-100 rounded w-20" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3.5 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-4/5" />
      </div>
    </div>
  )
}

export function ReviewsSection({ hotelId, total }: { hotelId: number; total: number }) {
  const [page, setPage] = useState(1)

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews", hotelId, page],
    queryFn: () => hotelApi.getReviewsByHotel(hotelId, page),
    staleTime: 5 * 60 * 1000,
  })

  const hasMore = reviews.length === 5

  return (
    <section>
      <h2 className="text-xl font-bold text-slate-900 mb-5">
        Avaliações
        <span className="ml-2 text-base font-normal text-slate-400">
          ({total.toLocaleString("pt-BR")})
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <ReviewCardSkeleton key={i} />)
          : reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
      </div>

      {!isLoading && (
        <div className="flex justify-center gap-3 mt-6">
          {page > 1 && (
            <button
              type="button"
              onClick={() => setPage((p) => p - 1)}
              className="px-5 py-2 border border-gray-200 rounded-xl text-sm font-medium text-slate-600 hover:border-blue-300 transition-colors"
            >
              Anterior
            </button>
          )}
          {hasMore && (
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Ver mais avaliações
            </button>
          )}
        </div>
      )}
    </section>
  )
}
