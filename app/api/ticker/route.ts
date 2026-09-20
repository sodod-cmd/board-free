import { listHandlers } from '@/lib/crud'
import { tickerResource } from '@/lib/resources'

export const dynamic = 'force-dynamic'

const handlers = listHandlers(tickerResource)
export const GET = handlers.GET
export const POST = handlers.POST
