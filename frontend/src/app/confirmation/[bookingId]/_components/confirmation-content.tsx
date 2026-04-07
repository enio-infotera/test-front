"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useBookingStore } from "@/store/booking-store"
import { useToast } from "@/components/ui/toast"

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-16 w-16 text-green-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-16 w-16 text-yellow-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
      />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
      />
    </svg>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
}

function SummaryRow({
  label,
  value,
  bold,
}: {
  label: string
  value: string
  bold?: boolean
}) {
  return (
    <div
      className={`flex justify-between text-sm ${bold ? "font-semibold text-gray-900" : "text-gray-600"}`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}

interface ConfirmationContentProps {
  bookingId: string
}

function NotFoundState() {
  const router = useRouter()
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <div className="mb-6 flex justify-center">
        <AlertIcon />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-gray-900">
        Reserva não encontrada
      </h1>
      <p className="mb-6 text-gray-500">
        Não encontramos os dados desta reserva. Isso pode ter ocorrido porque a
        sessão expirou ou você acessou este link diretamente.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          onClick={() => router.push("/")}
          className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Ir para a página inicial
        </button>
        <button
          onClick={() => router.push("/search")}
          className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          Buscar hotéis
        </button>
      </div>
    </div>
  )
}

export function ConfirmationContent({ bookingId }: ConfirmationContentProps) {
  const router = useRouter()
  const { selection, bookingDetails, clearSelection } = useBookingStore()
  const { success } = useToast()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    return () => {
      clearSelection()
    }
  }, [clearSelection])

  if (!selection || !bookingDetails) {
    return <NotFoundState />
  }

  const { hotel, room, checkIn, checkOut, guests, rooms } = selection
  const { subtotal, taxes, discount, discountRate, total, nights } =
    bookingDetails

  function copyBookingId() {
    navigator.clipboard.writeText(bookingId).then(() => {
      setCopied(true)
      success("Código copiado para a área de transferência!")
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-10 text-center">
        <div className="mb-4 flex justify-center">
          <CheckIcon />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Reserva confirmada!
        </h1>
        <p className="text-gray-500">
          Em breve você receberá um e-mail com todos os detalhes.
        </p>
      </div>

      <div className="mb-4 flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-blue-500">
            Código da reserva
          </p>
          <p className="mt-0.5 text-xl font-bold text-blue-700">{bookingId}</p>
        </div>
        <button
          onClick={copyBookingId}
          title="Copiar código"
          className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
        >
          <CopyIcon />
          {copied ? "Copiado!" : "Copiar"}
        </button>
      </div>

      <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-700">
          Detalhes da hospedagem
        </h2>
        <div className="space-y-2.5 text-sm">
          <SummaryRow label="Hotel" value={hotel.name} />
          <SummaryRow label="Quarto" value={room.name} />
          <SummaryRow label="Destino" value={hotel.destination} />
          <SummaryRow label="Check-in" value={formatDate(checkIn)} />
          <SummaryRow label="Check-out" value={formatDate(checkOut)} />
          <SummaryRow
            label="Duração"
            value={`${nights} noite${nights > 1 ? "s" : ""}`}
          />
          <SummaryRow
            label="Hóspedes"
            value={`${guests} hóspede${guests > 1 ? "s" : ""}, ${rooms} quarto${rooms > 1 ? "s" : ""}`}
          />
        </div>
      </div>

      <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-700">
          Valores pagos
        </h2>
        <div className="space-y-2 text-sm">
          <SummaryRow
            label={`R$ ${room.pricePerNight.toFixed(2)} × ${nights} noite${nights > 1 ? "s" : ""}`}
            value={`R$ ${subtotal.toFixed(2)}`}
          />
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Desconto ({Math.round(discountRate * 100)}%)</span>
              <span>- R$ {discount.toFixed(2)}</span>
            </div>
          )}
          <SummaryRow label="Taxas e encargos (12%)" value={`R$ ${taxes.toFixed(2)}`} />
          <div className="border-t border-gray-100 pt-2">
            <SummaryRow
              label="Total pago"
              value={`R$ ${total.toFixed(2)}`}
              bold
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={() => router.push("/")}
          className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Nova busca
        </button>
        <button
          onClick={() => window.print()}
          className="flex-1 rounded-xl border border-gray-300 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          Imprimir comprovante
        </button>
      </div>
    </div>
  )
}

