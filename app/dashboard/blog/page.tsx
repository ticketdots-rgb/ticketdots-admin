'use client'

import { useEffect, useState } from 'react'
import { Topbar } from '@/components/layout/topbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { api } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { Plus, Pencil, Trash2, Check, X, Eye } from 'lucide-react'

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<any>({})
  const [filter, setFilter] = useState('all')

  useEffect(() => { fetchPosts() }, [])

  async function fetchPosts() {
    try {
      setLoading(true)
      const res = await api.getBlogPosts(1, 50)
      setPosts(res.data || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  function startCreate() {
    setCreating(true)
    setEditing(null)
    setForm({ title: '', slug: '', body: '', excerpt: '', coverImageUrl: '', tags: '', status: 'draft' })
  }

  async function startEdit(id: string) {
    try {
      const post = await api.getBlogPostById(id)
      setEditing(id)
      setCreating(false)
      setForm({ ...post, tags: (post.tags || []).join(', ') })
    } catch (err) { console.error(err) }
  }

  async function handleSave() {
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
      }
      if (creating) await api.createBlogPost(payload)
      else await api.updateBlogPost(editing!, payload)
      setCreating(false)
      setEditing(null)
      fetchPosts()
    } catch (err) { console.error(err) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this post?')) return
    try {
      await api.deleteBlogPost(id)
      fetchPosts()
    } catch (err) { console.error(err) }
  }

  function generateSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  const filtered = posts.filter(p => filter === 'all' || p.status === filter)

  return (
    <div className="space-y-6">
      <Topbar title="Blog CMS" />

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {['all', 'published', 'draft'].map(f => (
            <Button key={f} variant={filter === f ? 'default' : 'outline'} size="sm" onClick={() => setFilter(f)} className="capitalize">
              {f}
            </Button>
          ))}
        </div>
        <Button onClick={startCreate}><Plus className="mr-2 h-4 w-4" /> New Post</Button>
      </div>

      {/* Editor */}
      {(creating || editing) && (
        <Card>
          <CardHeader><CardTitle className="text-base">{creating ? 'New Post' : 'Edit Post'}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Title</Label>
                <Input
                  value={form.title || ''}
                  onChange={e => setForm({ ...form, title: e.target.value, slug: generateSlug(e.target.value) })}
                  placeholder="Post title"
                />
              </div>
              <div className="space-y-1">
                <Label>Slug</Label>
                <Input value={form.slug || ''} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="post-slug" />
              </div>
              <div className="space-y-1">
                <Label>Status</Label>
                <Select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Tags (comma separated)</Label>
                <Input value={form.tags || ''} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="analytics, strategy, ai" />
              </div>
              <div className="space-y-1">
                <Label>Cover Image URL</Label>
                <Input value={form.coverImageUrl || ''} onChange={e => setForm({ ...form, coverImageUrl: e.target.value })} placeholder="/blog/image.jpg" />
              </div>
              <div className="space-y-1">
                <Label>Excerpt</Label>
                <Input value={form.excerpt || ''} onChange={e => setForm({ ...form, excerpt: e.target.value })} placeholder="Short description..." />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Body (Markdown)</Label>
              <Textarea
                value={form.body || ''}
                onChange={e => setForm({ ...form, body: e.target.value })}
                rows={12}
                placeholder="Write your post content in Markdown..."
                className="font-mono text-sm"
              />
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

      {/* Posts Table */}
      <Card>
        <CardHeader><CardTitle className="text-base">Posts ({filtered.length})</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Loading posts...</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Title</th>
                  <th className="pb-3 font-medium">Slug</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Tags</th>
                  <th className="pb-3 font-medium">Published</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map(post => (
                  <tr key={post._id} className="hover:bg-gray-50">
                    <td className="py-3 font-medium max-w-[240px] truncate">{post.title}</td>
                    <td className="py-3 text-muted-foreground text-xs">{post.slug}</td>
                    <td className="py-3">
                      <Badge variant={post.status === 'published' ? 'success' : 'secondary'}>
                        {post.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1">
                        {(post.tags || []).slice(0, 2).map((tag: string) => (
                          <span key={tag} className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">{tag}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 text-muted-foreground">{post.publishedAt ? formatDate(post.publishedAt) : '—'}</td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => startEdit(post._id)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(post._id)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
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
