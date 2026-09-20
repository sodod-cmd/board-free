import Image from 'next/image'
import { HeroSlider } from '@/components/hero-slider'
import { FeaturedNewsPanel } from '@/components/featured-news'
import { NewsTicker } from '@/components/news-ticker'
import { ClassStatusBoard } from '@/components/class-status-board'
import { DisplayClock } from '@/components/display-clock'
import { DisplayWeather } from '@/components/display-weather'
import { BoardAutoRefresh } from '@/components/board-auto-refresh'
import { getBoardData } from '@/lib/board-data'
import { siteConfig } from '@/lib/data'

// Самбар нь үргэлж шинэ өгөгдөл харуулах ёстой тул кэшлэхгүй.
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DisplayPage() {
  const { slides, news, ticker, classes } = await getBoardData()

  return (
    <main
      className="bg-app flex h-dvh w-full flex-col overflow-hidden"
      style={{ '--primary': siteConfig.brandColor } as React.CSSProperties}
    >
      {/* Админ өөрчлөлт хийхэд дэлгэц өөрөө шинэчлэгдэнэ */}
      <BoardAutoRefresh />

      {/* Толгой хэсэг */}
      <header className="bg-brand-gradient sheen flex flex-none items-center justify-between px-5 py-3 text-primary-foreground shadow-lg shadow-primary/20 md:px-8 md:py-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center rounded-lg bg-primary-foreground p-1.5 md:p-2">
            <Image
              src="/images/logo.webp"
              alt="Нэст Эдүкэйшн IT Сургуулийн лого"
              width={140}
              height={44}
              priority
              className="h-8 w-auto md:h-10"
            />
          </span>
          <div className="leading-tight">
            <h1 className="text-lg font-bold tracking-tight md:text-2xl">
              {siteConfig.schoolName}
            </h1>
            <p className="text-xs text-primary-foreground/80 md:text-sm">
              {siteConfig.boardSubtitle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-6 lg:gap-8">
          <DisplayWeather />
          <div className="h-10 w-px bg-primary-foreground/20 md:h-12" aria-hidden />
          <DisplayClock />
        </div>
      </header>

      {/* Дээд хэсэг: Slider + Онцлох мэдээ */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="min-h-0 flex-1 lg:basis-[70%]">
          <HeroSlider slides={slides} />
        </div>
        <div className="glass-panel glass-tint h-[40%] min-h-0 border-t border-white/40 lg:h-auto lg:w-[30%] lg:border-l lg:border-t-0">
          <FeaturedNewsPanel news={news} />
        </div>
      </div>

      {/* Урсдаг мэдээ */}
      <div className="flex-none">
        <NewsTicker items={ticker} />
      </div>

      {/* Доод хэсэг: Ангиудын тарсан байдал */}
      <div className="glass-panel h-[26dvh] flex-none border-t border-white/40 pb-3 md:pb-4">
        <ClassStatusBoard classes={classes} />
      </div>
    </main>
  )
}
