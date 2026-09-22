'use client'

import { useEffect, useMemo, useState } from 'react'
import { BookOpen, CalendarOff, Check } from 'lucide-react'
import { isDismissed, weekdayKeyFor, weekdayLabel, type ClassStatus } from '@/lib/data'

const PER_PAGE = 10
const PAGE_INTERVAL = 5000

export function ClassStatusBoard({ classes }: { classes: ClassStatus[] }) {
  const [page, setPage] = useState(0)
  const [now, setNow] = useState<Date | null>(null)

  // Одоогийн цагийг зөвхөн клиент дээр тохируулж, минут тутам шинэчилнэ
  useEffect(() => {
    setNow(new Date())
    const timer = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(timer)
  }, [])

  // Өнөөдөр хэдэн дэх гараг вэ. Бямба/Ням бол null.
  const today = now ? weekdayKeyFor(now) : null

  // Анги бүрийн ӨНӨӨДРИЙН тарах цагийг гаргаж, эрт тарахаас нь эхлэн эрэмбэлнэ.
  const rows = useMemo(() => {
    const list = classes.map((cls) => ({ cls, time: today ? (cls.schedule?.[today] ?? '') : '' }))
    // Цаггүй (хичээлгүй) ангиуд жагсаалтын сүүлд орно.
    return today ? list.sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99')) : list
  }, [classes, today])

  const pageCount = Math.max(1, Math.ceil(rows.length / PER_PAGE))

  useEffect(() => {
    if (pageCount <= 1) return
    const timer = setInterval(() => {
      setPage((prev) => (prev + 1) % pageCount)
    }, PAGE_INTERVAL)
    return () => clearInterval(timer)
  }, [pageCount])

  const current = useMemo(() => {
    const startIdx = page * PER_PAGE
    return rows.slice(startIdx, startIdx + PER_PAGE)
  }, [rows, page])

  const hasOffClasses = Boolean(now) && current.some((r) => !r.time)

  return (
    <section className="flex h-full flex-col gap-3 px-4 pb-4 pt-3 md:px-6 md:pb-5 md:pt-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-baseline gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground md:text-base">
          Ангиудын тарсан байдал
          {now && (
            <span className="text-xs font-medium normal-case tracking-normal text-muted-foreground/80 md:text-sm">
              {today ? `· ${weekdayLabel(today)} гараг` : '· Амралтын өдөр'}
            </span>
          )}
        </h2>
        <div className="flex items-center gap-4 text-xs md:text-sm">
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-success" aria-hidden />
            <span className="text-muted-foreground">Тарсан</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-primary" aria-hidden />
            <span className="text-muted-foreground">Хичээл дээр</span>
          </span>
          {hasOffClasses && (
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded-full bg-muted-foreground" aria-hidden />
              <span className="text-muted-foreground">Хичээлгүй</span>
            </span>
          )}
          {pageCount > 1 && (
            <span className="flex gap-1">
              {Array.from({ length: pageCount }, (_, i) => (
                <span
                  key={i}
                  className={`size-2 rounded-full transition-colors ${
                    i === page ? 'bg-foreground' : 'bg-border'
                  }`}
                  aria-hidden
                />
              ))}
            </span>
          )}
        </div>
      </div>

      <div className="grid flex-1 grid-cols-5 gap-2 md:gap-3 lg:grid-cols-10">
        {current.map(({ cls, time }) => {
          // now тохирох хүртэл (сервер дээр) аль өдөр болохыг мэдэхгүй тул төлөвгүй харуулна.
          const off = Boolean(now) && !time
          const dismissed = Boolean(now && time && isDismissed(time, now))
          return (
            <div
              key={cls.id}
              className={`animate-fade-in sheen flex flex-col items-center justify-center gap-1 rounded-2xl border p-2 text-center shadow-md transition-colors md:gap-2 md:p-3 ${
                off
                  ? 'cell-off border-white/25 text-primary-foreground shadow-black/10'
                  : dismissed
                    ? 'cell-dismissed border-white/25 text-success-foreground shadow-success/25'
                    : 'cell-active border-white/25 text-primary-foreground shadow-primary/25'
              }`}
            >
              {off ? (
                <CalendarOff className="size-5 md:size-7" aria-hidden />
              ) : dismissed ? (
                <Check className="size-5 md:size-7" aria-hidden />
              ) : (
                <BookOpen className="size-5 md:size-7" aria-hidden />
              )}
              <span className="text-xl font-extrabold leading-none md:text-3xl lg:text-4xl">
                {cls.name}
              </span>
              <span className="flex flex-col items-center gap-0.5 leading-none">
                <span className="text-[11px] font-semibold uppercase tracking-wide opacity-90 md:text-xs">
                  {off ? 'Хичээлгүй' : dismissed ? 'Тарсан' : 'Тарах'}
                </span>
                <span className="text-sm font-bold tabular-nums md:text-lg">{time || '\u00A0'}</span>
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
