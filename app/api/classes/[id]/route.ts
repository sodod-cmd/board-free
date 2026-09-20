import { itemHandlers } from '@/lib/crud'
import { classesResource } from '@/lib/resources'

export const dynamic = 'force-dynamic'

const handlers = itemHandlers(classesResource)
export const PATCH = handlers.PATCH
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE
