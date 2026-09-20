import { NextResponse } from 'next/server'
import { hashPassword } from '@/lib/auth'
import { bad, guard, str } from '@/lib/crud'
import { adminsCollection, serializeMany } from '@/lib/models'
import { requireAdmin } from '@/lib/session'

export const dynamic = 'force-dynamic'

async function list() {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response

  const col = await adminsCollection()
  const docs = await col.find({}, { projection: { passwordHash: 0 } }).sort({ createdAt: 1 }).toArray()
  return NextResponse.json({ items: serializeMany(docs as any) })
}

async function create(req: Request) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response

  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return bad('JSON хүсэлт буруу байна.')
  }

  const username = str(body.username).toLowerCase()
  const password = typeof body.password === 'string' ? body.password : ''
  const name = str(body.name)

  if (username.length < 3) return bad('Нэвтрэх нэр дор хаяж 3 тэмдэгт байх ёстой.')
  if (password.length < 6) return bad('Нууц үг дор хаяж 6 тэмдэгт байх ёстой.')

  const col = await adminsCollection()
  if (await col.findOne({ username })) return bad('Ийм нэвтрэх нэртэй админ бүртгэлтэй байна.', 409)

  const now = new Date()
  const doc = {
    username,
    name,
    passwordHash: await hashPassword(password),
    createdAt: now,
    updatedAt: now,
  }
  const res = await col.insertOne(doc as any)

  return NextResponse.json(
    { item: { id: res.insertedId.toString(), username, name, createdAt: now.toISOString() } },
    { status: 201 },
  )
}

export const GET = guard(list)
export const POST = guard(create)
