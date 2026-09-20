import { NextResponse } from 'next/server'
import { getCurrentAdmin } from '@/lib/session'

export const dynamic = 'force-dynamic'

export async function GET() {
  const admin = await getCurrentAdmin()
  if (!admin) return NextResponse.json({ admin: null }, { status: 401 })
  return NextResponse.json({
    admin: { id: admin.sub, username: admin.username, name: admin.name },
  })
}
