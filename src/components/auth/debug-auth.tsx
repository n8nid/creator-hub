'use client'

import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function DebugAuth() {
  const { user, session, loading } = useAuth()

  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 max-w-sm z-50 bg-yellow-50 border-yellow-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-yellow-800">
          Auth Debug Info
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 text-xs">
        <div className="space-y-1 text-yellow-700">
          <div><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</div>
          <div><strong>User:</strong> {user ? user.email : 'None'}</div>
          <div><strong>Session:</strong> {session ? 'Active' : 'None'}</div>
          <div><strong>User ID:</strong> {user?.id || 'N/A'}</div>
          <div><strong>Session ID:</strong> {session?.access_token ? session.access_token.substring(0, 20) + '...' : 'N/A'}</div>
        </div>
      </CardContent>
    </Card>
  )
} 