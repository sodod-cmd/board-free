import { NextResponse } from 'next/server'
import { hashPassword } from '@/lib/auth'
import {
  classStatuses,
  featuredNews,
  slides as seedSlides,
  tickerItems,
} from '@/lib/data'
import {
  adminsCollection,
  classesCollection,
  newsCollection,
  slidesCollection,
  tickerCollection,
} from '@/lib/models'

export const dynamic = 'force-dynamic'

const SEED_ADMIN = { username: 'admin', password: 'Nest123$', name: 'Үндсэн админ' }

/**
 * Одоо байгаа түр өгөгдлийг MongoDB рүү оруулна.
 *   /api/seed          — хоосон collection-уудыг л дүүргэнэ
 *   /api/seed?force=1  — бүгдийг цэвэрлээд дахин бичнэ
 */
async function seed(force: boolean) {
  const now = new Date()
  const [slidesCol, newsCol, tickerCol, classesCol, adminsCol] = await Promise.all([
    slidesCollection(),
    newsCollection(),
    tickerCollection(),
    classesCollection(),
    adminsCollection(),
  ])

  await adminsCol.createIndex({ username: 1 }, { unique: true })

  const result: Record<string, string> = {}

  const fill = async (
    key: string,
    col: { countDocuments: () => Promise<number>; deleteMany: (f: any) => Promise<any>; insertMany: (d: any[]) => Promise<any> },
    docs: Record<string, unknown>[],
  ) => {
    const count = await col.countDocuments()
    if (count > 0 && !force) {
      result[key] = `алгасав (${count} бичлэгтэй)`
      return
    }
    if (force) await col.deleteMany({})
    if (docs.length) await col.insertMany(docs)
    result[key] = `${docs.length} бичлэг нэмэгдлээ`
  }

  await fill(
    'slides',
    slidesCol as any,
    seedSlides.map((s, i) => ({
      type: s.type,
      src: s.src,
      title: s.title ?? '',
      caption: s.caption ?? '',
      order: i,
      active: true,
      createdAt: now,
      updatedAt: now,
    })),
  )

  await fill(
    'news',
    newsCol as any,
    featuredNews.map((n, i) => ({
      title: n.title,
      image: n.image,
      date: n.date ?? '',
      order: i,
      active: true,
      createdAt: now,
      updatedAt: now,
    })),
  )

  await fill(
    'ticker',
    tickerCol as any,
    tickerItems.map((t, i) => ({
      text: t.text,
      order: i,
      active: true,
      createdAt: now,
      updatedAt: now,
    })),
  )

  await fill(
    'classes',
    classesCol as any,
    classStatuses.map((c, i) => ({
      name: c.name,
      schedule: c.schedule,
      order: i,
      active: true,
      createdAt: now,
      updatedAt: now,
    })),
  )

  // Админ: байхгүй бол үүсгэнэ, force үед нууц үгийг нь сэргээнэ.
  const existing = await adminsCol.findOne({ username: SEED_ADMIN.username })
  if (!existing) {
    await adminsCol.insertOne({
      username: SEED_ADMIN.username,
      name: SEED_ADMIN.name,
      passwordHash: await hashPassword(SEED_ADMIN.password),
      createdAt: now,
      updatedAt: now,
    } as any)
    result.admins = `"${SEED_ADMIN.username}" админ үүслээ`
  } else if (force) {
    await adminsCol.updateOne(
      { _id: existing._id },
      { $set: { passwordHash: await hashPassword(SEED_ADMIN.password), updatedAt: now } },
    )
    result.admins = `"${SEED_ADMIN.username}" админы нууц үг сэргээгдлээ`
  } else {
    result.admins = 'алгасав (админ бүртгэлтэй)'
  }

  return result
}

async function run(req: Request) {
  const force = new URL(req.url).searchParams.get('force') === '1'
  try {
    const result = await seed(force)
    return NextResponse.json({
      ok: true,
      force,
      result,
      login: { username: SEED_ADMIN.username, password: SEED_ADMIN.password },
      next: '/admin/login',
    })
  } catch (err) {
    console.error('Seed error', err)
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Seed амжилтгүй боллоо.' },
      { status: 500 },
    )
  }
}

export const GET = run
export const POST = run
