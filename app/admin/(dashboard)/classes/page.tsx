'use client'

import { Badge } from '@/components/ui/badge'
import { ResourceManager, type Column } from '@/components/admin/resource-manager'
import type { Field } from '@/components/admin/field-form'

type ClassItem = {
  id: string
  name: string
  dismissTime: string
  active?: boolean
  order?: number
}

const fields: Field[] = [
  {
    name: 'name',
    label: 'Ангийн нэр',
    type: 'text',
    required: true,
    placeholder: 'Ж: 12а',
  },
  {
    name: 'dismissTime',
    label: 'Тарах цаг',
    type: 'time',
    required: true,
    help: 'HH:mm хэлбэрээр. Энэ цаг болмогц самбарт «Тарсан» болж өөрчлөгдөнө.',
  },
  { name: 'active', label: 'Самбарт харуулах', type: 'checkbox' },
]

const columns: Column<ClassItem>[] = [
  {
    key: 'name',
    header: 'Анги / Бүлэг',
    className: 'w-40',
    render: (item) => <span className="text-base font-semibold">{item.name}</span>,
  },
  {
    key: 'dismissTime',
    header: 'Тарах цаг',
    className: 'w-40',
    render: (item) => <span className="tabular-nums">{item.dismissTime}</span>,
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

export default function ClassesPage() {
  return (
    <ResourceManager<ClassItem>
      title="Ангиуд ба тарах цаг"
      description="Бүлгийн нэр болон тарах цагийг оруулна. Самбар дээр цаг болмогц автоматаар «Тарсан» болно."
      endpoint="/api/classes"
      addLabel="Анги нэмэх"
      itemNoun="анги"
      fields={fields}
      columns={columns}
      toInitial={(item) => ({
        name: item.name,
        dismissTime: item.dismissTime,
        active: item.active !== false,
      })}
    />
  )
}
