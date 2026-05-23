'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Users, CreditCard, Calendar, MapPin,
  Bell, FileText, Settings, Activity, Key, LogOut, Shield,
  BarChart3, Cpu, BookOpen,
} from 'lucide-react'
import { logout } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard',     href: '/dashboard',              icon: LayoutDashboard },
  { label: 'Users',         href: '/dashboard/users',        icon: Users },
  { label: 'Plans',         href: '/dashboard/plans',        icon: CreditCard },
  { label: 'Subscriptions', href: '/dashboard/subscriptions',icon: BarChart3 },
  { label: 'Events',        href: '/dashboard/events',       icon: Calendar },
  { label: 'Venues',        href: '/dashboard/venues',       icon: MapPin },
  { label: 'Blog',          href: '/dashboard/blog',         icon: BookOpen },
  { label: 'Notifications', href: '/dashboard/notifications',icon: Bell },
  { label: 'API Keys',      href: '/dashboard/api-keys',     icon: Key },
  { label: 'Scraper',       href: '/dashboard/scraper',      icon: Cpu },
  { label: 'System Health', href: '/dashboard/health',       icon: Activity },
  { label: 'Settings',      href: '/dashboard/settings',     icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-gray-950 text-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-gray-800 px-6">
        <Shield className="h-6 w-6 text-blue-400" />
        <span className="text-lg font-bold">TD Admin</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-800 p-3">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
