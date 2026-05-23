'use client'

import { useState } from 'react'
import { Topbar } from '@/components/layout/topbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { api } from '@/lib/api'
import { Send, Bell } from 'lucide-react'

export default function NotificationsPage() {
  const [form, setForm] = useState({ userId: '', title: '', body: '', type: 'system' })
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    try {
      setSending(true)
      await api.createNotification(form)
      setSuccess(true)
      setForm({ userId: '', title: '', body: '', type: 'system' })
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <Topbar title="Notifications" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Send Notification */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Send className="h-4 w-4" /> Send Notification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSend} className="space-y-4">
              <div className="space-y-1">
                <Label>User ID</Label>
                <Input
                  value={form.userId}
                  onChange={e => setForm({ ...form, userId: e.target.value })}
                  placeholder="MongoDB ObjectId of user"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Type</Label>
                <Select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option value="system">System</option>
                  <option value="billing">Billing</option>
                  <option value="alert">Alert</option>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Notification title"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Message</Label>
                <Textarea
                  value={form.body}
                  onChange={e => setForm({ ...form, body: e.target.value })}
                  placeholder="Notification body..."
                  rows={4}
                  required
                />
              </div>
              {success && (
                <p className="text-sm text-green-600 font-medium">Notification sent successfully!</p>
              )}
              <Button type="submit" disabled={sending}>
                <Send className="mr-2 h-4 w-4" />
                {sending ? 'Sending...' : 'Send Notification'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Broadcast */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4" /> Broadcast to All Users
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Send a system-wide notification to all active users. Use for maintenance notices, feature announcements, or important updates.
            </p>
            <div className="space-y-1">
              <Label>Title</Label>
              <Input placeholder="Announcement title" />
            </div>
            <div className="space-y-1">
              <Label>Message</Label>
              <Textarea placeholder="Announcement body..." rows={4} />
            </div>
            <div className="space-y-1">
              <Label>Target Audience</Label>
              <Select defaultValue="all">
                <option value="all">All Users</option>
                <option value="premium">Premium Plan</option>
                <option value="enterprise">Enterprise Plan</option>
                <option value="starter">Starter Plan</option>
              </Select>
            </div>
            <Button variant="outline">
              <Bell className="mr-2 h-4 w-4" /> Broadcast
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
