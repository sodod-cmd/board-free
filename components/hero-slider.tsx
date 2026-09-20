'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Slide } from '@/lib/data'

const SLIDE_DURATION = 9000

export function HeroSlider({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0)

  const goTo = useCallback((i: number) => setIndex(i), [])

  useEffect(() => {
    if (slides.length <= 1) return
    const current = slides[index]
    // YouTube видео тоглож байх үед автомат солилтыг удаашруулна
    const duration = current?.type === 'youtube' ? SLIDE_DURATION * 3 : SLIDE_DURATION
    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, duration)
    return () => clearTimeout(timer)
  }, [index, slides])

  const active = slides[index]

  return (
    <div className="relative h-full w-full overflow-hidden bg-muted">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? 'z-10 opacity-100' : 'z-0 opacity-0'
          }`}
          aria-hidden={i !== index}
        >
          {slide.type === 'youtube' ? (
            i === index ? (
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${slide.src}?autoplay=1&mute=1&controls=0&rel=0&loop=1&playlist=${slide.src}`}
                title={slide.title ?? 'YouTube video'}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : null
          ) : (
            <img
              src={slide.src || '/placeholder.svg'}
              alt={slide.title ?? 'Слайд зураг'}
              className="h-full w-full object-cover"
            />
          )}
        </div>
      ))}

      {/* Гарчиг / тайлбар */}
      {active?.caption && (
        <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-20 md:p-10 md:pt-28">
          {active.title && (
            <p className="mb-2 inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground md:text-sm">
              {active.title}
            </p>
          )}
          <h2 className="max-w-4xl text-balance text-xl font-bold leading-snug text-white drop-shadow-md md:text-3xl lg:text-4xl">
            {active.caption}
          </h2>
        </div>
      )}

      {/* Цэгэн заагч */}
      <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-3 md:bottom-6">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`${i + 1}-р слайд руу очих`}
            aria-current={i === index}
            className={`h-3 rounded-full transition-all duration-300 md:h-4 ${
              i === index
                ? 'w-10 bg-white md:w-12'
                : 'w-3 bg-white/50 hover:bg-white/80 md:w-4'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
