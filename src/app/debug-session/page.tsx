import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export default async function DebugSessionPage() {
  const cookieStore = cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  const allCookies = cookieStore.getAll()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Server-Side Session Debug</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Session Info</h2>
          <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(
              {
                hasSession: !!session,
                userId: session?.user?.id,
                userEmail: session?.user?.email,
                expiresAt: session?.expires_at,
                error: error?.message,
              },
              null,
              2
            )}
          </pre>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">All Cookies</h2>
          <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(
              allCookies.map(cookie => ({
                name: cookie.name,
                value: cookie.value.substring(0, 50) + (cookie.value.length > 50 ? '...' : ''),
                hasValue: !!cookie.value,
              })),
              null,
              2
            )}
          </pre>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Supabase Cookies</h2>
          <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(
              allCookies
                .filter(cookie => cookie.name.includes('supabase'))
                .map(cookie => ({
                  name: cookie.name,
                  hasValue: !!cookie.value,
                  valueLength: cookie.value.length,
                })),
              null,
              2
            )}
          </pre>
        </div>
      </div>
    </div>
  )
} 