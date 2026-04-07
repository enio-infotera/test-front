import { z } from "zod"

function luhn(value: string): boolean {
  const digits = value.replace(/\D/g, "")
  let sum = 0
  let alternate = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10)
    if (alternate) {
      n *= 2
      if (n > 9) n -= 9
    }
    sum += n
    alternate = !alternate
  }
  return sum % 10 === 0
}

function isCardExpired(value: string): boolean {
  const [mm, yy] = value.split("/")
  if (!mm || !yy) return true
  const month = parseInt(mm, 10)
  const year = 2000 + parseInt(yy, 10)
  const now = new Date()
  const exp = new Date(year, month - 1, 1)
  const current = new Date(now.getFullYear(), now.getMonth(), 1)
  return exp < current
}

const additionalGuestSchema = z.object({
  firstName: z.string().min(2, "Nome muito curto"),
  lastName: z.string().min(2, "Sobrenome muito curto"),
})

export const personalSchema = z.object({
  firstName: z.string().min(2, "Nome muito curto"),
  lastName: z.string().min(2, "Sobrenome muito curto"),
  email: z.string().email("E-mail inválido"),
  phone: z
    .string()
    .min(10, "Telefone inválido")
    .regex(/^\d+$/, "Apenas números"),
  document: z
    .string()
    .min(11, "CPF inválido")
    .max(11, "CPF inválido")
    .regex(/^\d{11}$/, "CPF deve ter 11 dígitos"),
  additionalGuests: z.array(additionalGuestSchema).optional(),
})

export const paymentSchema = z.object({
  cardHolder: z.string().min(3, "Nome inválido"),
  cardNumber: z
    .string()
    .regex(/^\d{16}$/, "Número deve ter 16 dígitos"),
  expiry: z
    .string()
    .regex(/^\d{2}\/\d{2}$/, "Formato MM/AA")
    .refine((v) => !isCardExpired(v), "Cartão expirado"),
  cvv: z
    .string()
    .regex(/^\d{3,4}$/, "CVV inválido"),
  discountCode: z.string().optional(),
})

export const checkoutSchema = z.object({
  personal: personalSchema,
  payment: paymentSchema,
})

export type PersonalValues = z.infer<typeof personalSchema>
export type PaymentValues = z.infer<typeof paymentSchema>
export type CheckoutValues = z.infer<typeof checkoutSchema>
