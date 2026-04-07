"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useBookingStore } from "@/store/booking-store"
import { useCheckout } from "@/hooks/use-checkout"
import { PersonalStep } from "./personal-step"
import { PaymentStep } from "./payment-step"
import { ReviewStep } from "./review-step"

const STEPS = [
  { label: "Dados pessoais" },
  { label: "Pagamento" },
  { label: "Revisão" },
]

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((s, i) => {
        const num = i + 1
        const done = num < current
        const active = num === current
        return (
          <div key={s.label} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                done
                  ? "bg-green-500 text-white"
                  : active
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
              }`}
            >
              {done ? "✓" : num}
            </div>
            <span
              className={`hidden text-sm sm:block ${
                active ? "font-medium text-gray-900" : "text-gray-500"
              }`}
            >
              {s.label}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className={`h-px w-8 ${done ? "bg-green-400" : "bg-gray-200"}`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

function BookingSidebar({
  hotel,
  room,
  checkIn,
  checkOut,
  pricing,
  pricePerNight,
  appliedDiscount,
}: {
  hotel: { name: string; destination: string }
  room: { name: string }
  checkIn: string
  checkOut: string
  pricing: { subtotal: number; taxes: number; discount: number; total: number; nights: number }
  pricePerNight: number
  appliedDiscount: number
}) {
  function fmt(iso: string) {
    if (!iso) return "—"
    const d = new Date(iso)
    if (isNaN(d.getTime())) return "—"
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      timeZone: "UTC",
    })
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-gray-900">
        Sua reserva
      </h2>
      <div className="space-y-2 text-sm text-gray-600">
        <p className="font-medium text-gray-900">{hotel.name}</p>
        <p>{hotel.destination}</p>
        <p className="mt-1">{room.name}</p>
        <div className="mt-3 flex justify-between rounded-lg bg-gray-50 px-3 py-2 text-xs">
          <span>
            Check-in
            <br />
            <span className="font-medium text-gray-900">{fmt(checkIn)}</span>
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-right">
            Check-out
            <br />
            <span className="font-medium text-gray-900">{fmt(checkOut)}</span>
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>
            R$ {pricePerNight.toFixed(2)} × {pricing.nights} noite
            {pricing.nights > 1 ? "s" : ""}
          </span>
          <span>R$ {pricing.subtotal.toFixed(2)}</span>
        </div>
        {pricing.discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Desconto ({Math.round(appliedDiscount * 100)}%)</span>
            <span>- R$ {pricing.discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-600">
          <span>Taxas</span>
          <span>R$ {pricing.taxes.toFixed(2)}</span>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-2 font-semibold text-gray-900">
          <span>Total</span>
          <span>R$ {pricing.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

export function CheckoutContent() {
  const router = useRouter()
  const { selection } = useBookingStore()

  useEffect(() => {
    if (!selection) router.replace("/search")
  }, [selection, router])

  const nights = (() => {
    if (!selection?.checkIn || !selection?.checkOut) return 1
    const diff =
      new Date(selection.checkOut).getTime() -
      new Date(selection.checkIn).getTime()
    const n = Math.round(diff / 86_400_000)
    return isNaN(n) || n < 1 ? 1 : n
  })()

  const checkout = useCheckout(selection?.room.pricePerNight ?? 0, nights)

  if (!selection) return null

  const { hotel, room, checkIn, checkOut } = selection
  const {
    step,
    setStep,
    submitting,
    error,
    clearError,
    personalForm,
    paymentForm,
    personalData,
    pricing,
    submitPersonal,
    submitPayment,
    confirm,
    applyDiscount,
    appliedDiscount,
  } = checkout

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Checkout</h1>

      <div className="mb-8">
        <StepIndicator current={step} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            {step === 1 && (
              <PersonalStep form={personalForm} onSubmit={submitPersonal} totalGuests={selection.guests} />
            )}
            {step === 2 && (
              <PaymentStep
                form={paymentForm}
                pricing={pricing}
                pricePerNight={room.pricePerNight}
                onSubmit={submitPayment}
                onBack={() => setStep(1)}
                onApplyDiscount={applyDiscount}
                appliedDiscount={appliedDiscount}
              />
            )}
            {step === 3 && personalData && (
              <ReviewStep
                hotel={hotel}
                room={room}
                checkIn={checkIn}
                checkOut={checkOut}
                personal={personalData}
                pricing={pricing}
                appliedDiscount={appliedDiscount}
                pricePerNight={room.pricePerNight}
                submitting={submitting}
                error={error}
                onConfirm={confirm}
                onBack={() => setStep(2)}
                onClearError={clearError}
              />
            )}
          </div>
        </div>

        <aside className="lg:col-span-1">
          <BookingSidebar
            hotel={hotel}
            room={room}
            checkIn={checkIn}
            checkOut={checkOut}
            pricing={pricing}
            pricePerNight={room.pricePerNight}
            appliedDiscount={appliedDiscount}
          />
        </aside>
      </div>
    </div>
  )
}
