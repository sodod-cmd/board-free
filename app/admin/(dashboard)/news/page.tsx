'use client'

import { Badge } from '@/components/ui/badge'
import { ResourceManager, type Column } from '@/components/admin/resource-manager'
import type { Field } from '@/components/admin/field-form'

type NewsItem = {
  id: string
  title: string
  image: string
  date?: string
  active?: boolean
  order?: number
}

const fields: Field[] = [
  {
    name: 'title',
    label: 'Гарчиг',
    type: 'text',
    required: true,
    placeholder: 'Мэдээний гарчиг',
  },
  { name: 'image', label: 'Зураг', type: 'image', folder: 'news', required: true },
  { name: 'date', label: 'Огноо', type: 'date' },
  { name: 'active', label: 'Самбарт харуулах', type: 'checkbox' },
]

const columns: Column<NewsItem>[] = [
  {
    key: 'image',
    header: 'Зураг',
    className: 'w-24',
    render: (item) => (
      <img src={item.image || '/placeholder.svg'} alt="" className="size-12 rounded-md object-cover" />
    ),
  },
  {
    key: 'title',
    header: 'Гарчиг',
    render: (item) => <p className="line-clamp-2 max-w-md font-medium">{item.title}</p>,
  },
  {
    key: 'date',
    header: 'Огноо',
    className: 'w-32',
    render: (item) => <span className="tabular-nums text-muted-foreground">{item.date || '—'}</span>,
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

export default function NewsPage() {
  return (
    <ResourceManager<NewsItem>
      title="Онцлох мэдээ"
      description="Самбарын баруун талд босоо гүйдэг онцлох мэдээний жагсаалт."
      endpoint="/api/news"
      addLabel="Мэдээ нэмэх"
      itemNoun="мэдээ"
      reorderable
      fields={fields}
      columns={columns}
      toInitial={(item) => ({
        title: item.title,
        image: item.image,
        date: item.date ?? '',
        active: item.active !== false,
      })}
    />
  )
}
