import { listHandlers } from '@/lib/crud'
import { newsResource } from '@/lib/resources'

export const dynamic = 'force-dynamic'

const handlers = listHandlers(newsResource)
export const GET = handlers.GET
export const POST = handlers.POST
