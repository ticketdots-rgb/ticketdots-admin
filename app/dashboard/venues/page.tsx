'use client'

import { useEffect, useState } from 'react'
import { Topbar } from '@/components/layout/topbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@/lib/api'
import { Search, Plus, Pencil, Trash2, Check, X } from 'lucide-react'

export default function VenuesPage() {
  const [venues, setVenues] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<any>({})

  useEffect(() => { fetchVenues() }, [])

  async function fetchVenues() {
    try {
      setLoading(true)
      const res = await api.getVenues()
      setVenues(res.data || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  function startCreate() {
    setCreating(true)
    setEditing(null)
    setForm({ name: '', city: '', state: '', country: 'USA', capacity: '', timezone: '' })
  }

  function startEdit(venue: any) {
    setEditing(venue._id)
    setCreating(false)
    setForm({ ...venue })
  }

  async function handleSave() {
    try {
      if (creating) await api.createVenue(form)
      else await api.updateVenue(editing!, form)
      setCreating(false)
      setEditing(null)
      fetchVenues()
    } catch (err) { console.error(err) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this venue?')) return
    try {
      await api.deleteVenue(id)
      fetchVenues()
    } catch (err) { console.error(err) }
  }

  const filtered = venues.filter(v =>
    v.name?.toLowerCase().includes(search.toLowerCase()) ||
    v.city?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <Topbar title="Venues" />

      <div className="flex justify-end">
        <Button onClick={startCreate}><Plus className="mr-2 h-4 w-4" /> Add Venue</Button>
      </div>

      {(creating || editing) && (
        <Card>
          <CardHeader><CardTitle className="text-base">{creating ? 'Add Venue' : 'Edit Venue'}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: 'name', label: 'Venue Name' },
                { key: 'city', label: 'City' },
                { key: 'state', label: 'State' },
                { key: 'country', label: 'Country' },
                { key: 'capacity', label: 'Capacity', type: 'number' },
                { key: 'timezone', label: 'Timezone' },
              ].map(field => (
                <div key={field.key} className="space-y-1">
                  <Label>{field.label}</Label>
                  <Input
                    type={field.type || 'text'}
                    value={form[field.key] || ''}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}><Check className="mr-2 h-4 w-4" /> Save</Button>
              <Button variant="outline" onClick={() => { setCreating(false); setEditing(null) }}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">All Venues ({venues.length})</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search venues..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Loading venues...</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">City</th>
                  <th className="pb-3 font-medium">State</th>
                  <th className="pb-3 font-medium">Country</th>
                  <th className="pb-3 font-medium">Capacity</th>
                  <th className="pb-3 font-medium">Timezone</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map(venue => (
                  <tr key={venue._id} className="hover:bg-gray-50">
                    <td className="py-3 font-medium">{venue.name}</td>
                    <td className="py-3 text-muted-foreground">{venue.city}</td>
                    <td className="py-3 text-muted-foreground">{venue.state}</td>
                    <td className="py-3 text-muted-foreground">{venue.country}</td>
                    <td className="py-3">{venue.capacity?.toLocaleString() || '—'}</td>
                    <td className="py-3 text-muted-foreground">{venue.timezone || '—'}</td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => startEdit(venue)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(venue._id)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </td>
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
