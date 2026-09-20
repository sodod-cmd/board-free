import { listHandlers } from '@/lib/crud'
import { classesResource } from '@/lib/resources'

export const dynamic = 'force-dynamic'

const handlers = listHandlers(classesResource)
export const GET = handlers.GET
export const POST = handlers.POST
