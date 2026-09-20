import { NextResponse, type NextRequest } from 'next/server'
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  accessSecret,
  refreshSecret,
  verifyToken,
} from '@/lib/auth'

const LOGIN_PATH = '/admin/login'

export default async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  const authed =
    (await verifyToken(req.cookies.get(ACCESS_COOKIE)?.value, accessSecret())) ??
    (await verifyToken(req.cookies.get(REFRESH_COOKIE)?.value, refreshSecret()))

  if (pathname === LOGIN_PATH) {
    if (authed) return NextResponse.redirect(new URL('/admin', req.url))
    return NextResponse.next()
  }

  if (!authed) {
    const url = new URL(LOGIN_PATH, req.url)
    url.searchParams.set('next', pathname + search)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
