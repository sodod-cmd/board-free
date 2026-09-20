import { listHandlers } from '@/lib/crud'
import { slidesResource } from '@/lib/resources'

export const dynamic = 'force-dynamic'

const handlers = listHandlers(slidesResource)
export const GET = handlers.GET
export const POST = handlers.POST
