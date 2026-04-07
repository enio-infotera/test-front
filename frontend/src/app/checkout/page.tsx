import { Suspense } from "react"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { CheckoutContent } from "./_components/checkout-content"

export default function CheckoutPage() {
  return (
    <ErrorBoundary>
      <Suspense>
        <CheckoutContent />
      </Suspense>
    </ErrorBoundary>
  )
}
