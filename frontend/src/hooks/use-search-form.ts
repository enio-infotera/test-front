import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useSearchStore } from "@/store/search-store"

const today = () => new Date().toISOString().split("T")[0]

export const searchSchema = z
  .object({
    destination: z.string().min(2, "Digite um destino"),
    checkIn: z.string().min(1, "Selecione a data de check-in"),
    checkOut: z.string().min(1, "Selecione a data de check-out"),
    adults: z.number().min(1, "Mínimo 1 adulto").max(10),
    children: z.number().min(0).max(10),
    rooms: z.number().min(1, "Mínimo 1 quarto").max(10),
  })
  .superRefine((data, ctx) => {
    const todayStr = today()

    if (data.checkIn && data.checkIn < todayStr) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Check-in não pode ser no passado",
        path: ["checkIn"],
      })
    }

    if (data.checkIn && data.checkOut) {
      const checkInDate = new Date(data.checkIn)
      const checkOutDate = new Date(data.checkOut)
      const diffDays = (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)

      if (diffDays < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Check-out deve ser pelo menos 1 dia após o check-in",
          path: ["checkOut"],
        })
      }

      if (diffDays > 30) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Estadia máxima de 30 dias",
          path: ["checkOut"],
        })
      }
    }
  })

export type SearchFormValues = z.infer<typeof searchSchema>

export function useSearchForm() {
  const router = useRouter()
  const { setLastSearch, addRecentSearch } = useSearchStore()

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      destination: "",
      checkIn: "",
      checkOut: "",
      adults: 2,
      children: 0,
      rooms: 1,
    },
    mode: "onChange",
  })

  function onSubmit(values: SearchFormValues) {
    setLastSearch(values)
    addRecentSearch(values)

    const params = new URLSearchParams({
      destination: values.destination,
      checkIn: values.checkIn,
      checkOut: values.checkOut,
      adults: String(values.adults),
      children: String(values.children),
      rooms: String(values.rooms),
    })

    router.push(`/search?${params.toString()}`)
  }

  return { form, onSubmit }
}
