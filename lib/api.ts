import { getToken, logout } from './utils'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (res.status === 401) {
    logout()
    throw new Error('Session expired')
  }

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || 'Request failed')
  }

  return data
}

// Users
export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<any>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  // Users
  getUsers: (page = 1, limit = 20) =>
    request<any>(`/users?page=${page}&limit=${limit}`),
  getUserById: (id: string) =>
    request<any>(`/users/${id}`),
  updateUser: (id: string, data: any) =>
    request<any>(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteUser: (id: string) =>
    request<any>(`/users/${id}`, { method: 'DELETE' }),

  // Plans
  getPlans: () =>
    request<any>('/plans'),
  createPlan: (data: any) =>
    request<any>('/plans', { method: 'POST', body: JSON.stringify(data) }),
  updatePlan: (id: string, data: any) =>
    request<any>(`/plans/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deletePlan: (id: string) =>
    request<any>(`/plans/${id}`, { method: 'DELETE' }),

  // Events
  getEvents: (page = 1, limit = 20) =>
    request<any>(`/events?page=${page}&limit=${limit}`),
  createEvent: (data: any) =>
    request<any>('/events', { method: 'POST', body: JSON.stringify(data) }),
  updateEvent: (id: string, data: any) =>
    request<any>(`/events/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteEvent: (id: string) =>
    request<any>(`/events/${id}`, { method: 'DELETE' }),

  // Venues
  getVenues: (page = 1, limit = 20) =>
    request<any>(`/venues?page=${page}&limit=${limit}`),
  createVenue: (data: any) =>
    request<any>('/venues', { method: 'POST', body: JSON.stringify(data) }),
  updateVenue: (id: string, data: any) =>
    request<any>(`/venues/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteVenue: (id: string) =>
    request<any>(`/venues/${id}`, { method: 'DELETE' }),

  // Subscriptions
  getSubscriptions: (page = 1, limit = 20) =>
    request<any>(`/subscriptions?page=${page}&limit=${limit}`),

  // Blog
  getBlogPosts: (page = 1, limit = 20, status?: string) =>
    request<any>(`/blog/admin?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`),
  getBlogPostById: (id: string) =>
    request<any>(`/blog/${id}`),
  createBlogPost: (data: any) =>
    request<any>('/blog', { method: 'POST', body: JSON.stringify(data) }),
  updateBlogPost: (id: string, data: any) =>
    request<any>(`/blog/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteBlogPost: (id: string) =>
    request<any>(`/blog/${id}`, { method: 'DELETE' }),

  // Analytics
  getTopEvents: (limit = 10) =>
    request<any>(`/analytics/top-events?limit=${limit}`),

  // Notifications
  createNotification: (data: any) =>
    request<any>('/notifications', { method: 'POST', body: JSON.stringify(data) }),
}
