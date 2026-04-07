"use client"

import { useState } from "react"
import type { PersonalValues } from "@/lib/checkout-schema"
import type { Hotel, Room } from "@/types/api"

interface Pricing {
  subtotal: number
  taxes: number
  discount: number
  total: number
  nights: number
}

interface ReviewStepProps {
  hotel: Hotel
  room: Room
  checkIn: string
  checkOut: string
  personal: PersonalValues
  pricing: Pricing
  appliedDiscount: number
  pricePerNight: number
  submitting: boolean
  error?: string | null
  onConfirm: () => void
  onBack: () => void
  onClearError?: () => void
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex justify-between text-sm ${highlight ? "font-semibold text-gray-900" : "text-gray-600"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}

function TermsModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Termos e Condições</h2>
        <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
          <p>Ao confirmar esta reserva, você concorda com os seguintes termos:</p>
          <p><strong>1. Política de cancelamento:</strong> A política aplicável é a definida pelo hotel. Verifique os detalhes antes de confirmar.</p>
          <p><strong>2. Check-in e Check-out:</strong> Os horários devem ser respeitados. Chegadas antecipadas estão sujeitas à disponibilidade.</p>
          <p><strong>3. Pagamento:</strong> O pagamento é processado de forma segura. Todos os valores incluem as taxas informadas no resumo.</p>
          <p><strong>4. Responsabilidade:</strong> A plataforma atua como intermediária e não se responsabiliza por alterações feitas diretamente pelo estabelecimento.</p>
          <p><strong>5. Privacidade:</strong> Seus dados são tratados conforme nossa Política de Privacidade e a LGPD.</p>
        </div>
        <button onClick={onClose} className="mt-5 w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
          Fechar
        </button>
      </div>
    </div>
  )
}

export function ReviewStep({
  hotel,
  room,
  checkIn,
  checkOut,
  personal,
  pricing,
  appliedDiscount,
  pricePerNight,
  submitting,
  error,
  onConfirm,
  onBack,
  onClearError,
}: ReviewStepProps) {
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [termsOpen, setTermsOpen] = useState(false)
  const [termsError, setTermsError] = useState(false)

  function handleConfirm() {
    if (!termsAccepted) {
      setTermsError(true)
      return
    }
    onConfirm()
  }

  return (
    <div className="space-y-5">
      {termsOpen && <TermsModal onClose={() => setTermsOpen(false)} />}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-5 w-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-medium text-red-700">Falha no pagamento</p>
            <p className="mt-0.5 text-sm text-red-600">{error}</p>
          </div>
          {onClearError && (
            <button type="button" onClick={onClearError} className="shrink-0 text-red-400 hover:text-red-600" aria-label="Fechar">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      )}

      <div className="rounded-xl border border-gray-200 p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Hospedagem</h3>
        <div className="space-y-1.5 text-sm text-gray-600">
          <p className="font-medium text-gray-900">{hotel.name}</p>
          <p>{room.name}</p>
          <p>{formatDate(checkIn)} → {formatDate(checkOut)}</p>
          <p>{pricing.nights} noite{pricing.nights > 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Dados do hóspede</h3>
        <div className="space-y-1 text-sm text-gray-600">
          <p>{personal.firstName} {personal.lastName}</p>
          <p>{personal.email}</p>
          <p>({personal.phone.slice(0, 2)}) {personal.phone.slice(2, 7)}-{personal.phone.slice(7)}</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Valores a pagar</h3>
        <div className="space-y-2">
          <Row label={`R$ ${pricePerNight.toFixed(2)} × ${pricing.nights} noite${pricing.nights > 1 ? "s" : ""}`} value={`R$ ${pricing.subtotal.toFixed(2)}`} />
          {pricing.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Desconto ({Math.round(appliedDiscount * 100)}%)</span>
              <span>- R$ {pricing.discount.toFixed(2)}</span>
            </div>
          )}
          <Row label="Taxas (12%)" value={`R$ ${pricing.taxes.toFixed(2)}`} />
          <div className="border-t border-gray-200 pt-2">
            <Row label="Total" value={`R$ ${pricing.total.toFixed(2)}`} highlight />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => {
              setTermsAccepted(e.target.checked)
              if (e.target.checked) setTermsError(false)
            }}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-blue-600"
          />
          <span className="text-sm text-gray-600">
            Li e concordo com os{" "}
            <button type="button" onClick={() => setTermsOpen(true)} className="font-medium text-blue-600 underline hover:text-blue-700">
              Termos e Condições
            </button>{" "}
            da reserva.
          </span>
        </label>
        {termsError && (
          <p className="mt-2 text-xs text-red-600">Você precisa aceitar os termos para continuar.</p>
        )}
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={onBack} disabled={submitting} className="flex-1 rounded-lg border border-gray-300 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-40">
          Voltar
        </button>
        <button type="button" onClick={handleConfirm} disabled={submitting} className="flex-1 rounded-lg bg-green-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60">
          {submitting ? "Processando..." : "Confirmar reserva"}
        </button>
      </div>
    </div>
  )
}
