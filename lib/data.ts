// Түр зуурын өгөгдөл. Дараа нь баазтай холбогдоно.

// Сайтын үндсэн тохиргоо. Текст болон үндсэн өнгийг эндээс өөрчилнө.
export const siteConfig = {
  schoolName: 'Нэст Эдүкэйшн IT Сургууль',
  boardSubtitle: 'Мэдээллийн самбар',
  /** Үндсэн өнгө (brand color) */
  brandColor: '#663797',
} as const

export type Slide = {
  id: string
  type: 'image' | 'youtube'
  /** image: зургийн зам, youtube: видеоны ID */
  src: string
  title?: string
  caption?: string
}

export type FeaturedNews = {
  id: string
  title: string
  image: string
  date?: string
}

export type TickerItem = {
  id: string
  text: string
}

/* ---------------- Долоо хоногийн тарах цагийн хуваарь ---------------- */

/** Хичээлтэй 5 өдөр. jsDay нь Date.getDay()-ийн утга. */
export const WEEKDAYS = [
  { key: 'mon', label: 'Даваа', short: 'Да', jsDay: 1 },
  { key: 'tue', label: 'Мягмар', short: 'Мя', jsDay: 2 },
  { key: 'wed', label: 'Лхагва', short: 'Лх', jsDay: 3 },
  { key: 'thu', label: 'Пүрэв', short: 'Пү', jsDay: 4 },
  { key: 'fri', label: 'Баасан', short: 'Ба', jsDay: 5 },
] as const

export type WeekdayKey = (typeof WEEKDAYS)[number]['key']

/** Гараг бүрийн тарах цаг "HH:mm". Хоосон бол тухайн өдөр хичээлгүй. */
export type WeekSchedule = Record<WeekdayKey, string>

export function emptySchedule(): WeekSchedule {
  return { mon: '', tue: '', wed: '', thu: '', fri: '' }
}

/** Огнооноос хичээлийн өдрийн түлхүүрийг олно. Бямба/Ням бол null. */
export function weekdayKeyFor(date: Date = new Date()): WeekdayKey | null {
  return WEEKDAYS.find((d) => d.jsDay === date.getDay())?.key ?? null
}

export function weekdayLabel(key: WeekdayKey): string {
  return WEEKDAYS.find((d) => d.key === key)?.label ?? ''
}

export type ClassStatus = {
  id: string
  /** Ангийн нэр, ж: "5А" */
  name: string
  /** Даваа–Баасан гарагуудын тарах цаг */
  schedule: WeekSchedule
}

export const slides: Slide[] = [
  {
    id: 's1',
    type: 'image',
    src: '/images/slide-award.png',
    title: 'Ерөнхийлөгчийн нэрэмжит шагнал',
    caption:
      'Нэст Эдүкэйшн IT Сургуулийн сурагч Г.Эрхэм Монгол Улсын Ерөнхийлөгчийн нэрэмжит шагнал хүртлээ!',
  },
  {
    id: 's2',
    type: 'image',
    src: '/images/slide-sport.png',
    title: 'Намрын Спартакиад',
    caption: 'Ахлах ангийн Намрын Спартакиад амжилттай зохион байгуулагдлаа!',
  },
  {
    id: 's3',
    type: 'youtube',
    src: 'aqz-KE-bpKQ',
    title: 'Сургуулийн танилцуулга',
    caption: 'Манай сургуулийн шинэ хичээлийн жилийн видео танилцуулга',
  },
  {
    id: 's4',
    type: 'image',
    src: '/images/slide-classroom.png',
    title: 'Мэдээллийн технологийн хичээл',
    caption: 'Орчин үеийн тоног төхөөрөмжтэй компьютерийн анги нээгдлээ.',
  },
]

export const featuredNews: FeaturedNews[] = [
  {
    id: 'n1',
    title:
      'Нэст Эдүкэйшн IT Сургуулийн сурагч Г.Эрхэм Монгол Улсын Ерөнхийлөгчийн нэрэмжит шагнал хүртлээ!',
    image: '/images/slide-award.png',
    date: '2026-09-18',
  },
  {
    id: 'n2',
    title: 'Ахлах ангийн Намрын Спартакиад амжилттай зохион байгуулагдлаа!',
    image: '/images/slide-sport.png',
    date: '2026-09-16',
  },
  {
    id: 'n3',
    title: 'Орчин үеийн тоног төхөөрөмжтэй компьютерийн анги нээгдлээ.',
    image: '/images/slide-classroom.png',
    date: '2026-09-14',
  },
  {
    id: 'n4',
    title: 'Урлагийн наадам өнгөрсөн долоо хоногт өндөр амжилттай боллоо.',
    image: '/images/news-event.png',
    date: '2026-09-12',
  },
  {
    id: 'n5',
    title: 'Багш нарын хөгжлийн сургалт зохион байгуулагдана.',
    image: '/images/slide-classroom.png',
    date: '2026-09-10',
  },
  {
    id: 'n6',
    title: 'Эцэг эхийн хурал ирэх Бямба гарагт болно.',
    image: '/images/news-event.png',
    date: '2026-09-08',
  },
]

export const tickerItems: TickerItem[] = [
  { id: 't1', text: 'Ахлах ангийн Намрын Спартакиад амжилттай зохион байгуулагдлаа!' },
  { id: 't2', text: 'Сурагч Г.Эрхэм Ерөнхийлөгчийн нэрэмжит шагнал хүртлээ!' },
  { id: 't3', text: 'Эцэг эхийн хурал ирэх Бямба гарагт 11:00 цагт болно.' },
  { id: 't4', text: 'Орчин үеийн компьютерийн анги шинээр нээгдлээ.' },
  { id: 't5', text: 'Урлагийн наадам өндөр амжилттай зохион байгуулагдлаа.' },
]

// Анги бүрийн долоо хоногийн тарах цаг. Админ энэ хэсгийг удирдана.
export const classStatuses: ClassStatus[] = [
  { id: 'c1', name: '1А', schedule: { mon: '14:20', tue: '14:20', wed: '13:40', thu: '13:40', fri: '13:40' } },
  { id: 'c2', name: '1Б', schedule: { mon: '14:20', tue: '14:20', wed: '13:40', thu: '13:40', fri: '13:40' } },
  { id: 'c3', name: '1В', schedule: { mon: '14:20', tue: '14:20', wed: '13:40', thu: '13:40', fri: '13:40' } },
  { id: 'c4', name: '2А', schedule: { mon: '14:40', tue: '13:40', wed: '14:20', thu: '14:20', fri: '13:40' } },
  { id: 'c5', name: '2Б', schedule: { mon: '14:40', tue: '13:40', wed: '14:20', thu: '14:20', fri: '13:40' } },
  { id: 'c6', name: '3А', schedule: { mon: '14:40', tue: '13:50', wed: '14:30', thu: '14:30', fri: '13:50' } },
  { id: 'c7', name: '3Б', schedule: { mon: '14:40', tue: '13:50', wed: '14:30', thu: '14:30', fri: '13:50' } },
  { id: 'c8', name: '3В', schedule: { mon: '14:40', tue: '13:50', wed: '14:30', thu: '14:30', fri: '13:50' } },
  { id: 'c9', name: '4А', schedule: { mon: '14:50', tue: '14:20', wed: '14:40', thu: '14:40', fri: '14:20' } },
  { id: 'c10', name: '4Б', schedule: { mon: '14:50', tue: '14:20', wed: '14:40', thu: '14:40', fri: '14:20' } },
  { id: 'c11', name: '4В', schedule: { mon: '14:50', tue: '14:20', wed: '14:40', thu: '14:40', fri: '14:20' } },
  { id: 'c12', name: '4Г', schedule: { mon: '14:50', tue: '14:20', wed: '14:40', thu: '14:40', fri: '14:20' } },
  { id: 'c13', name: '5А', schedule: { mon: '14:55', tue: '14:50', wed: '14:50', thu: '14:50', fri: '15:00' } },
  { id: 'c14', name: '5Б', schedule: { mon: '14:55', tue: '14:50', wed: '14:50', thu: '14:50', fri: '15:00' } },
  { id: 'c15', name: '5В', schedule: { mon: '14:55', tue: '14:50', wed: '14:50', thu: '14:50', fri: '15:00' } },
  { id: 'c16', name: '5Г', schedule: { mon: '14:55', tue: '14:50', wed: '14:50', thu: '14:50', fri: '15:00' } },
  { id: 'c17', name: '5Е', schedule: { mon: '14:55', tue: '14:50', wed: '14:50', thu: '14:50', fri: '15:00' } },
  { id: 'c18', name: '6А', schedule: { mon: '14:50', tue: '14:50', wed: '14:50', thu: '14:50', fri: '12:35' } },
  { id: 'c19', name: '6Б', schedule: { mon: '14:50', tue: '14:50', wed: '14:50', thu: '14:50', fri: '12:35' } },
  { id: 'c20', name: '6В', schedule: { mon: '14:50', tue: '14:50', wed: '14:50', thu: '14:50', fri: '12:35' } },
  { id: 'c21', name: '6Г', schedule: { mon: '14:50', tue: '14:50', wed: '14:50', thu: '14:50', fri: '12:35' } },
  { id: 'c22', name: '7А', schedule: { mon: '14:50', tue: '14:50', wed: '15:35', thu: '14:50', fri: '14:50' } },
  { id: 'c23', name: '7Б', schedule: { mon: '14:50', tue: '14:50', wed: '15:35', thu: '14:50', fri: '14:50' } },
  { id: 'c24', name: '8А', schedule: { mon: '14:50', tue: '14:50', wed: '15:35', thu: '14:50', fri: '14:50' } },
  { id: 'c25', name: '8Б', schedule: { mon: '14:50', tue: '14:50', wed: '15:35', thu: '14:50', fri: '14:50' } },
  { id: 'c26', name: '9А', schedule: { mon: '14:50', tue: '14:50', wed: '15:35', thu: '14:50', fri: '14:50' } },
  { id: 'c27', name: '9Б', schedule: { mon: '14:50', tue: '14:50', wed: '15:35', thu: '14:50', fri: '14:50' } },
  { id: 'c28', name: '10А', schedule: { mon: '14:50', tue: '15:35', wed: '14:50', thu: '15:35', fri: '12:35' } },
  { id: 'c29', name: '10Б', schedule: { mon: '14:50', tue: '15:35', wed: '14:50', thu: '15:35', fri: '12:35' } },
  { id: 'c30', name: '11А', schedule: { mon: '15:35', tue: '16:20', wed: '14:50', thu: '15:35', fri: '13:20' } },
  { id: 'c31', name: '11Б', schedule: { mon: '14:50', tue: '16:20', wed: '15:35', thu: '15:35', fri: '13:20' } },
  { id: 'c32', name: '12А', schedule: { mon: '17:05', tue: '15:35', wed: '15:35', thu: '14:50', fri: '14:50' } },
  { id: 'c33', name: '12Б', schedule: { mon: '17:05', tue: '17:05', wed: '13:20', thu: '14:50', fri: '14:50' } },
]

/** Тарах цаг болсон эсэхийг одоогийн цагтай харьцуулж тооцно. */
export function isDismissed(dismissTime: string, now: Date = new Date()): boolean {
  const [h, m] = dismissTime.split(':').map(Number)
  const target = new Date(now)
  target.setHours(h, m, 0, 0)
  return now.getTime() >= target.getTime()
}
