import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { personalSchema, paymentSchema } from "@/lib/checkout-schema"
import type { PersonalValues, PaymentValues } from "@/lib/checkout-schema"
import { useBookingStore } from "@/store/booking-store"
import { useToast } from "@/components/ui/toast"

export type CheckoutStep = 1 | 2 | 3

const TAX_RATE = 0.12

const PAYMENT_ERROR_MESSAGES: Record<string, string> = {
  card_declined: "Cartão recusado. Verifique os dados ou tente outro cartão.",
  insufficient_funds: "Saldo insuficiente. Tente outro cartão.",
  generic_error: "Não foi possível processar o pagamento. Tente novamente.",
}

function simulatePaymentError(): string | null {
  const outcomes = [null, null, null, null, null, null, null, "card_declined", "insufficient_funds", "generic_error"]
  return outcomes[Math.floor(Math.random() * outcomes.length)]
}

export function useCheckout(pricePerNight: number, nights: number) {
  const router = useRouter()
  const { setBookingDetails } = useBookingStore()
  const { error: toastError } = useToast()
  const [step, setStep] = useState<CheckoutStep>(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [personalData, setPersonalData] = useState<PersonalValues | null>(null)
  const [paymentData, setPaymentData] = useState<PaymentValues | null>(null)
  const [appliedDiscount, setAppliedDiscount] = useState(0)

  const personalForm = useForm<PersonalValues>({
    resolver: zodResolver(personalSchema),
    mode: "onBlur",
    defaultValues: { additionalGuests: [] },
  })

  const paymentForm = useForm<PaymentValues>({
    resolver: zodResolver(paymentSchema),
    mode: "onBlur",
  })

  const subtotal = pricePerNight * nights
  const taxes = Math.round(subtotal * TAX_RATE)
  const discount = Math.round(subtotal * appliedDiscount)
  const total = subtotal + taxes - discount

  const DISCOUNT_CODES: Record<string, number> = {
    DESCONTO10: 0.1,
    PROMO20: 0.2,
  }

  function applyDiscount(code: string) {
    const rate = DISCOUNT_CODES[code.toUpperCase()]
    if (rate) {
      setAppliedDiscount(rate)
      return true
    }
    return false
  }

  function submitPersonal(values: PersonalValues) {
    setPersonalData(values)
    setStep(2)
  }

  function submitPayment(values: PaymentValues) {
    if (values.discountCode) applyDiscount(values.discountCode)
    setPaymentData(values)
    setStep(3)
  }

  async function confirm() {
    setSubmitting(true)
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1400))

      const paymentError = simulatePaymentError()
      if (paymentError) {
        const msg = PAYMENT_ERROR_MESSAGES[paymentError] ?? PAYMENT_ERROR_MESSAGES.generic_error
        setError(msg)
        toastError(msg)
        return
      }

      const bookingId = `BK${Date.now()}`

      setBookingDetails({
        subtotal,
        taxes,
        discount,
        discountRate: appliedDiscount,
        total,
        nights,
      })

      router.push(`/confirmation/${bookingId}`)
    } catch {
      const msg = PAYMENT_ERROR_MESSAGES.generic_error
      setError(msg)
      toastError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return {
    step,
    setStep,
    submitting,
    error,
    clearError: () => setError(null),
    personalForm,
    paymentForm,
    personalData,
    paymentData,
    pricing: { subtotal, taxes, discount, total, nights },
    submitPersonal,
    submitPayment,
    confirm,
    applyDiscount,
    appliedDiscount,
  }
}
