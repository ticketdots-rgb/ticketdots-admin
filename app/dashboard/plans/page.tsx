'use client'

import { useEffect, useState } from 'react'
import { Topbar } from '@/components/layout/topbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { api } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'

export default function PlansPage() {
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<any>({})

  useEffect(() => { fetchPlans() }, [])

  async function fetchPlans() {
    try {
      setLoading(true)
      const res = await api.getPlans()
      setPlans(Array.isArray(res) ? res : res.data || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  function startEdit(plan: any) {
    setEditing(plan._id)
    setForm({ ...plan })
    setCreating(false)
  }

  function startCreate() {
    setCreating(true)
    setEditing(null)
    setForm({ name: 'starter', refreshIntervalMinutes: 10, maxMonitoringEvents: 10, maxMarkets: 2, hasAlerts: false, hasApiAccess: false, hasAiAnalytics: false, hasCsvExport: true, hasAdvancedAnalytics: false, monthlyPriceCents: 0, annualPriceCents: 0 })
  }

  async function handleSave() {
    try {
      if (creating) {
        await api.createPlan(form)
      } else {
        await api.updatePlan(editing, form)
      }
      setEditing(null)
      setCreating(false)
      fetchPlans()
    } catch (err) { console.error(err) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this plan?')) return
    try {
      await api.deletePlan(id)
      fetchPlans()
    } catch (err) { console.error(err) }
  }

  const featureFlags = ['hasAlerts', 'hasApiAccess', 'hasAiAnalytics', 'hasCsvExport', 'hasAdvancedAnalytics']

  return (
    <div className="space-y-6">
      <Topbar title="Plan Management" />

      <div className="flex justify-end">
        <Button onClick={startCreate}>
          <Plus className="mr-2 h-4 w-4" /> New Plan
        </Button>
      </div>

      {/* Create / Edit Form */}
      {(creating || editing) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{creating ? 'Create Plan' : 'Edit Plan'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Name</Label>
                <Select value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}>
                  <option value="starter">Starter</option>
                  <option value="premium">Premium</option>
                  <option value="enterprise">Enterprise</option>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Refresh Interval (min)</Label>
                <Select value={form.refreshIntervalMinutes} onChange={e => setForm({ ...form, refreshIntervalMinutes: Number(e.target.value) })}>
                  <option value={5}>5 minutes</option>
                  <option value={10}>10 minutes</option>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Max Monitoring Events (-1 = unlimited)</Label>
                <Input type="number" value={form.maxMonitoringEvents} onChange={e => setForm({ ...form, maxMonitoringEvents: Number(e.target.value) })} />
              </div>
              <div className="space-y-1">
                <Label>Max Markets (-1 = unlimited)</Label>
                <Input type="number" value={form.maxMarkets} onChange={e => setForm({ ...form, maxMarkets: Number(e.target.value) })} />
              </div>
              <div className="space-y-1">
                <Label>Monthly Price (cents)</Label>
                <Input type="number" value={form.monthlyPriceCents} onChange={e => setForm({ ...form, monthlyPriceCents: Number(e.target.value) })} />
              </div>
              <div className="space-y-1">
                <Label>Annual Price (cents)</Label>
                <Input type="number" value={form.annualPriceCents} onChange={e => setForm({ ...form, annualPriceCents: Number(e.target.value) })} />
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Feature Flags</Label>
              <div className="flex flex-wrap gap-3">
                {featureFlags.map(flag => (
                  <label key={flag} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!form[flag]}
                      onChange={e => setForm({ ...form, [flag]: e.target.checked })}
                    />
                    {flag.replace('has', '')}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave}><Check className="mr-2 h-4 w-4" /> Save</Button>
              <Button variant="outline" onClick={() => { setEditing(null); setCreating(false) }}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans Table */}
      <Card>
        <CardHeader><CardTitle className="text-base">All Plans</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Loading plans...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Monthly</th>
                    <th className="pb-3 font-medium">Annual</th>
                    <th className="pb-3 font-medium">Events</th>
                    <th className="pb-3 font-medium">Markets</th>
                    <th className="pb-3 font-medium">Features</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {plans.map((plan) => (
                    <tr key={plan._id} className="hover:bg-gray-50">
                      <td className="py-3 font-semibold capitalize">{plan.name}</td>
                      <td className="py-3">{formatCurrency(plan.monthlyPriceCents)}</td>
                      <td className="py-3">{formatCurrency(plan.annualPriceCents)}</td>
                      <td className="py-3">{plan.maxMonitoringEvents === -1 ? 'Unlimited' : plan.maxMonitoringEvents}</td>
                      <td className="py-3">{plan.maxMarkets === -1 ? 'Unlimited' : plan.maxMarkets}</td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-1">
                          {featureFlags.filter(f => plan[f]).map(f => (
                            <Badge key={f} variant="success" className="text-xs">{f.replace('has', '')}</Badge>
                          ))}
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => startEdit(plan)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(plan._id)} className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
