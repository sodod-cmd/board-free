import { NextResponse } from 'next/server'
import { verifyPassword } from '@/lib/auth'
import { bad, guard, str } from '@/lib/crud'
import { adminsCollection } from '@/lib/models'
import { attachAuthCookies } from '@/lib/session'

export const dynamic = 'force-dynamic'

async function login(req: Request) {
  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return bad('JSON хүсэлт буруу байна.')
  }

  const username = str(body.username).toLowerCase()
  const password = typeof body.password === 'string' ? body.password : ''
  if (!username || !password) return bad('Нэвтрэх нэр болон нууц үгээ оруулна уу.')

  const col = await adminsCollection()
  const admin = await col.findOne({ username })
  if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
    return bad('Нэвтрэх нэр эсвэл нууц үг буруу байна.', 401)
  }

  const user = { sub: admin._id.toString(), username: admin.username, name: admin.name }
  const res = NextResponse.json({ admin: user })
  return attachAuthCookies(res, user)
}

export const POST = guard(login)
