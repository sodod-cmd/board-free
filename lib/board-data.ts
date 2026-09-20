import {
  classStatuses as fallbackClasses,
  featuredNews as fallbackNews,
  slides as fallbackSlides,
  tickerItems as fallbackTicker,
  type ClassStatus,
  type FeaturedNews,
  type Slide,
  type TickerItem,
} from '@/lib/data'
import {
  classesCollection,
  newsCollection,
  slidesCollection,
  tickerCollection,
} from '@/lib/models'

export type BoardData = {
  slides: Slide[]
  news: FeaturedNews[]
  ticker: TickerItem[]
  classes: ClassStatus[]
  /** Бааз ажиллахгүй эсвэл хоосон үед түр өгөгдөл ашигласан эсэх */
  usedFallback: boolean
}

const ACTIVE = { active: { $ne: false } }

/**
 * Самбарын бүх өгөгдлийг MongoDB-оос уншина.
 * Бааз унтарсан эсвэл seed хийгдээгүй бол дэлгэц хоосрохгүйн тулд түр өгөгдөл рүү шилжинэ.
 */
export async function getBoardData(): Promise<BoardData> {
  try {
    const [slidesCol, newsCol, tickerCol, classesCol] = await Promise.all([
      slidesCollection(),
      newsCollection(),
      tickerCollection(),
      classesCollection(),
    ])

    const [slideDocs, newsDocs, tickerDocs, classDocs] = await Promise.all([
      slidesCol.find(ACTIVE).sort({ order: 1 }).toArray(),
      newsCol.find(ACTIVE).sort({ order: 1 }).toArray(),
      tickerCol.find(ACTIVE).sort({ order: 1 }).toArray(),
      classesCol.find(ACTIVE).sort({ dismissTime: 1, name: 1 }).toArray(),
    ])

    const slides: Slide[] = slideDocs.map((d) => ({
      id: d._id.toString(),
      type: d.type === 'youtube' ? 'youtube' : 'image',
      src: d.src,
      title: d.title || undefined,
      caption: d.caption || undefined,
    }))

    const news: FeaturedNews[] = newsDocs.map((d) => ({
      id: d._id.toString(),
      title: d.title,
      image: d.image,
      date: d.date || undefined,
    }))

    const ticker: TickerItem[] = tickerDocs.map((d) => ({
      id: d._id.toString(),
      text: d.text,
    }))

    const classes: ClassStatus[] = classDocs.map((d) => ({
      id: d._id.toString(),
      name: d.name,
      dismissTime: d.dismissTime,
    }))

    const empty = !slides.length && !news.length && !ticker.length && !classes.length
    if (empty) return fallbackData()

    return {
      slides: slides.length ? slides : fallbackSlides,
      news: news.length ? news : fallbackNews,
      ticker: ticker.length ? ticker : fallbackTicker,
      classes,
      usedFallback: false,
    }
  } catch (err) {
    console.error('Самбарын өгөгдөл уншиж чадсангүй:', err)
    return fallbackData()
  }
}

function fallbackData(): BoardData {
  return {
    slides: fallbackSlides,
    news: fallbackNews,
    ticker: fallbackTicker,
    classes: fallbackClasses,
    usedFallback: true,
  }
}
