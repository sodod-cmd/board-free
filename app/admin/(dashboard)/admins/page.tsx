'use client'

import { ResourceManager, type Column } from '@/components/admin/resource-manager'
import type { Field } from '@/components/admin/field-form'

type AdminItem = {
  id: string
  username: string
  name?: string
  createdAt?: string
}

const fields: Field[] = [
  {
    name: 'username',
    label: 'Нэвтрэх нэр',
    type: 'text',
    required: true,
    placeholder: 'admin',
    help: 'Жижиг үсгээр хадгалагдана. Дор хаяж 3 тэмдэгт.',
  },
  { name: 'name', label: 'Овог нэр', type: 'text', placeholder: 'Ж: Б.Болд' },
  {
    name: 'password',
    label: 'Нууц үг',
    type: 'password',
    help: 'Дор хаяж 6 тэмдэгт. Засахдаа хоосон орхивол хуучин нууц үг хэвээр үлдэнэ.',
  },
]

const columns: Column<AdminItem>[] = [
  {
    key: 'username',
    header: 'Нэвтрэх нэр',
    render: (item) => <span className="font-medium">@{item.username}</span>,
  },
  {
    key: 'name',
    header: 'Овог нэр',
    render: (item) => <span className="text-muted-foreground">{item.name || '—'}</span>,
  },
  {
    key: 'createdAt',
    header: 'Үүсгэсэн',
    className: 'w-40',
    render: (item) => (
      <span className="tabular-nums text-muted-foreground">
        {item.createdAt ? item.createdAt.slice(0, 10) : '—'}
      </span>
    ),
  },
]

export default function AdminsPage() {
  return (
    <ResourceManager<AdminItem>
      title="Админууд"
      description="Системд нэвтрэх эрхтэй хэрэглэгчид. Сүүлчийн админыг устгах боломжгүй."
      endpoint="/api/admins"
      addLabel="Админ нэмэх"
      itemNoun="админ"
      fields={fields}
      columns={columns}
      toInitial={(item) => ({ username: item.username, name: item.name ?? '', password: '' })}
      toPayload={(values) => {
        const payload: Record<string, unknown> = {
          username: values.username,
          name: values.name,
        }
        if (values.password) payload.password = values.password
        return payload
      }}
    />
  )
}
