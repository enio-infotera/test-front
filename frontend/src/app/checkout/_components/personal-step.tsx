"use client"

import type { UseFormReturn } from "react-hook-form"
import { useFieldArray } from "react-hook-form"
import type { PersonalValues } from "@/lib/checkout-schema"

interface PersonalStepProps {
  form: UseFormReturn<PersonalValues>
  onSubmit: (values: PersonalValues) => void
  totalGuests?: number
}

function formatPhone(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 11)
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  return digits
}

function formatCpf(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
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

export function PersonalStep({ form, onSubmit, totalGuests = 1 }: PersonalStepProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = form

  const { fields, append, remove } = useFieldArray({
    control,
    name: "additionalGuests",
  })

  const extraGuests = totalGuests - 1

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs">
            1
          </span>
          Hóspede Principal
        </h3>
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field id="firstName" label="Nome" error={errors.firstName?.message}>
              <input
                id="firstName"
                {...register("firstName")}
                placeholder="João"
                className={inputClass}
              />
            </Field>
            <Field id="lastName" label="Sobrenome" error={errors.lastName?.message}>
              <input
                id="lastName"
                {...register("lastName")}
                placeholder="Silva"
                className={inputClass}
              />
            </Field>
          </div>
          <Field id="email" label="E-mail" error={errors.email?.message}>
            <input
              id="email"
              {...register("email")}
              type="email"
              placeholder="joao@exemplo.com"
              className={inputClass}
            />
          </Field>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field id="phone" label="Telefone" error={errors.phone?.message}>
              <input
                id="phone"
                {...register("phone")}
                placeholder="(11) 91234-5678"
                className={inputClass}
                onChange={(e) => {
                  const formatted = formatPhone(e.target.value)
                  e.target.value = formatted
                  setValue("phone", formatted.replace(/\D/g, ""))
                }}
              />
            </Field>
            <Field id="document" label="CPF" error={errors.document?.message}>
              <input
                id="document"
                {...register("document")}
                placeholder="000.000.000-00"
                className={inputClass}
                onChange={(e) => {
                  const formatted = formatCpf(e.target.value)
                  e.target.value = formatted
                  setValue("document", formatted.replace(/\D/g, ""))
                }}
              />
            </Field>
          </div>
        </div>
      </div>

      {extraGuests > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Hóspedes adicionais</p>
            {fields.length < extraGuests && (
              <button
                type="button"
                onClick={() => append({ firstName: "", lastName: "" })}
                className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Adicionar hóspede ({fields.length + 1}/{extraGuests})
              </button>
            )}
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="rounded-xl border border-gray-200 p-4 space-y-4">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-700 text-xs">
                    {index + 2}
                  </span>
                  Hóspede {index + 2}
                </h4>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Remover
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  id={`guest-${index}-firstName`}
                  label="Nome"
                  error={errors.additionalGuests?.[index]?.firstName?.message}
                >
                  <input
                    id={`guest-${index}-firstName`}
                    {...register(`additionalGuests.${index}.firstName`)}
                    placeholder="Maria"
                    className={inputClass}
                  />
                </Field>
                <Field
                  id={`guest-${index}-lastName`}
                  label="Sobrenome"
                  error={errors.additionalGuests?.[index]?.lastName?.message}
                >
                  <input
                    id={`guest-${index}-lastName`}
                    {...register(`additionalGuests.${index}.lastName`)}
                    placeholder="Silva"
                    className={inputClass}
                  />
                </Field>
              </div>
            </div>
          ))}

          {fields.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-3 border border-dashed border-gray-200 rounded-xl">
              Clique em "Adicionar hóspede" para informar os demais hóspedes.
            </p>
          )}
        </div>
      )}

      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
      >
        Continuar para pagamento
      </button>
    </form>
  )
}
