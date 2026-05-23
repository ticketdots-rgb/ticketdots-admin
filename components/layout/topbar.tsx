'use client'

import { useEffect, useState } from 'react'
import { Bell, User } from 'lucide-react'
import { getAdminUser } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface TopbarProps {
  title: string
}

export function Topbar({ title }: TopbarProps) {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    setUser(getAdminUser())
  }, [])

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative rounded-full p-2 hover:bg-gray-100">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* Admin badge */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900">
              {user ? `${user.firstName} ${user.lastName}` : 'Admin'}
            </p>
            <Badge variant="secondary" className="text-xs">Admin</Badge>
          </div>
        </div>
      </div>
    </header>
  )
}
