'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * TV самбар нь хүн оролцоогүйгээр ажилладаг тул админ өөрчлөлт хийхэд
 * дэлгэц өөрөө шинэчлэгдэхийн тулд тогтмол хугацаанд серверээс дахин уншина.
 */
export function BoardAutoRefresh({ intervalMs = 60_000 }: { intervalMs?: number }) {
  const router = useRouter()

  useEffect(() => {
    const timer = setInterval(() => router.refresh(), intervalMs)
    return () => clearInterval(timer)
  }, [router, intervalMs])

  return null
}
