import { itemHandlers } from '@/lib/crud'
import { slidesResource } from '@/lib/resources'
import { deleteByUrl } from '@/lib/s3'

export const dynamic = 'force-dynamic'

const handlers = itemHandlers(slidesResource, {
  // Слайд устгахад S3 дээрх зургийг нь бас устгана.
  beforeDelete: async (doc) => {
    if (doc?.type === 'image' && typeof doc.src === 'string') await deleteByUrl(doc.src)
  },
})
export const PATCH = handlers.PATCH
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE
