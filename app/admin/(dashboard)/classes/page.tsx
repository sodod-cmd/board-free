'use client'

import { Badge } from '@/components/ui/badge'
import { ResourceManager, type Column } from '@/components/admin/resource-manager'
import type { Field, FormValues } from '@/components/admin/field-form'
import { WEEKDAYS, weekdayKeyFor, type WeekSchedule } from '@/lib/data'

type ClassItem = {
  id: string
  name: string
  schedule?: WeekSchedule
  active?: boolean
  order?: number
}

const fields: Field[] = [
  {
    name: 'name',
    label: 'Ангийн нэр',
    type: 'text',
    required: true,
    placeholder: 'Ж: 12А',
  },
  ...WEEKDAYS.map<Field>((day, i) => ({
    name: day.key,
    label: `${day.label} — тарах цаг`,
    type: 'time',
    help: i === 0 ? 'Хичээлгүй өдрийг хоосон орхино. Дор хаяж нэг өдөр цагтай байх ёстой.' : undefined,
  })),
  { name: 'active', label: 'Самбарт харуулах', type: 'checkbox' },
]

/** Тухайн өдөр самбар дээр аль баганыг харуулахыг тодруулна. */
const todayKey = weekdayKeyFor(new Date())

const columns: Column<ClassItem>[] = [
  {
    key: 'name',
    header: 'Анги / Бүлэг',
    className: 'w-32',
    render: (item) => <span className="text-base font-semibold">{item.name}</span>,
  },
  ...WEEKDAYS.map<Column<ClassItem>>((day) => ({
    key: day.key,
    header: day.label,
    className: 'w-24',
    render: (item) => {
      const time = item.schedule?.[day.key]
      return (
        <span
          className={
            !time
              ? 'text-muted-foreground'
              : day.key === todayKey
                ? 'rounded-md bg-primary/10 px-1.5 py-0.5 font-semibold tabular-nums text-primary'
                : 'tabular-nums'
          }
        >
          {time || '—'}
        </span>
      )
    },
  })),
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

/** Маягтын тэгш талбаруудыг schedule объект болгож илгээнэ. */
function toPayload(values: FormValues) {
  const schedule: Record<string, string> = {}
  for (const day of WEEKDAYS) schedule[day.key] = values[day.key] ?? ''
  return { name: values.name, active: values.active, schedule }
}

export default function ClassesPage() {
  return (
    <ResourceManager<ClassItem>
      title="Ангиуд ба тарах цаг"
      description="Анги бүрийн Даваа–Баасан гарагийн тарах цагийг оруулна. Самбар нь тухайн өдрийн цагийг харуулж, цаг болмогц «Тарсан» болно."
      endpoint="/api/classes"
      addLabel="Анги нэмэх"
      itemNoun="анги"
      reorderable
      fields={fields}
      columns={columns}
      toPayload={toPayload}
      toInitial={(item) => ({
        name: item.name,
        ...Object.fromEntries(WEEKDAYS.map((d) => [d.key, item.schedule?.[d.key] ?? ''])),
        active: item.active !== false,
      })}
    />
  )
}
