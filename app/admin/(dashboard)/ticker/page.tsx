'use client'

import { Badge } from '@/components/ui/badge'
import { ResourceManager, type Column } from '@/components/admin/resource-manager'
import type { Field } from '@/components/admin/field-form'

type TickerItem = {
  id: string
  text: string
  active?: boolean
  order?: number
}

const fields: Field[] = [
  {
    name: 'text',
    label: 'Мэдээний текст',
    type: 'textarea',
    required: true,
    placeholder: 'Ж: Эцэг эхийн хурал ирэх Бямба гарагт 11:00 цагт болно.',
    help: 'Богино, нэг өгүүлбэр байвал дэлгэц дээр уншихад тохиромжтой.',
  },
  { name: 'active', label: 'Самбарт харуулах', type: 'checkbox' },
]

const columns: Column<TickerItem>[] = [
  {
    key: 'text',
    header: 'Текст',
    render: (item) => <p className="max-w-xl">{item.text}</p>,
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

export default function TickerPage() {
  return (
    <ResourceManager<TickerItem>
      title="Урсдаг мэдээ"
      description="Дэлгэцийн доод хэсэгт хэвтээ чиглэлд урсах мэдээний мөр."
      endpoint="/api/ticker"
      addLabel="Мөр нэмэх"
      itemNoun="урсдаг мэдээ"
      reorderable
      fields={fields}
      columns={columns}
      toInitial={(item) => ({ text: item.text, active: item.active !== false })}
    />
  )
}
