'use client'

import { Star } from 'lucide-react'
import type { FeaturedNews } from '@/lib/data'

// Seconds per news item — controls the continuous scroll speed.
const SECONDS_PER_ITEM = 5

export function FeaturedNewsPanel({ news }: { news: FeaturedNews[] }) {
  // Duplicate the list so the vertical loop is seamless (translateY(-50%)).
  const loop = news.length > 0 ? [...news, ...news] : []
  const duration = Math.max(news.length * SECONDS_PER_ITEM, 12)

  return (
    <aside className="flex h-full flex-col bg-card">
      <div className="flex items-center gap-2 border-b border-border bg-primary px-5 py-4 text-primary-foreground md:px-6 md:py-5">
        <Star className="size-6 shrink-0 fill-current md:size-7" aria-hidden />
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Онцлох мэдээ</h2>
      </div>

      <div className="relative flex-1 overflow-hidden">
        {/* soft fade at top and bottom edges */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-card to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-card to-transparent" />

        <ul
          className="animate-vertical-scroll flex flex-col divide-y divide-border"
          style={{ ['--scroll-duration' as string]: `${duration}s` }}
        >
          {loop.map((item, i) => (
            <li
              key={`${item.id}-${i}`}
              className="flex items-center gap-4 px-4 py-4 md:px-5"
              aria-hidden={i >= news.length}
            >
              <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-muted md:size-24 lg:size-28">
                <img
                  src={item.image || '/placeholder.svg'}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="line-clamp-4 text-pretty text-base font-medium leading-snug text-card-foreground md:text-lg">
                {item.title}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
