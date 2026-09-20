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

export type ClassStatus = {
  id: string
  /** Ангийн нэр, ж: "1а" */
  name: string
  /** Тарах цаг "HH:mm" хэлбэрээр */
  dismissTime: string
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

// Ангийн нэр + тарах цаг. Админ энэ хэсгийг оруулна.
export const classStatuses: ClassStatus[] = [
  { id: 'c1', name: '1а', dismissTime: '12:30' },
  { id: 'c2', name: '1б', dismissTime: '12:30' },
  { id: 'c3', name: '2а', dismissTime: '13:00' },
  { id: 'c4', name: '2б', dismissTime: '13:00' },
  { id: 'c5', name: '3а', dismissTime: '13:30' },
  { id: 'c6', name: '3б', dismissTime: '13:30' },
  { id: 'c7', name: '4а', dismissTime: '14:00' },
  { id: 'c8', name: '4б', dismissTime: '14:00' },
  { id: 'c9', name: '5а', dismissTime: '14:30' },
  { id: 'c10', name: '5б', dismissTime: '14:30' },
  { id: 'c11', name: '6а', dismissTime: '15:00' },
  { id: 'c12', name: '6б', dismissTime: '15:00' },
  { id: 'c13', name: '7а', dismissTime: '15:12' },
  { id: 'c14', name: '7б', dismissTime: '15:30' },
  { id: 'c15', name: '8а', dismissTime: '16:00' },
  { id: 'c16', name: '8б', dismissTime: '16:00' },
  { id: 'c17', name: '9а', dismissTime: '16:30' },
  { id: 'c18', name: '9б', dismissTime: '16:30' },
  { id: 'c19', name: '10а', dismissTime: '17:00' },
  { id: 'c20', name: '11а', dismissTime: '17:30' },
]

/** Тарах цаг болсон эсэхийг одоогийн цагтай харьцуулж тооцно. */
export function isDismissed(dismissTime: string, now: Date = new Date()): boolean {
  const [h, m] = dismissTime.split(':').map(Number)
  const target = new Date(now)
  target.setHours(h, m, 0, 0)
  return now.getTime() >= target.getTime()
}
