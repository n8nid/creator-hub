'use client'

import { Button } from "@/components/ui/button"
import { Workflow } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

export function HeaderNav() {
  const { user } = useAuth()

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <Workflow className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">AutoTalent</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
              <Link href="/directory" className="text-gray-600 hover:text-gray-900 transition-colors">
                Browse Talent
              </Link>
              <Button asChild>
                <Link href="/admin">Go To Dashboard</Link>
              </Button>
            </>
          ) : (
            <>
              <Link href="/directory" className="text-gray-600 hover:text-gray-900 transition-colors">
                Browse Talent
              </Link>
              <Link href="/auth" className="text-gray-600 hover:text-gray-900 transition-colors">
                Login
              </Link>
              <Button asChild>
                <Link href="/auth">Join as Talent</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
} 