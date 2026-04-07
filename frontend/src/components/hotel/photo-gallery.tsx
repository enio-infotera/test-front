"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { BLUR_DATA_URL } from "@/lib/image-placeholder"

interface PhotoGalleryProps {
  images: string[]
  hotelName: string
}

function Lightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  images: string[]
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") onPrev()
      if (e.key === "ArrowRight") onNext()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [onClose, onPrev, onNext])

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white"
        aria-label="Fechar"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onPrev() }}
        className="absolute left-4 p-3 text-white/70 hover:text-white disabled:opacity-30"
        disabled={index === 0}
        aria-label="Anterior"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="relative w-full max-w-4xl max-h-[80vh] px-16" onClick={(e) => e.stopPropagation()}>
        <Image
          src={images[index]}
          alt={`Foto ${index + 1}`}
          width={1200}
          height={800}
          className="object-contain max-h-[80vh] w-full"
          priority
        />
        <p className="text-center text-white/50 text-sm mt-3">
          {index + 1} / {images.length}
        </p>
      </div>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onNext() }}
        className="absolute right-4 p-3 text-white/70 hover:text-white disabled:opacity-30"
        disabled={index === images.length - 1}
        aria-label="Próxima"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="absolute bottom-6 flex gap-2 overflow-x-auto px-4">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={(e) => { e.stopPropagation(); }}
            className={`shrink-0 w-14 h-10 rounded overflow-hidden border-2 transition-colors ${
              i === index ? "border-white" : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <Image src={src} alt="" width={56} height={40} className="object-cover w-full h-full" />
          </button>
        ))}
      </div>
    </div>
  )
}

export function PhotoGallery({ images, hotelName }: PhotoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const main = images[0]
  const thumbs = images.slice(1, 5)
  const remaining = images.length - 5

  function open(index: number) { setLightboxIndex(index) }
  function close() { setLightboxIndex(null) }
  function prev() { setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i)) }
  function next() { setLightboxIndex((i) => (i !== null && i < images.length - 1 ? i + 1 : i)) }

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[420px] rounded-2xl overflow-hidden">
        <button
          type="button"
          onClick={() => open(0)}
          className="col-span-2 row-span-2 relative overflow-hidden group"
          aria-label="Ver foto principal"
        >
          <Image
            src={main}
            alt={hotelName}
            fill
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
            sizes="50vw"
          />
        </button>

        {thumbs.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => open(i + 1)}
            className="relative overflow-hidden group"
            aria-label={`Ver foto ${i + 2}`}
          >
            <Image
              src={src}
              alt=""
              fill
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="25vw"
            />
            {i === 3 && remaining > 0 && (
              <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">+{remaining}</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </>
  )
}
