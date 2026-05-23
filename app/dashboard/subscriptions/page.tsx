'use client'

import { useEffect, useState } from 'react'
import { Topbar } from '@/components/layout/topbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { Search } from 'lucide-react'

const statusColors: Record<string, string> = {
  active:   'bg-green-100 text-green-700',
  trialing: 'bg-blue-100 text-blue-700',
  past_due: 'bg-yellow-100 text-yellow-700',
  canceled: 'bg-red-100 text-red-700',
  expired:  'bg-gray-100 text-gray-700',
}

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { fetchSubs() }, [])

  async function fetchSubs() {
    try {
      setLoading(true)
      const res = await api.getSubscriptions()
      setSubs(res.data || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const filtered = subs.filter(s =>
    s.userId?.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.planId?.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <Topbar title="Subscriptions" />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">All Subscriptions ({subs.length})</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Loading...</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 font-medium">User</th>
                  <th className="pb-3 font-medium">Plan</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Period Start</th>
                  <th className="pb-3 font-medium">Period End</th>
                  <th className="pb-3 font-medium">Canceled</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((sub) => (
                  <tr key={sub._id} className="hover:bg-gray-50">
                    <td className="py-3">{sub.userId?.email || sub.userId || '—'}</td>
                    <td className="py-3 capitalize">{sub.planId?.name || '—'}</td>
                    <td className="py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[sub.status] || ''}`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground">{sub.currentPeriodStart ? formatDate(sub.currentPeriodStart) : '—'}</td>
                    <td className="py-3 text-muted-foreground">{sub.currentPeriodEnd ? formatDate(sub.currentPeriodEnd) : '—'}</td>
                    <td className="py-3 text-muted-foreground">{sub.canceledAt ? formatDate(sub.canceledAt) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
