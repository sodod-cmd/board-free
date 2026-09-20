import { NextResponse } from 'next/server'
import { clearAuthCookies } from '@/lib/session'

export const dynamic = 'force-dynamic'

export async function POST() {
  return clearAuthCookies(NextResponse.json({ ok: true }))
}
