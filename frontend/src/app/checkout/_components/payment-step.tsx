"use client"

import { useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import type { PaymentValues } from "@/lib/checkout-schema"

interface Pricing {
  subtotal: number
  taxes: number
  discount: number
  total: number
  nights: number
}

interface PaymentStepProps {
  form: UseFormReturn<PaymentValues>
  pricing: Pricing
  pricePerNight: number
  onSubmit: (values: PaymentValues) => void
  onBack: () => void
  onApplyDiscount: (code: string) => boolean
  appliedDiscount: number
}

function formatCardNumber(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 16)
  return digits.replace(/(.{4})/g, "$1 ").trim()
}

function formatExpiry(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

function Field({
  label,
  id,
  error,
  children,
}: {
  label: string
  id: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

export function PaymentStep({
  form,
  pricing,
  pricePerNight,
  onSubmit,
  onBack,
  onApplyDiscount,
  appliedDiscount,
}: PaymentStepProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form

  const [discountInput, setDiscountInput] = useState("")
  const [discountFeedback, setDiscountFeedback] = useState<"idle" | "ok" | "error">("idle")

  function handleApply() {
    const success = onApplyDiscount(discountInput)
    setValue("discountCode", success ? discountInput : undefined)
    setDiscountFeedback(success ? "ok" : "error")
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <h3 className="mb-4 text-sm font-semibold text-gray-700">Dados do cartão</h3>

        <div className="space-y-4">
          <Field label="Nome no cartão" id="cardHolder" error={errors.cardHolder?.message}>
            <input
              id="cardHolder"
              {...register("cardHolder")}
              placeholder="JOÃO SILVA"
              className={inputClass}
            />
          </Field>

          <Field label="Número do cartão" id="cardNumber" error={errors.cardNumber?.message}>
            <input
              id="cardNumber"
              {...register("cardNumber")}
              placeholder="0000 0000 0000 0000"
              className={inputClass}
              maxLength={19}
              onChange={(e) => {
                const formatted = formatCardNumber(e.target.value)
                e.target.value = formatted
                setValue("cardNumber", formatted.replace(/\s/g, ""))
              }}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Validade" id="expiry" error={errors.expiry?.message}>
              <input
                id="expiry"
                {...register("expiry")}
                placeholder="MM/AA"
                className={inputClass}
                maxLength={5}
                onChange={(e) => {
                  const formatted = formatExpiry(e.target.value)
                  e.target.value = formatted
                  setValue("expiry", formatted)
                }}
              />
            </Field>

            <Field label="CVV" id="cvv" error={errors.cvv?.message}>
              <input
                id="cvv"
                {...register("cvv")}
                placeholder="123"
                className={inputClass}
                maxLength={4}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 4)
                  e.target.value = digits
                  setValue("cvv", digits)
                }}
              />
            </Field>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Cupom de desconto</h3>
        <div className="flex gap-2">
          <input
            value={discountInput}
            onChange={(e) => {
              setDiscountInput(e.target.value.toUpperCase())
              setDiscountFeedback("idle")
            }}
            placeholder="DESCONTO10"
            className={`${inputClass} flex-1`}
            disabled={appliedDiscount > 0}
          />
          <button
            type="button"
            onClick={handleApply}
            disabled={!discountInput || appliedDiscount > 0}
            className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            Aplicar
          </button>
        </div>
        {discountFeedback === "ok" && (
          <p className="mt-1 text-xs text-green-600">Cupom aplicado com sucesso!</p>
        )}
        {discountFeedback === "error" && (
          <p className="mt-1 text-xs text-red-600">Cupom inválido.</p>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 p-4 text-sm">
        <h3 className="mb-3 font-semibold text-gray-700">Resumo do valor</h3>
        <div className="space-y-2 text-gray-600">
          <div className="flex justify-between">
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
          <div className="flex justify-between">
            <span>Taxas e encargos (12%)</span>
            <span>R$ {pricing.taxes.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-2 font-semibold text-gray-900">
            <span>Total</span>
            <span>R$ {pricing.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-lg border border-gray-300 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          Voltar
        </button>
        <button
          type="submit"
          className="flex-1 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Revisar reserva
        </button>
      </div>
    </form>
  )
}
