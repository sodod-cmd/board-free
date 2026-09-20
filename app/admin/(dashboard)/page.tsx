import Link from 'next/link'
import {
  Database,
  GraduationCap,
  Images,
  Megaphone,
  Monitor,
  Star,
  Users,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import {
  adminsCollection,
  classesCollection,
  newsCollection,
  slidesCollection,
  tickerCollection,
} from '@/lib/models'

export const dynamic = 'force-dynamic'

async function counts() {
  try {
    const [slides, news, ticker, classes, admins] = await Promise.all([
      slidesCollection().then((c) => c.countDocuments()),
      newsCollection().then((c) => c.countDocuments()),
      tickerCollection().then((c) => c.countDocuments()),
      classesCollection().then((c) => c.countDocuments()),
      adminsCollection().then((c) => c.countDocuments()),
    ])
    return { slides, news, ticker, classes, admins, error: false }
  } catch {
    return { slides: 0, news: 0, ticker: 0, classes: 0, admins: 0, error: true }
  }
}

export default async function AdminHomePage() {
  const data = await counts()

  const cards = [
    { href: '/admin/slides', label: 'Слайдер', value: data.slides, icon: Images },
    { href: '/admin/news', label: 'Онцлох мэдээ', value: data.news, icon: Star },
    { href: '/admin/ticker', label: 'Урсдаг мэдээ', value: data.ticker, icon: Megaphone },
    { href: '/admin/classes', label: 'Ангиуд', value: data.classes, icon: GraduationCap },
    { href: '/admin/admins', label: 'Админууд', value: data.admins, icon: Users },
  ]

  const empty = !data.error && cards.every((c) => c.value === 0)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Хяналтын самбар</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Сургуулийн TV самбарт харагдах мэдээллийг эндээс удирдана.
        </p>
      </div>

      {data.error && (
        <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Өгөгдлийн сантай холбогдож чадсангүй. .env доторх MONGODB_URI-г шалгана уу.
        </p>
      )}

      {empty && (
        <Card>
          <CardContent className="flex flex-col gap-3 py-5">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Database className="size-4" />
              Бааз хоосон байна
            </div>
            <p className="text-sm text-muted-foreground">
              Одоо байгаа жишээ өгөгдлийг баазад оруулахын тулд{' '}
              <Link href="/api/seed" target="_blank" className="font-medium text-primary underline">
                /api/seed
              </Link>{' '}
              хаягаар нэг удаа орно уу. Бүгдийг цэвэрлээд дахин бичих бол{' '}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">/api/seed?force=1</code>.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ href, label, value, icon: Icon }) => (
          <Link key={href} href={href}>
            <Card className="transition-colors hover:border-primary/40 hover:bg-muted/40">
              <CardContent className="flex items-center justify-between py-5">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
                </div>
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}

        <Link href="/" target="_blank">
          <Card className="transition-colors hover:border-primary/40 hover:bg-muted/40">
            <CardContent className="flex items-center justify-between py-5">
              <div>
                <p className="text-sm text-muted-foreground">Самбар</p>
                <p className="mt-1 text-base font-medium">Шинэ цонхонд нээх</p>
              </div>
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Monitor className="size-5" />
              </span>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
