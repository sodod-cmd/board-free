import { itemHandlers } from '@/lib/crud'
import { newsResource } from '@/lib/resources'
import { deleteByUrl } from '@/lib/s3'

export const dynamic = 'force-dynamic'

const handlers = itemHandlers(newsResource, {
  beforeDelete: async (doc) => {
    if (typeof doc?.image === 'string') await deleteByUrl(doc.image)
  },
})
export const PATCH = handlers.PATCH
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE
