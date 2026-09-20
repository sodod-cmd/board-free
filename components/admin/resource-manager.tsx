'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  TriangleAlert,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { FieldForm, type Field, type FormValues } from '@/components/admin/field-form'
import { api } from '@/lib/admin-client'

export type Column<T> = {
  key: string
  header: string
  className?: string
  render: (item: T) => React.ReactNode
}

export type Item = { id: string; order?: number; [key: string]: any }

export function ResourceManager<T extends Item>({
  title,
  description,
  endpoint,
  fields,
  columns,
  addLabel = 'Нэмэх',
  itemNoun = 'бичлэг',
  reorderable = false,
  toPayload,
  toInitial,
}: {
  title: string
  description?: string
  endpoint: string
  fields: Field[]
  columns: Column<T>[]
  addLabel?: string
  itemNoun?: string
  reorderable?: boolean
  toPayload?: (values: FormValues) => Record<string, unknown>
  toInitial?: (item: T) => FormValues
}) {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<T | null>(null)
  const [deleting, setDeleting] = useState<T | null>(null)
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api<{ items: T[] }>(endpoint)
      setItems(data.items ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Өгөгдөл уншихад алдаа гарлаа.')
    } finally {
      setLoading(false)
    }
  }, [endpoint])

  useEffect(() => {
    load()
  }, [load])

  const payload = (values: FormValues) => (toPayload ? toPayload(values) : values)

  const handleCreate = async (values: FormValues) => {
    await api(endpoint, { method: 'POST', json: payload(values) })
    setCreating(false)
    await load()
  }

  const handleUpdate = async (values: FormValues) => {
    if (!editing) return
    await api(`${endpoint}/${editing.id}`, { method: 'PATCH', json: payload(values) })
    setEditing(null)
    await load()
  }

  const handleDelete = async () => {
    if (!deleting) return
    setBusy(true)
    setError(null)
    try {
      await api(`${endpoint}/${deleting.id}`, { method: 'DELETE' })
      setDeleting(null)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Устгахад алдаа гарлаа.')
      setDeleting(null)
    } finally {
      setBusy(false)
    }
  }

  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= items.length) return
    const a = items[index]
    const b = items[target]
    setBusy(true)
    try {
      await Promise.all([
        api(`${endpoint}/${a.id}`, { method: 'PATCH', json: { order: b.order ?? target } }),
        api(`${endpoint}/${b.id}`, { method: 'PATCH', json: { order: a.order ?? index } }),
      ])
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Эрэмбэ солиход алдаа гарлаа.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="lg" onClick={load} disabled={loading}>
            <RefreshCw className={loading ? 'size-4 animate-spin' : 'size-4'} />
            Сэргээх
          </Button>
          <Button size="lg" onClick={() => setCreating(true)}>
            <Plus className="size-4" />
            {addLabel}
          </Button>
        </div>
      </div>

      {error && (
        <p className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <TriangleAlert className="size-4 shrink-0" />
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left">
                {reorderable && <th className="w-20 px-4 py-3 font-medium text-muted-foreground" />}
                {columns.map((c) => (
                  <th
                    key={c.key}
                    className={`px-4 py-3 font-medium text-muted-foreground ${c.className ?? ''}`}
                  >
                    {c.header}
                  </th>
                ))}
                <th className="w-28 px-4 py-3 text-right font-medium text-muted-foreground">
                  Үйлдэл
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan={columns.length + (reorderable ? 2 : 1)}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    <Loader2 className="mx-auto size-5 animate-spin" />
                  </td>
                </tr>
              )}

              {!loading && items.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length + (reorderable ? 2 : 1)}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    Одоогоор {itemNoun} алга. «{addLabel}» дарж нэмнэ үү.
                  </td>
                </tr>
              )}

              {!loading &&
                items.map((item, i) => (
                  <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    {reorderable && (
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Дээш"
                            disabled={i === 0 || busy}
                            onClick={() => move(i, -1)}
                          >
                            <ArrowUp className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Доош"
                            disabled={i === items.length - 1 || busy}
                            onClick={() => move(i, 1)}
                          >
                            <ArrowDown className="size-4" />
                          </Button>
                        </div>
                      </td>
                    )}
                    {columns.map((c) => (
                      <td key={c.key} className={`px-4 py-3 align-middle ${c.className ?? ''}`}>
                        {c.render(item)}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Засах"
                          onClick={() => setEditing(item)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Устгах"
                          className="text-destructive"
                          onClick={() => setDeleting(item)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={creating} onClose={() => setCreating(false)} title={addLabel}>
        <FieldForm
          fields={fields}
          submitLabel="Нэмэх"
          onSubmit={handleCreate}
          onCancel={() => setCreating(false)}
        />
      </Modal>

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title="Засах">
        {editing && (
          <FieldForm
            key={editing.id}
            fields={fields}
            initial={toInitial ? toInitial(editing) : editing}
            submitLabel="Хадгалах"
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      <Modal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Устгахдаа итгэлтэй байна уу?"
        description="Энэ үйлдлийг буцаах боломжгүй."
        className="max-w-md"
      >
        <div className="flex items-center justify-end gap-2 px-5 py-4">
          <Button variant="outline" size="lg" onClick={() => setDeleting(null)} disabled={busy}>
            Болих
          </Button>
          <Button variant="destructive" size="lg" onClick={handleDelete} disabled={busy}>
            {busy && <Loader2 className="size-4 animate-spin" />}
            Устгах
          </Button>
        </div>
      </Modal>
    </div>
  )
}
