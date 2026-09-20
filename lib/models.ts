import { ObjectId, type Collection, type Document } from 'mongodb'
import { getDb } from '@/lib/mongodb'

/** MongoDB-д ашиглагдах 5 collection */
export const COLLECTIONS = {
  slides: 'slides',
  news: 'news',
  ticker: 'ticker',
  classes: 'classes',
  admins: 'admins',
} as const

export type CollectionKey = keyof typeof COLLECTIONS

/* ---------------- Document төрлүүд ---------------- */

export type SlideDoc = {
  _id: ObjectId
  type: 'image' | 'youtube'
  /** image бол зургийн URL, youtube бол видеоны ID */
  src: string
  title?: string
  caption?: string
  order: number
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export type NewsDoc = {
  _id: ObjectId
  title: string
  image: string
  date?: string
  order: number
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export type TickerDoc = {
  _id: ObjectId
  text: string
  order: number
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export type ClassDoc = {
  _id: ObjectId
  /** Ангийн нэр, ж: "12а" */
  name: string
  /** Тарах цаг "HH:mm" */
  dismissTime: string
  order: number
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export type AdminDoc = {
  _id: ObjectId
  username: string
  passwordHash: string
  name?: string
  createdAt: Date
  updatedAt: Date
}

/* ---------------- Collection авах туслахууд ---------------- */

async function coll<T extends Document>(name: string): Promise<Collection<T>> {
  const db = await getDb()
  return db.collection<T>(name)
}

export const slidesCollection = () => coll<SlideDoc>(COLLECTIONS.slides)
export const newsCollection = () => coll<NewsDoc>(COLLECTIONS.news)
export const tickerCollection = () => coll<TickerDoc>(COLLECTIONS.ticker)
export const classesCollection = () => coll<ClassDoc>(COLLECTIONS.classes)
export const adminsCollection = () => coll<AdminDoc>(COLLECTIONS.admins)

/* ---------------- Туслах функцууд ---------------- */

/** _id -> id болгож, JSON рүү аюулгүй хөрвүүлнэ. passwordHash-г хэзээ ч гаргахгүй. */
export function serialize<T extends { _id: ObjectId }>(doc: T) {
  const { _id, ...rest } = doc as Record<string, unknown> & { _id: ObjectId }
  delete (rest as Record<string, unknown>).passwordHash
  const out: Record<string, unknown> = { id: _id.toString() }
  for (const [k, v] of Object.entries(rest)) {
    out[k] = v instanceof Date ? v.toISOString() : v
  }
  return out as { id: string } & Omit<T, '_id' | 'passwordHash'>
}

export function serializeMany<T extends { _id: ObjectId }>(docs: T[]) {
  return docs.map((d) => serialize(d))
}

/** Буруу ObjectId ирвэл null буцаана. */
export function toObjectId(id: string): ObjectId | null {
  return ObjectId.isValid(id) ? new ObjectId(id) : null
}
