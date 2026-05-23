'use client'

import { useEffect, useState } from 'react'
import { Topbar } from '@/components/layout/topbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { Search, Pencil, Trash2, Plus } from 'lucide-react'

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => { fetchEvents() }, [page])

  async function fetchEvents() {
    try {
      setLoading(true)
      const res = await api.getEvents(page, 20)
      setEvents(res.data || [])
      setTotal(res.pagination?.total || 0)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this event?')) return
    try {
      await api.deleteEvent(id)
      fetchEvents()
    } catch (err) { console.error(err) }
  }

  const filtered = events.filter(e =>
    e.name?.toLowerCase().includes(search.toLowerCase()) ||
    e.market?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <Topbar title="Events" />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">All Events ({total})</CardTitle>
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Loading events...</p>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Venue</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Category</th>
                    <th className="pb-3 font-medium">Market</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((event) => (
                    <tr key={event._id} className="hover:bg-gray-50">
                      <td className="py-3 font-medium max-w-[200px] truncate">{event.name}</td>
                      <td className="py-3 text-muted-foreground">{event.venueId?.name || '—'}</td>
                      <td className="py-3 text-muted-foreground">{event.eventDate ? formatDate(event.eventDate) : '—'}</td>
                      <td className="py-3 capitalize">{event.category || '—'}</td>
                      <td className="py-3">{event.market || '—'}</td>
                      <td className="py-3">
                        <Badge variant={event.isActive ? 'success' : 'secondary'}>
                          {event.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(event._id)} className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Showing {filtered.length} of {total}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
                  <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={filtered.length < 20}>Next</Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
