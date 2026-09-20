'use client'

import type { TickerItem } from '@/lib/data'

export function NewsTicker({ items }: { items: TickerItem[] }) {
  // Тасралтгүй урсгал үүсгэхийн тулд жагсаалтыг хоёр дахин давтана
  const loop = [...items, ...items]

  return (
    <div className="flex items-stretch overflow-hidden bg-primary text-primary-foreground">
      <div className="flex shrink-0 items-center gap-2 bg-foreground px-5 text-sm font-bold uppercase tracking-wider text-background md:text-base">
        Мэдээ
      </div>
      <div className="relative flex-1 overflow-hidden py-3">
        <div
          className="animate-ticker flex w-max items-center whitespace-nowrap"
          style={{ ['--ticker-duration' as string]: `${items.length * 9}s` }}
        >
          {loop.map((item, i) => (
            <span key={`${item.id}-${i}`} className="flex items-center">
              <span className="px-8 text-lg font-medium md:text-xl lg:text-2xl">
                {item.text}
              </span>
              <span className="text-primary-foreground/50" aria-hidden>
                •
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
