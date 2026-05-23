'use client'

import { Topbar } from '@/components/layout/topbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <Topbar title="Settings" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* General */}
        <Card>
          <CardHeader><CardTitle className="text-base">General Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>Platform Name</Label>
              <Input defaultValue="TicketDots" />
            </div>
            <div className="space-y-1">
              <Label>Support Email</Label>
              <Input defaultValue="support@ticketdots.com" type="email" />
            </div>
            <div className="space-y-1">
              <Label>Frontend URL</Label>
              <Input defaultValue="https://ticketdots.com" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Admin Account */}
        <Card>
          <CardHeader><CardTitle className="text-base">Admin Account</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>Current Password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-1">
              <Label>New Password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-1">
              <Label>Confirm New Password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <Button>Update Password</Button>
          </CardContent>
        </Card>

        {/* API Config */}
        <Card>
          <CardHeader><CardTitle className="text-base">API Configuration</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>Global Rate Limit (req/min)</Label>
              <Input type="number" defaultValue="100" className="w-32" />
            </div>
            <div className="space-y-1">
              <Label>Enterprise Rate Limit (req/min)</Label>
              <Input type="number" defaultValue="1000" className="w-32" />
            </div>
            <div className="space-y-1">
              <Label>JWT Expiry</Label>
              <Input defaultValue="7d" className="w-32" />
            </div>
            <Button>Save API Config</Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader><CardTitle className="text-base text-red-600">Danger Zone</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Flush Redis Cache</p>
              <p className="text-xs text-muted-foreground mb-2">Clears all cached data. Jobs will be re-queued.</p>
              <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">Flush Cache</Button>
            </div>
            <div>
              <p className="text-sm font-medium">Clear All Snapshots</p>
              <p className="text-xs text-muted-foreground mb-2">Permanently deletes all inventory snapshots.</p>
              <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">Clear Snapshots</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
