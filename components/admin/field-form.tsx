'use client'

import { useRef, useState } from 'react'
import { ImagePlus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { uploadImage } from '@/lib/admin-client'

export type FieldType =
  | 'text'
  | 'textarea'
  | 'time'
  | 'date'
  | 'password'
  | 'number'
  | 'select'
  | 'image'
  | 'checkbox'

export type Field = {
  name: string
  label: string
  type: FieldType
  placeholder?: string
  required?: boolean
  help?: string
  options?: { value: string; label: string }[]
  /** image төрөлд: S3 доторх хавтас */
  folder?: string
  /** Тухайн талбарыг хэзээ харуулахыг шийднэ */
  visibleIf?: (values: Record<string, any>) => boolean
}

export type FormValues = Record<string, any>

export function FieldForm({
  fields,
  initial,
  submitLabel = 'Хадгалах',
  onSubmit,
  onCancel,
}: {
  fields: Field[]
  initial?: FormValues
  submitLabel?: string
  onSubmit: (values: FormValues) => Promise<void>
  onCancel: () => void
}) {
  const [values, setValues] = useState<FormValues>(() => {
    const base: FormValues = {}
    for (const f of fields) {
      const fallback =
        f.type === 'checkbox' ? true : f.type === 'select' ? (f.options?.[0]?.value ?? '') : ''
      base[f.name] = initial?.[f.name] ?? fallback
    }
    return base
  })
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const set = (name: string, value: unknown) => setValues((v) => ({ ...v, [name]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      await onSubmit(values)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Хадгалахад алдаа гарлаа.')
    } finally {
      setSaving(false)
    }
  }

  const visible = fields.filter((f) => !f.visibleIf || f.visibleIf(values))

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4 px-5 py-4">
        {visible.map((field) => (
          <div key={field.name} className="flex flex-col gap-1.5">
            {field.type === 'checkbox' ? (
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={Boolean(values[field.name])}
                  onChange={(e) => set(field.name, e.target.checked)}
                  className="size-4"
                />
                {field.label}
              </label>
            ) : (
              <>
                <Label htmlFor={field.name}>
                  {field.label}
                  {field.required && <span className="ml-0.5 text-destructive">*</span>}
                </Label>

                {field.type === 'textarea' && (
                  <Textarea
                    id={field.name}
                    value={values[field.name] ?? ''}
                    placeholder={field.placeholder}
                    required={field.required}
                    onChange={(e) => set(field.name, e.target.value)}
                  />
                )}

                {field.type === 'select' && (
                  <Select
                    id={field.name}
                    value={values[field.name] ?? ''}
                    onChange={(e) => set(field.name, e.target.value)}
                  >
                    {field.options?.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </Select>
                )}

                {field.type === 'image' && (
                  <ImageField
                    value={values[field.name] ?? ''}
                    folder={field.folder}
                    placeholder={field.placeholder}
                    onChange={(v) => set(field.name, v)}
                    onError={setError}
                  />
                )}

                {['text', 'time', 'date', 'password', 'number'].includes(field.type) && (
                  <Input
                    id={field.name}
                    type={field.type}
                    value={values[field.name] ?? ''}
                    placeholder={field.placeholder}
                    required={field.required}
                    onChange={(e) => set(field.name, e.target.value)}
                  />
                )}
              </>
            )}

            {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
          </div>
        ))}

        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
        <Button type="button" variant="outline" size="lg" onClick={onCancel} disabled={saving}>
          Болих
        </Button>
        <Button type="submit" size="lg" disabled={saving}>
          {saving && <Loader2 className="size-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

function ImageField({
  value,
  folder,
  placeholder,
  onChange,
  onError,
}: {
  value: string
  folder?: string
  placeholder?: string
  onChange: (v: string) => void
  onError: (msg: string | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const pick = async (file: File | undefined) => {
    if (!file) return
    onError(null)
    setUploading(true)
    try {
      onChange(await uploadImage(file, folder))
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Зураг байршуулж чадсангүй.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="size-5 text-muted-foreground" />
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => pick(e.target.files?.[0])}
          />
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ImagePlus className="size-4" />
            )}
            {uploading ? 'Байршуулж байна…' : 'Зураг сонгох'}
          </Button>
          <p className="text-xs text-muted-foreground">
            S3 / CloudFront руу байршина. 10MB хүртэл.
          </p>
        </div>
      </div>
      <Input
        value={value}
        placeholder={placeholder || 'Эсвэл зургийн холбоосыг буулгана уу'}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
