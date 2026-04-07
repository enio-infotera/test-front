"use client"

import { useEffect, useRef, useState } from "react"

interface GuestsSelectorProps {
  adults: number
  kidsCount: number
  rooms: number
  onAdultsChange: (v: number) => void
  onChildrenChange: (v: number) => void
  onRoomsChange: (v: number) => void
}

interface CounterProps {
  label: string
  description: string
  value: number
  min: number
  max: number
  onChange: (v: number) => void
}

function Counter({ label, description, value, min, max, onChange }: CounterProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <span className="w-6 text-center text-sm font-semibold text-gray-900">{value}</span>
        <button
          type="button"
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export function GuestsSelector({
  adults,
  kidsCount,
  rooms,
  onAdultsChange,
  onChildrenChange,
  onRoomsChange,
}: GuestsSelectorProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const totalGuests = adults + kidsCount
  const label = `${totalGuests} hóspede${totalGuests !== 1 ? "s" : ""}, ${rooms} quarto${rooms !== 1 ? "s" : ""}`

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 pl-10 pr-3 py-3 rounded-lg border border-gray-200 hover:border-gray-300 bg-white text-sm text-left transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className="absolute left-3 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </span>
        <span className="text-gray-700">{label}</span>
        <svg
          className={`w-4 h-4 ml-auto text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full min-w-[280px] bg-white rounded-xl shadow-lg border border-gray-100 p-4">
          <div className="divide-y divide-gray-100">
            <Counter
              label="Adultos"
              description="13 anos ou mais"
              value={adults}
              min={1}
              max={10}
              onChange={onAdultsChange}
            />
            <Counter
              label="Crianças"
              description="0–12 anos"
              value={kidsCount}
              min={0}
              max={10}
              onChange={onChildrenChange}
            />
            <Counter
              label="Quartos"
              description="Número de quartos"
              value={rooms}
              min={1}
              max={10}
              onChange={onRoomsChange}
            />
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-3 w-full py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Confirmar
          </button>
        </div>
      )}
    </div>
  )
}
