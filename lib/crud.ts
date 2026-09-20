import type { Collection, Document } from 'mongodb'
import { NextResponse } from 'next/server'
import { serialize, serializeMany, toObjectId } from '@/lib/models'
import { requireAdmin } from '@/lib/session'

export type ParseResult =
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; error: string }

export type Resource = {
  /** Collection-ийг авах функц */
  collection: () => Promise<Collection<any>>
  /** Талбаруудыг шалгаж, цэвэрлэнэ. partial=true үед зөвхөн ирсэн талбарыг шалгана. */
  parse: (body: Record<string, unknown>, partial: boolean) => ParseResult
  /** Жагсаалтын эрэмбэ */
  sort?: Document
}

export const bad = (error: string, status = 400) => NextResponse.json({ error }, { status })

/** Гэнэтийн алдаа (ж: бааз унтарсан) үед ч JSON хариу буцаахын тулд боож өгнө. */
export function guard<A extends unknown[]>(
  fn: (...args: A) => Promise<NextResponse>,
): (...args: A) => Promise<NextResponse> {
  return async (...args: A) => {
    try {
      return await fn(...args)
    } catch (err) {
      console.error('API алдаа:', err)
      return bad('Серверийн алдаа гарлаа. Өгөгдлийн сангийн холболтыг шалгана уу.', 500)
    }
  }
}

export function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : ''
}

export function bool(v: unknown, fallback = true): boolean {
  if (typeof v === 'boolean') return v
  if (v === 'true') return true
  if (v === 'false') return false
  return fallback
}

export function num(v: unknown): number | undefined {
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? n : undefined
}

/** Дараагийн эрэмбийн дугаарыг олно. */
async function nextOrder(col: Collection<any>): Promise<number> {
  const last = await col.find({}).sort({ order: -1 }).limit(1).toArray()
  return (last[0]?.order ?? -1) + 1
}

/** GET (жагсаалт) ба POST (нэмэх) */
export function listHandlers(resource: Resource) {
  const GET = async () => {
    const auth = await requireAdmin()
    if (!auth.ok) return auth.response
    const col = await resource.collection()
    const docs = await col.find({}).sort(resource.sort ?? { order: 1 }).toArray()
    return NextResponse.json({ items: serializeMany(docs as any) })
  }

  const POST = async (req: Request) => {
    const auth = await requireAdmin()
    if (!auth.ok) return auth.response

    let body: Record<string, unknown>
    try {
      body = (await req.json()) as Record<string, unknown>
    } catch {
      return bad('JSON хүсэлт буруу байна.')
    }

    const parsed = resource.parse(body, false)
    if (!parsed.ok) return bad(parsed.error)

    const col = await resource.collection()
    const now = new Date()
    const doc = {
      ...parsed.data,
      order: (parsed.data.order as number | undefined) ?? (await nextOrder(col)),
      createdAt: now,
      updatedAt: now,
    }
    const res = await col.insertOne(doc as any)
    return NextResponse.json({ item: serialize({ ...doc, _id: res.insertedId } as any) }, { status: 201 })
  }

  return { GET: guard(GET), POST: guard(POST) }
}

/** PATCH/PUT (засах) ба DELETE (устгах) */
export function itemHandlers(
  resource: Resource,
  hooks?: { beforeDelete?: (doc: any) => Promise<void> },
) {
  type Ctx = { params: Promise<{ id: string }> }

  const PATCH = async (req: Request, ctx: Ctx) => {
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

    const parsed = resource.parse(body, true)
    if (!parsed.ok) return bad(parsed.error)

    const col = await resource.collection()
    const updated = await col.findOneAndUpdate(
      { _id },
      { $set: { ...parsed.data, updatedAt: new Date() } },
      { returnDocument: 'after' },
    )
    if (!updated) return bad('Олдсонгүй.', 404)
    return NextResponse.json({ item: serialize(updated as any) })
  }

  const DELETE = async (_req: Request, ctx: Ctx) => {
    const auth = await requireAdmin()
    if (!auth.ok) return auth.response

    const { id } = await ctx.params
    const _id = toObjectId(id)
    if (!_id) return bad('ID буруу байна.')

    const col = await resource.collection()
    const doc = await col.findOne({ _id })
    if (!doc) return bad('Олдсонгүй.', 404)

    await hooks?.beforeDelete?.(doc)
    await col.deleteOne({ _id })
    return NextResponse.json({ ok: true })
  }

  const wrapped = guard(PATCH)
  return { PATCH: wrapped, PUT: wrapped, DELETE: guard(DELETE) }
}
