# TicketDots Admin Panel

Separate Next.js admin dashboard for managing the TicketDots platform.

## Prerequisites

- **Node.js**: v20.x or higher
- **npm**: v10.x or higher
- **ticketdots-backend** running on port 4000

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Admin panel runs on **http://localhost:3001**

Login requires an account with `role: "admin"` in the database.

## Pages

| Route | Description |
|-------|-------------|
| `/dashboard` | Overview stats, activity feed, system status |
| `/dashboard/users` | List, search, suspend, promote users |
| `/dashboard/plans` | Create, edit, delete subscription plans |
| `/dashboard/subscriptions` | View all user subscriptions |
| `/dashboard/events` | Manage tracked events |
| `/dashboard/venues` | Create and manage venues |
| `/dashboard/blog` | Full blog CMS (create, edit, publish) |
| `/dashboard/notifications` | Send notifications to users |
| `/dashboard/api-keys` | View and revoke API keys |
| `/dashboard/scraper` | Control scraper workers per market |
| `/dashboard/health` | System health, resource usage, error logs |
| `/dashboard/settings` | Platform config, admin account, danger zone |

## Adding a New Admin Page

1. Create `app/dashboard/your-page/page.tsx`
2. Add `'use client'` at the top
3. Import `Topbar` and use it as the first element
4. Add the route to `components/layout/sidebar.tsx` navItems array

## Project Structure

```
ticketdots-admin/
├── app/
│   ├── login/page.tsx
│   └── dashboard/
│       ├── layout.tsx          # Sidebar + main wrapper
│       ├── page.tsx            # Dashboard home
│       ├── users/page.tsx
│       ├── plans/page.tsx
│       ├── subscriptions/page.tsx
│       ├── events/page.tsx
│       ├── venues/page.tsx
│       ├── blog/page.tsx
│       ├── notifications/page.tsx
│       ├── api-keys/page.tsx
│       ├── scraper/page.tsx
│       ├── health/page.tsx
│       └── settings/page.tsx
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   └── topbar.tsx
│   └── ui/                     # Shared UI components
├── lib/
│   ├── api.ts                  # API client (all backend calls)
│   └── utils.ts                # Helpers (formatDate, getToken, etc.)
└── README.md
```
