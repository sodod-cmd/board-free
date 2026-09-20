import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

const region = process.env.AWS_REGION || 'us-east-2'
const bucket = process.env.BUCKET_NAME || ''

const globalForS3 = globalThis as unknown as { _s3Client?: S3Client }

export const s3 =
  globalForS3._s3Client ??
  new S3Client({
    region,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY || '',
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    },
  })

if (process.env.NODE_ENV !== 'production') globalForS3._s3Client = s3

/** CloudFront домэйн нь схемгүй байж болох тул нормчилно. */
export function cdnBase(): string {
  const raw = (process.env.CLOUDFRONT_URL || process.env.S3_ENDPOINT || '').trim()
  if (!raw) return ''
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  return withScheme.replace(/\/+$/, '')
}

export function publicUrl(key: string): string {
  const base = cdnBase()
  return base ? `${base}/${key.replace(/^\/+/, '')}` : `/${key}`
}

const EXT_BY_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'image/svg+xml': 'svg',
}

export const ALLOWED_IMAGE_TYPES = Object.keys(EXT_BY_TYPE)
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024 // 10MB

/** Файлыг S3 руу байршуулж, CloudFront-ын нийтийн URL-ыг буцаана. */
export async function uploadImage(
  file: File,
  folder = 'uploads',
): Promise<{ url: string; key: string }> {
  const ext = EXT_BY_TYPE[file.type] || (file.name.split('.').pop() || 'bin').toLowerCase()
  const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`
  const body = new Uint8Array(await file.arrayBuffer())

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: file.type || 'application/octet-stream',
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  )

  return { url: publicUrl(key), key }
}

/** Манай bucket-д хамаарах URL бол key-г нь салгаж авна. */
export function keyFromUrl(url: string): string | null {
  const base = cdnBase()
  if (!url || !base || !url.startsWith(base)) return null
  const key = url.slice(base.length).replace(/^\/+/, '')
  return key || null
}

export async function deleteByUrl(url: string): Promise<void> {
  const key = keyFromUrl(url)
  if (!key) return
  try {
    await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
  } catch {
    // Устгал амжилтгүй болсон ч үндсэн үйлдлийг зогсоохгүй.
  }
}
