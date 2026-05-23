'use client'

import { useState } from 'react'
import { Topbar } from '@/components/layout/topbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Play, Square, RefreshCw, Cpu, Clock, CheckCircle, AlertTriangle } from 'lucide-react'

const markets = [
  { id: 'ticketmaster', name: 'Ticketmaster', status: 'running', lastRun: '2 min ago', jobsQueued: 48, jobsDone: 1240 },
  { id: 'axs',          name: 'AXS',          status: 'running', lastRun: '5 min ago', jobsQueued: 12, jobsDone: 384 },
  { id: 'seatgeek',     name: 'SeatGeek',     status: 'stopped', lastRun: '1 hr ago',  jobsQueued: 0,  jobsDone: 210 },
  { id: 'livenation',   name: 'Live Nation',  status: 'running', lastRun: '3 min ago', jobsQueued: 22, jobsDone: 890 },
  { id: 'stubhub',      name: 'StubHub',      status: 'error',   lastRun: '30 min ago',jobsQueued: 0,  jobsDone: 640 },
]

const recentJobs = [
  { id: 'job_001', event: 'Taylor Swift | The Eras Tour', market: 'Ticketmaster', status: 'completed', duration: '1.2s', time: '1 min ago' },
  { id: 'job_002', event: 'NBA Finals Game 7',            market: 'Ticketmaster', status: 'completed', duration: '0.9s', time: '2 min ago' },
  { id: 'job_003', event: 'Beyoncé | Renaissance Tour',   market: 'Ticketmaster', status: 'completed', duration: '1.4s', time: '3 min ago' },
  { id: 'job_004', event: 'Super Bowl LX',                market: 'Ticketmaster', status: 'failed',    duration: '—',    time: '5 min ago' },
  { id: 'job_005', event: 'Drake | It\'s All A Blur',     market: 'AXS',          status: 'completed', duration: '1.1s', time: '6 min ago' },
]

const statusColors: Record<string, string> = {
  running:   'bg-green-100 text-green-700',
  stopped:   'bg-gray-100 text-gray-700',
  error:     'bg-red-100 text-red-700',
  completed: 'bg-green-100 text-green-700',
  failed:    'bg-red-100 text-red-700',
}

export default function ScraperPage() {
  const [interval, setInterval] = useState('5')

  return (
    <div className="space-y-6">
      <Topbar title="Scraper Control" />

      {/* Queue Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Jobs Queued',    value: '82',   icon: Clock,        color: 'text-blue-600',  bg: 'bg-blue-50' },
          { label: 'Jobs Running',   value: '4',    icon: Cpu,          color: 'text-orange-600',bg: 'bg-orange-50' },
          { label: 'Completed Today',value: '3,364',icon: CheckCircle,  color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Failed Today',   value: '12',   icon: AlertTriangle,color: 'text-red-600',   bg: 'bg-red-50' },
        ].map(stat => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
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

      {/* Market Controls */}
      <Card>
        <CardHeader><CardTitle className="text-base">Market Scrapers</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-3 font-medium">Market</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Last Run</th>
                <th className="pb-3 font-medium">Queued</th>
                <th className="pb-3 font-medium">Done Today</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {markets.map(market => (
                <tr key={market.id} className="hover:bg-gray-50">
                  <td className="py-3 font-medium">{market.name}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[market.status]}`}>
                      {market.status}
                    </span>
                  </td>
                  <td className="py-3 text-muted-foreground">{market.lastRun}</td>
                  <td className="py-3">{market.jobsQueued}</td>
                  <td className="py-3">{market.jobsDone.toLocaleString()}</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      {market.status === 'running' ? (
                        <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                          <Square className="mr-1 h-3 w-3" /> Stop
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50">
                          <Play className="mr-1 h-3 w-3" /> Start
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <RefreshCw className="mr-1 h-3 w-3" /> Retry
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Config + Recent Jobs */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Scraper Configuration</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>Global Refresh Interval (minutes)</Label>
              <Input type="number" value={interval} onChange={e => setInterval(e.target.value)} className="w-32" />
            </div>
            <div className="space-y-1">
              <Label>Max Concurrent Workers</Label>
              <Input type="number" defaultValue="4" className="w-32" />
            </div>
            <div className="space-y-1">
              <Label>Retry Attempts on Failure</Label>
              <Input type="number" defaultValue="3" className="w-32" />
            </div>
            <Button>Save Configuration</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Recent Jobs</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentJobs.map(job => (
                <div key={job.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium truncate max-w-[200px]">{job.event}</p>
                    <p className="text-xs text-muted-foreground">{job.market} · {job.time}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{job.duration}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[job.status]}`}>
                      {job.status}
                    </span>
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
