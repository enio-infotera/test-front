import { Suspense } from "react"
import { ConfirmationContent } from "./_components/confirmation-content"

interface PageProps {
  params: Promise<{ bookingId: string }>
}

export default async function ConfirmationPage({ params }: PageProps) {
  const { bookingId } = await params

  return (
    <Suspense>
      <ConfirmationContent bookingId={bookingId} />
    </Suspense>
  )
}
