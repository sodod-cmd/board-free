import { NextResponse } from 'next/server'
import { hashPassword } from '@/lib/auth'
import { bad, guard, str } from '@/lib/crud'
import { adminsCollection, serialize, toObjectId } from '@/lib/models'
import { requireAdmin } from '@/lib/session'

export const dynamic = 'force-dynamic'

type Ctx = { params: Promise<{ id: string }> }

async function update(req: Request, ctx: Ctx) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response

  const { id } = await ctx.params
  const _id = toObjectId(id)
  if (!_id) return bad('ID буруу байна.')

  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return bad('JSON хүсэлт буруу байна.')
  }

  const col = await adminsCollection()
  const update: Record<string, unknown> = { updatedAt: new Date() }

  if ('username' in body) {
    const username = str(body.username).toLowerCase()
    if (username.length < 3) return bad('Нэвтрэх нэр дор хаяж 3 тэмдэгт байх ёстой.')
    const dup = await col.findOne({ username })
    if (dup && dup._id.toString() !== id) return bad('Ийм нэвтрэх нэр аль хэдийн бүртгэлтэй.', 409)
    update.username = username
  }

  if ('name' in body) update.name = str(body.name)

  if (typeof body.password === 'string' && body.password.length > 0) {
    if (body.password.length < 6) return bad('Нууц үг дор хаяж 6 тэмдэгт байх ёстой.')
    update.passwordHash = await hashPassword(body.password)
  }

  const updated = await col.findOneAndUpdate(
    { _id },
    { $set: update },
    { returnDocument: 'after', projection: { passwordHash: 0 } },
  )
  if (!updated) return bad('Админ олдсонгүй.', 404)

  return NextResponse.json({ item: serialize(updated as any) })
}



async function remove(_req: Request, ctx: Ctx) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response

  const { id } = await ctx.params
  const _id = toObjectId(id)
  if (!_id) return bad('ID буруу байна.')

  if (auth.admin.sub === id) return bad('Өөрийн бүртгэлээ устгах боломжгүй.')

  const col = await adminsCollection()
  if ((await col.countDocuments()) <= 1) return bad('Сүүлчийн админыг устгах боломжгүй.')

  const res = await col.deleteOne({ _id })
  if (res.deletedCount === 0) return bad('Админ олдсонгүй.', 404)

  return NextResponse.json({ ok: true })
}

export const PATCH = guard(update)
export const PUT = guard(update)
export const DELETE = guard(remove)
