'use client'

import { Badge } from '@/components/ui/badge'
import { ResourceManager, type Column } from '@/components/admin/resource-manager'
import type { Field } from '@/components/admin/field-form'

type SlideItem = {
  id: string
  type: 'image' | 'youtube'
  src: string
  title?: string
  caption?: string
  active?: boolean
  order?: number
}

const fields: Field[] = [
  {
    name: 'type',
    label: 'Төрөл',
    type: 'select',
    options: [
      { value: 'image', label: 'Зураг' },
      { value: 'youtube', label: 'YouTube видео' },
    ],
  },
  {
    name: 'src',
    label: 'Зураг',
    type: 'image',
    folder: 'slides',
    required: true,
    visibleIf: (v) => v.type !== 'youtube',
  },
  {
    name: 'src',
    label: 'YouTube холбоос эсвэл ID',
    type: 'text',
    required: true,
    placeholder: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    help: 'Бүтэн холбоос буулгасан ч видеоны ID автоматаар салгагдана.',
    visibleIf: (v) => v.type === 'youtube',
  },
  { name: 'title', label: 'Гарчиг', type: 'text', placeholder: 'Ж: Намрын Спартакиад' },
  {
    name: 'caption',
    label: 'Тайлбар',
    type: 'textarea',
    placeholder: 'Слайдын доод хэсэгт харагдах текст',
  },
  { name: 'active', label: 'Самбарт харуулах', type: 'checkbox' },
]

const columns: Column<SlideItem>[] = [
  {
    key: 'preview',
    header: 'Урьдчилан харах',
    className: 'w-32',
    render: (item) =>
      item.type === 'youtube' ? (
        <img
          src={`https://img.youtube.com/vi/${item.src}/default.jpg`}
          alt=""
          className="h-12 w-20 rounded-md object-cover"
        />
      ) : (
        <img src={item.src || '/placeholder.svg'} alt="" className="h-12 w-20 rounded-md object-cover" />
      ),
  },
  {
    key: 'title',
    header: 'Гарчиг / Тайлбар',
    render: (item) => (
      <div className="max-w-md">
        <p className="font-medium">{item.title || '—'}</p>
        <p className="line-clamp-2 text-xs text-muted-foreground">{item.caption}</p>
      </div>
    ),
  },
  {
    key: 'type',
    header: 'Төрөл',
    className: 'w-28',
    render: (item) => (
      <Badge tone="muted">{item.type === 'youtube' ? 'YouTube' : 'Зураг'}</Badge>
    ),
  },
  {
    key: 'active',
    header: 'Төлөв',
    className: 'w-28',
    render: (item) =>
      item.active === false ? (
        <Badge tone="muted">Нуусан</Badge>
      ) : (
        <Badge tone="success">Идэвхтэй</Badge>
      ),
  },
]

export default function SlidesPage() {
  return (
    <ResourceManager<SlideItem>
      title="Слайдер"
      description="Самбарын үндсэн слайд шоу. Зураг эсвэл YouTube видео нэмнэ."
      endpoint="/api/slides"
      addLabel="Слайд нэмэх"
      itemNoun="слайд"
      reorderable
      fields={fields}
      columns={columns}
      toInitial={(item) => ({
        type: item.type,
        src: item.src,
        title: item.title ?? '',
        caption: item.caption ?? '',
        active: item.active !== false,
      })}
    />
  )
}
