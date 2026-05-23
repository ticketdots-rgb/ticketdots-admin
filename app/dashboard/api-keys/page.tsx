'use client'

import { Topbar } from '@/components/layout/topbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatDateTime } from '@/lib/utils'
import { Search, Ban } from 'lucide-react'
import { useState } from 'react'

const mockKeys = [
  { id: '1', user: 'alex.m@tradingdesk.com', prefix: 'td_live_a1b2', isActive: true, requestCount: 8420, lastUsedAt: '2025-05-21T14:00:00Z', createdAt: '2025-01-15T10:00:00Z' },
  { id: '2', user: 'sarah.k@broker.com',     prefix: 'td_live_c3d4', isActive: true, requestCount: 3210, lastUsedAt: '2025-05-21T12:30:00Z', createdAt: '2025-02-01T10:00:00Z' },
  { id: '3', user: 'mike.t@enterprise.com',  prefix: 'td_live_e5f6', isActive: false,requestCount: 1840, lastUsedAt: '2025-05-10T09:00:00Z', createdAt: '2025-03-10T10:00:00Z' },
]

export default function ApiKeysPage() {
  const [search, setSearch] = useState('')

  const filtered = mockKeys.filter(k =>
    k.user.toLowerCase().includes(search.toLowerCase()) ||
    k.prefix.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <Topbar title="API Key Oversight" />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Total Keys</p><p className="text-2xl font-bold mt-1">847</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Active Keys</p><p className="text-2xl font-bold mt-1 text-green-600">812</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Requests Today</p><p className="text-2xl font-bold mt-1">92,400</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">All API Keys</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by user or prefix..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-3 font-medium">User</th>
                <th className="pb-3 font-medium">Key Prefix</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Requests</th>
                <th className="pb-3 font-medium">Last Used</th>
                <th className="pb-3 font-medium">Created</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(key => (
                <tr key={key.id} className="hover:bg-gray-50">
                  <td className="py-3">{key.user}</td>
                  <td className="py-3 font-mono text-xs">{key.prefix}••••••••</td>
                  <td className="py-3">
                    <Badge variant={key.isActive ? 'success' : 'secondary'}>
                      {key.isActive ? 'Active' : 'Revoked'}
                    </Badge>
                  </td>
                  <td className="py-3">{key.requestCount.toLocaleString()}</td>
                  <td className="py-3 text-muted-foreground">{formatDateTime(key.lastUsedAt)}</td>
                  <td className="py-3 text-muted-foreground">{formatDateTime(key.createdAt)}</td>
                  <td className="py-3">
                    {key.isActive && (
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                        <Ban className="mr-1 h-3 w-3" /> Revoke
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
