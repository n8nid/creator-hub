import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Don't run middleware on static files and Next.js internals
  if (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.startsWith('/debug-session') ||
    req.nextUrl.pathname.includes('.') ||
    req.nextUrl.pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  console.log('\n=== MIDDLEWARE START ===')
  console.log('Path:', req.nextUrl.pathname)
  console.log('Method:', req.method)
  
  // Log all cookies
  const allCookies = req.cookies.getAll()
  console.log('All cookies:', allCookies.map(c => ({ name: c.name, hasValue: !!c.value, length: c.value.length })))
  
  // Look for Supabase cookies specifically
  const supabaseCookies = allCookies.filter(c => c.name.includes('supabase'))
  console.log('Supabase cookies:', supabaseCookies.map(c => ({ name: c.name, hasValue: !!c.value, length: c.value.length })))

  const supabase = createMiddlewareClient({ req, res: response })

  try {
    // Get session
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    console.log('Session check result:', {
      hasSession: !!session,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
      error: error?.message,
    })

    // For debugging, let's temporarily allow access to /admin and see what happens
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (!session) {
        console.log('>>> REDIRECTING TO AUTH - NO SESSION FOUND')
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = '/auth'
        redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      } else {
        console.log('>>> ALLOWING ACCESS TO ADMIN - SESSION FOUND')
        return response
      }
    }

    // Handle /auth route
    if (req.nextUrl.pathname === '/auth') {
      if (session) {
        console.log('>>> REDIRECTING TO ADMIN FROM AUTH - SESSION FOUND')
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = '/admin'
        return NextResponse.redirect(redirectUrl)
      }
      return response
    }

    console.log('=== MIDDLEWARE END ===\n')
    return response

  } catch (error) {
    console.error('Middleware error:', error)
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 