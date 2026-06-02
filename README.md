# Nexus Dashboard

A full-stack project management dashboard built with Next.js, featuring authentication, task tracking, and data visualization.

![preview](./public/preview.png)

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Auth:** Auth.js v5 (NextAuth) with Google OAuth + Credentials
- **Database:** PostgreSQL via Prisma ORM
- **Styling:** Tailwind CSS + Radix UI
- **State:** TanStack Query
- **Testing:** Jest + Playwright

## Features

- Credential and Google OAuth authentication
- Password reset flow with email verification
- Protected routes via Edge middleware
- Dark/Light theme
- Kanban board with drag-and-drop
- Dashboard with charts and analytics
- Responsive layout

## Getting Started

### Prerequisites

- Node.js 18.17+
- PostgreSQL

### Installation

```bash
git clone https://github.com/patriciasegantine/nexus-dashboard-frontend.git
cd nexus-dashboard-frontend
npm install
```

### Environment variables

```bash
cp .env.example .env
```

Required variables:

```env
DATABASE_URL=

AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM=
```

### Database

```bash
npm run prisma:migrate
```

### Running

```bash
npm run dev        # development
npm run build      # production build
npm run start      # production server
```

### Tests

```bash
npm test              # Jest unit + integration tests
npm run test:e2e      # Playwright e2e (headless)
npm run test:e2e:ui   # Playwright e2e (UI mode)
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # login, register, forgot/reset password
│   ├── (dashboard)/     # protected pages (board, tasks, overview...)
│   └── api/             # API routes (auth, webhooks)
├── auth/                # Auth.js config (Edge-safe)
├── components/          # Shared UI components
├── constants/           # App-wide constants
├── contexts/            # React contexts
├── hooks/               # Custom hooks
├── lib/                 # Utilities, db client, email, rate limiting
├── providers/           # App providers
├── types/               # TypeScript types
└── validations/         # Zod schemas
```

## Architecture

This project is migrating from a client-only frontend (consuming an external REST API) to a **full-stack Next.js application** using the built-in backend capabilities.

### Current state

- Authentication is fully handled server-side via Auth.js v5 + Prisma
- Password reset, email sending, and rate limiting run as Next.js API Routes
- Dashboard data is still consumed from the external API (migration in progress)

### Pending architectural work

- Remove remaining external API calls and migrate data fetching to server actions or Next.js route handlers
- Resolve `AppContext` theme duplication with `next-themes`
- Clean up `dotenv` from production dependencies (Next.js loads `.env` natively)
- Standardize component co-location across auth pages
- Evaluate `axios` usage — likely replaceable with native `fetch` after full migration

---

Created with ❤️ by Patricia Segantine
