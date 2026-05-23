'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Topbar } from '@/components/layout/topbar'
import { Users, CreditCard, Calendar, Activity, TrendingUp, AlertTriangle } from 'lucide-react'

const stats = [
  { label: 'Total Users',        value: '1,284', change: '+12%', icon: Users,       color: 'text-blue-600',  bg: 'bg-blue-50' },
  { label: 'Active Subs',        value: '847',   change: '+8%',  icon: CreditCard,  color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Events Tracked',     value: '4,920', change: '+24%', icon: Calendar,    color: 'text-purple-600',bg: 'bg-purple-50' },
  { label: 'API Requests Today', value: '92.4K', change: '+5%',  icon: Activity,    color: 'text-orange-600',bg: 'bg-orange-50' },
]

const recentActivity = [
  { action: 'New user registered',       user: 'john.doe@example.com',    time: '2 min ago',  type: 'user' },
  { action: 'Subscription upgraded',     user: 'sarah.k@tradingdesk.com', time: '8 min ago',  type: 'billing' },
  { action: 'Scraper job completed',     user: 'System',                  time: '15 min ago', type: 'system' },
  { action: 'Alert triggered',           user: 'alex.m@broker.com',       time: '22 min ago', type: 'alert' },
  { action: 'Blog post published',       user: 'admin@ticketdots.com',    time: '1 hr ago',   type: 'content' },
  { action: 'API key generated',         user: 'mike.t@enterprise.com',   time: '2 hr ago',   type: 'api' },
]

const typeColors: Record<string, string> = {
  user:    'bg-blue-100 text-blue-700',
  billing: 'bg-green-100 text-green-700',
  system:  'bg-gray-100 text-gray-700',
  alert:   'bg-red-100 text-red-700',
  content: 'bg-purple-100 text-purple-700',
  api:     'bg-orange-100 text-orange-700',
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Topbar title="Dashboard" />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {stat.change} this month
                    </p>
                  </div>
                  <div className={`rounded-full p-3 ${stat.bg}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.user}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[item.type]}`}>
                      {item.type}
                    </span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'API Server',       status: 'operational', latency: '42ms' },
                { name: 'MongoDB',          status: 'operational', latency: '8ms' },
                { name: 'Redis / Queues',   status: 'operational', latency: '3ms' },
                { name: 'Scraper Workers',  status: 'operational', latency: '—' },
                { name: 'Analytics Engine', status: 'operational', latency: '—' },
                { name: 'Alert Processor',  status: 'operational', latency: '—' },
              ].map((service) => (
                <div key={service.name} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {service.latency !== '—' && (
                      <span className="text-xs text-muted-foreground">{service.latency}</span>
                    )}
                    <Badge variant="success">{service.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
