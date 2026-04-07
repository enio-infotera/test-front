"use client"

interface DateRangePickerProps {
  checkIn: string
  checkOut: string
  onCheckInChange: (value: string) => void
  onCheckOutChange: (value: string) => void
  checkInError?: string
  checkOutError?: string
}

function todayStr() {
  return new Date().toISOString().split("T")[0]
}

function minCheckOut(checkIn: string) {
  if (!checkIn) return todayStr()
  const d = new Date(checkIn)
  d.setDate(d.getDate() + 1)
  return d.toISOString().split("T")[0]
}

function maxCheckOut(checkIn: string) {
  if (!checkIn) return ""
  const d = new Date(checkIn)
  d.setDate(d.getDate() + 30)
  return d.toISOString().split("T")[0]
}

export function DateRangePicker({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  checkInError,
  checkOutError,
}: DateRangePickerProps) {
  function handleCheckInChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    onCheckInChange(value)
    if (checkOut && checkOut <= value) {
      onCheckOutChange("")
    }
  }

  return (
    <div className="flex gap-2 w-full">
      <div className="flex-1">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </span>
          <input
            type="date"
            value={checkIn}
            min={todayStr()}
            onChange={handleCheckInChange}
            className={`w-full pl-10 pr-3 py-3 rounded-lg border text-sm bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              checkInError
                ? "border-red-400 focus:ring-red-400"
                : "border-gray-200 hover:border-gray-300"
            }`}
          />
        </div>
        <p className="mt-0.5 text-xs text-gray-400">Check-in</p>
        {checkInError && <p className="mt-0.5 text-xs text-red-500">{checkInError}</p>}
      </div>

      <div className="flex-1">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </span>
          <input
            type="date"
            value={checkOut}
            min={minCheckOut(checkIn)}
            max={maxCheckOut(checkIn)}
            disabled={!checkIn}
            onChange={(e) => onCheckOutChange(e.target.value)}
            className={`w-full pl-10 pr-3 py-3 rounded-lg border text-sm bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
              checkOutError
                ? "border-red-400 focus:ring-red-400"
                : "border-gray-200 hover:border-gray-300"
            }`}
          />
        </div>
        <p className="mt-0.5 text-xs text-gray-400">Check-out</p>
        {checkOutError && <p className="mt-0.5 text-xs text-red-500">{checkOutError}</p>}
      </div>
    </div>
  )
}
