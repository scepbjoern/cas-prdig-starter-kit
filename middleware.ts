import { betterFetch } from '@better-fetch/fetch'
import type { Session } from 'better-auth/types'
import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/login', '/api/auth', '/api/antraege', '/api/webhooks']

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) return NextResponse.next()

  const { data: session } = await betterFetch<Session>('/api/auth/get-session', {
    baseURL: request.nextUrl.origin,
    headers: { cookie: request.headers.get('cookie') ?? '' }
  })

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}
