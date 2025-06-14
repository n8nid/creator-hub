import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()
    const supabaseCookies = allCookies.filter((cookie: any) => 
      cookie.name.includes('supabase') || cookie.name.includes('sb-')
    )

    return NextResponse.json({
      hasSession: !!session,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
      error: error?.message,
      cookieCount: allCookies.length,
      supabaseCookieCount: supabaseCookies.length,
      supabaseCookies: supabaseCookies.map((cookie: any) => ({
        name: cookie.name,
        hasValue: !!cookie.value,
        length: cookie.value?.length || 0,
      })),
    })
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to get session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 