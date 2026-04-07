"use client"

import { Controller } from "react-hook-form"
import { useSearchForm } from "@/hooks/use-search-form"
import { useSearchStore } from "@/store/search-store"
import { AutocompleteInput } from "./autocomplete-input"
import { DateRangePicker } from "./date-range-picker"
import { GuestsSelector } from "./guests-selector"

export function SearchForm() {
  const { form, onSubmit } = useSearchForm()
  const { recentSearches } = useSearchStore()
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form

  const checkIn = watch("checkIn")
  const checkOut = watch("checkOut")
  const adults = watch("adults")
  const children = watch("children")
  const rooms = watch("rooms")

  function applyRecent(index: number) {
    const s = recentSearches[index]
    setValue("destination", s.destination, { shouldValidate: true })
    setValue("checkIn", s.checkIn, { shouldValidate: false })
    setValue("checkOut", s.checkOut, { shouldValidate: false })
    setValue("adults", s.adults)
    setValue("children", s.children)
    setValue("rooms", s.rooms)
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <Controller
          control={control}
          name="destination"
          render={({ field }) => (
            <AutocompleteInput
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.destination?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="checkIn"
          render={({ field: checkInField }) => (
            <Controller
              control={control}
              name="checkOut"
              render={({ field: checkOutField }) => (
                <DateRangePicker
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onCheckInChange={checkInField.onChange}
                  onCheckOutChange={checkOutField.onChange}
                  checkInError={errors.checkIn?.message}
                  checkOutError={errors.checkOut?.message}
                />
              )}
            />
          )}
        />

        <GuestsSelector
          adults={adults}
          kidsCount={children}
          rooms={rooms}
          onAdultsChange={(v) => setValue("adults", v)}
          onChildrenChange={(v) => setValue("children", v)}
          onRoomsChange={(v) => setValue("rooms", v)}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Buscar hotéis
        </button>
      </form>

      {recentSearches.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
            Buscas recentes
          </p>
          <div className="flex flex-col gap-1">
            {recentSearches.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => applyRecent(i)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left"
              >
                <svg
                  className="w-4 h-4 text-gray-400 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{s.destination}</p>
                  <p className="text-xs text-gray-400">
                    {s.checkIn && s.checkOut
                      ? `${new Date(s.checkIn + "T12:00").toLocaleDateString("pt-BR")} — ${new Date(s.checkOut + "T12:00").toLocaleDateString("pt-BR")}`
                      : "Datas não definidas"}{" "}
                    · {s.adults + s.children} hóspede{s.adults + s.children !== 1 ? "s" : ""}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
