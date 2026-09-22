import {
  classesCollection,
  newsCollection,
  slidesCollection,
  tickerCollection,
} from '@/lib/models'
import { bool, num, str, type ParseResult, type Resource } from '@/lib/crud'
import { WEEKDAYS, emptySchedule, type WeekSchedule } from '@/lib/data'

/** YouTube-ийн бүтэн холбоосоос видеоны ID-г салгана. */
export function youtubeId(input: string): string {
  const v = input.trim()
  const m =
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{6,})/i.exec(v)
  return m ? m[1] : v
}

/** "9:5" -> "09:05" хэлбэрт хөрвүүлж, буруу бол null буцаана. */
export function normalizeTime(input: string): string | null {
  const m = /^(\d{1,2}):(\d{1,2})$/.exec(input.trim())
  if (!m) return null
  const h = Number(m[1])
  const mi = Number(m[2])
  if (h > 23 || mi > 59) return null
  return `${String(h).padStart(2, '0')}:${String(mi).padStart(2, '0')}`
}

/** order / active талбаруудыг нийтлэг байдлаар боловсруулна. */
function common(body: Record<string, unknown>, partial: boolean, data: Record<string, unknown>) {
  if ('order' in body) {
    const o = num(body.order)
    if (o !== undefined) data.order = o
  }
  if ('active' in body) data.active = bool(body.active)
  else if (!partial) data.active = true
  return data
}

export const slidesResource: Resource = {
  collection: slidesCollection,
  parse(body, partial): ParseResult {
    const data: Record<string, unknown> = {}

    if (!partial || 'type' in body) {
      const type = str(body.type) || 'image'
      if (type !== 'image' && type !== 'youtube')
        return { ok: false, error: 'Слайдын төрөл image эсвэл youtube байх ёстой.' }
      data.type = type
    }

    if (!partial || 'src' in body) {
      const raw = str(body.src)
      if (!raw) return { ok: false, error: 'Зураг эсвэл YouTube холбоос заавал шаардлагатай.' }
      const type = (data.type as string) ?? str(body.type) ?? 'image'
      data.src = type === 'youtube' ? youtubeId(raw) : raw
    }

    if (!partial || 'title' in body) data.title = str(body.title)
    if (!partial || 'caption' in body) data.caption = str(body.caption)

    return { ok: true, data: common(body, partial, data) }
  },
}

export const newsResource: Resource = {
  collection: newsCollection,
  parse(body, partial): ParseResult {
    const data: Record<string, unknown> = {}

    if (!partial || 'title' in body) {
      const title = str(body.title)
      if (!title) return { ok: false, error: 'Мэдээний гарчиг заавал шаардлагатай.' }
      data.title = title
    }

    if (!partial || 'image' in body) {
      const image = str(body.image)
      if (!image) return { ok: false, error: 'Мэдээний зураг заавал шаардлагатай.' }
      data.image = image
    }

    if (!partial || 'date' in body) {
      const date = str(body.date)
      if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date))
        return { ok: false, error: 'Огноо YYYY-MM-DD хэлбэртэй байх ёстой.' }
      data.date = date
    }

    return { ok: true, data: common(body, partial, data) }
  },
}

export const tickerResource: Resource = {
  collection: tickerCollection,
  parse(body, partial): ParseResult {
    const data: Record<string, unknown> = {}
    if (!partial || 'text' in body) {
      const text = str(body.text)
      if (!text) return { ok: false, error: 'Урсдаг мэдээний текст заавал шаардлагатай.' }
      data.text = text
    }
    return { ok: true, data: common(body, partial, data) }
  },
}

/**
 * Ирсэн өгөгдлөөс Даваа–Баасны хуваарийг цуглуулна.
 * `schedule` объект, эсвэл хуучин `dismissTime` (бүх өдөрт нэг цаг) хоёуланг хүлээж авна.
 */
export function parseSchedule(
  body: Record<string, unknown>,
): { ok: true; schedule: WeekSchedule } | { ok: false; error: string } {
  const raw = (body.schedule ?? {}) as Record<string, unknown>
  const legacy = 'dismissTime' in body ? normalizeTime(str(body.dismissTime)) : null
  const schedule = emptySchedule()

  for (const day of WEEKDAYS) {
    const value = str(raw[day.key])
    if (!value) {
      // Хуваарь огт ирээгүй үед хуучин нэг цагийг бүх өдөрт тавина.
      if (!('schedule' in body) && legacy) schedule[day.key] = legacy
      continue
    }
    const time = normalizeTime(value)
    if (!time)
      return { ok: false, error: `${day.label} гарагийн цаг HH:mm хэлбэртэй байх ёстой (ж: 15:30).` }
    schedule[day.key] = time
  }

  if (!WEEKDAYS.some((d) => schedule[d.key]))
    return { ok: false, error: 'Дор хаяж нэг гарагийн тарах цагийг оруулна уу.' }

  return { ok: true, schedule }
}

export const classesResource: Resource = {
  collection: classesCollection,
  sort: { order: 1, name: 1 },
  parse(body, partial): ParseResult {
    const data: Record<string, unknown> = {}

    if (!partial || 'name' in body) {
      const name = str(body.name)
      if (!name) return { ok: false, error: 'Ангийн нэр заавал шаардлагатай (ж: 12А).' }
      data.name = name
    }

    if (!partial || 'schedule' in body || 'dismissTime' in body) {
      const parsed = parseSchedule(body)
      if (!parsed.ok) return { ok: false, error: parsed.error }
      data.schedule = parsed.schedule
      // Хуучин талбарыг цэвэрлэж, зөвхөн schedule-ээр явна.
      data.dismissTime = ''
    }

    return { ok: true, data: common(body, partial, data) }
  },
}
