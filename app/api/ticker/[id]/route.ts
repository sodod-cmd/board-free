import { itemHandlers } from '@/lib/crud'
import { tickerResource } from '@/lib/resources'

export const dynamic = 'force-dynamic'

const handlers = itemHandlers(tickerResource)
export const PATCH = handlers.PATCH
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE
