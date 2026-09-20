import { NextResponse } from 'next/server'
import { bad, guard, str } from '@/lib/crud'
import { requireAdmin } from '@/lib/session'
import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_BYTES, uploadImage } from '@/lib/s3'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

async function upload(req: Request) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return bad('Файл илгээхэд алдаа гарлаа.')
  }

  const file = form.get('file')
  if (!(file instanceof File) || file.size === 0) return bad('Файл сонгогдоогүй байна.')
  if (file.size > MAX_UPLOAD_BYTES) return bad('Файлын хэмжээ 10MB-аас хэтрэхгүй байх ёстой.')
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return bad('Зөвхөн зураг (jpg, png, webp, gif, avif, svg) байршуулах боломжтой.')
  }

  const folder = str(form.get('folder')) || 'uploads'
  const safeFolder = /^[a-z0-9_-]+$/i.test(folder) ? folder : 'uploads'

  try {
    const { url, key } = await uploadImage(file, safeFolder)
    return NextResponse.json({ url, key }, { status: 201 })
  } catch (err) {
    console.error('S3 upload failed', err)
    return bad('S3 рүү байршуулахад алдаа гарлаа.', 500)
  }
}

export const POST = guard(upload)
