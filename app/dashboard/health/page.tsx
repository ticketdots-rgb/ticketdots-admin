'use client'

import { Topbar } from '@/components/layout/topbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, Database, Server, Cpu, HardDrive, Wifi } from 'lucide-react'

const services = [
  { name: 'API Server',        status: 'operational', latency: '42ms',  uptime: '99.98%', icon: Server },
  { name: 'MongoDB',           status: 'operational', latency: '8ms',   uptime: '99.99%', icon: Database },
  { name: 'Redis',             status: 'operational', latency: '3ms',   uptime: '99.99%', icon: HardDrive },
  { name: 'Scraper Workers',   status: 'operational', latency: '—',     uptime: '99.91%', icon: Cpu },
  { name: 'Analytics Engine',  status: 'operational', latency: '—',     uptime: '99.95%', icon: Activity },
  { name: 'Alert Processor',   status: 'operational', latency: '—',     uptime: '99.97%', icon: Wifi },
]

const statusColors: Record<string, string> = {
  operational: 'bg-green-100 text-green-700',
  degraded:    'bg-yellow-100 text-yellow-700',
  outage:      'bg-red-100 text-red-700',
}

const metrics = [
  { label: 'CPU Usage',    value: '24%',  bar: 24,  color: 'bg-blue-500' },
  { label: 'Memory Usage', value: '61%',  bar: 61,  color: 'bg-purple-500' },
  { label: 'Disk Usage',   value: '38%',  bar: 38,  color: 'bg-orange-500' },
  { label: 'Network I/O',  value: '12%',  bar: 12,  color: 'bg-green-500' },
]

export default function HealthPage() {
  return (
    <div className="space-y-6">
      <Topbar title="System Health" />

      {/* Service Status */}
      <Card>
        <CardHeader><CardTitle className="text-base">Service Status</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(service => {
              const Icon = service.icon
              return (
                <div key={service.name} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-gray-100 p-2">
                      <Icon className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{service.name}</p>
                      <p className="text-xs text-muted-foreground">Uptime: {service.uptime}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[service.status]}`}>
                      {service.status}
                    </span>
                    {service.latency !== '—' && (
                      <p className="text-xs text-muted-foreground mt-1">{service.latency}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Resource Usage */}
      <Card>
        <CardHeader><CardTitle className="text-base">Resource Usage</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {metrics.map(metric => (
            <div key={metric.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{metric.label}</span>
                <span className="text-muted-foreground">{metric.value}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100">
                <div className={`h-2 rounded-full ${metric.color}`} style={{ width: `${metric.bar}%` }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Error Log */}
      <Card>
        <CardHeader><CardTitle className="text-base">Recent Errors</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { time: '14:32', level: 'WARN',  message: 'Scraper timeout on StubHub event evt_0482' },
              { time: '13:15', level: 'ERROR', message: 'MongoDB connection retry #2 — recovered' },
              { time: '11:48', level: 'WARN',  message: 'Rate limit hit on Ticketmaster API — backing off 30s' },
              { time: '09:22', level: 'INFO',  message: 'Analytics job queue cleared — 1,240 jobs processed' },
            ].map((log, i) => (
              <div key={i} className="flex items-start gap-3 rounded-md bg-gray-50 px-3 py-2 font-mono text-xs">
                <span className="text-muted-foreground shrink-0">{log.time}</span>
                <span className={`shrink-0 font-bold ${log.level === 'ERROR' ? 'text-red-600' : log.level === 'WARN' ? 'text-yellow-600' : 'text-blue-600'}`}>
                  {log.level}
                </span>
                <span className="text-gray-700">{log.message}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
