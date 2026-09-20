'use client'

import { useEffect, useState } from 'react'

const WEEKDAYS = ['Ням', 'Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан', 'Бямба']

export function DisplayClock() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (!now) {
    return <span className="tabular-nums text-primary-foreground/70">--:--:--</span>
  }

  const pad = (n: number) => n.toString().padStart(2, '0')
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
  const date = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())} · ${WEEKDAYS[now.getDay()]}`

  return (
    <div className="flex flex-col items-end leading-tight">
      <span className="text-2xl font-bold tabular-nums md:text-3xl lg:text-4xl">{time}</span>
      <span className="text-xs text-primary-foreground/80 md:text-sm">{date}</span>
    </div>
  )
}
