# Phased Backlog (MVP -> Evolution)

This backlog follows our agreed constraints:
- keep dashboard at route `/` (current route-group setup)
- keep Next.js 14 for now
- read data with Prisma directly in Server Components
- use Server Actions for mutations

## Phase 1 - MVP Foundation (real data working)

Goal: replace mocks with real data, auth, and persistence.

### 1. Environment and project setup
- [x] Add a documented `.env.example` for public portfolio usage
- [x] Document required variables:
  - [x] `DATABASE_URL`
  - [x] `AUTH_SECRET`
  - [x] `AUTH_GOOGLE_ID`
  - [x] `AUTH_GOOGLE_SECRET`
  - [x] `NEXTAUTH_URL` (if needed by deployment target)

### 2. Database (Prisma + Neon)
- [x] Install `prisma` and `@prisma/client`
- [x] Create `prisma/schema.prisma`
- [x] Model entities:
  - [x] `User` (`id`, `name`, `email`, `image`, `createdAt`)
  - [x] `Project` (`id`, `name`, `description`, `userId`, `createdAt`)
  - [x] `Task` (`id`, `title`, `description`, `status`, `priority`, `projectId`, `userId`, `dueDate`, `createdAt`, `updatedAt`)
  - [x] Enums `Status` (`TODO`, `IN_PROGRESS`, `DONE`) and `Priority` (`LOW`, `MEDIUM`, `HIGH`)
- [x] Create `src/lib/db.ts` with `PrismaClient` singleton
- [x] Create and validate the initial migration (`20260514_init` via Docker local)

### 3. Authentication (Auth.js v5 + Google + Prisma Adapter)
- [x] Install `next-auth` and `@auth/prisma-adapter`
- [x] Configure `src/auth.ts` with Google Provider
- [x] Configure Prisma Adapter to persist users on first login
- [x] Configure `src/middleware.ts` to protect authenticated areas
- [x] Define public vs private routes
- [x] Add proper TypeScript session/user typing (module augmentation → `src/types/next-auth.d.ts`)
- [x] Remove legacy custom auth flow:
  - [x] `src/services/auth.ts`
  - [x] client-side protection via `ProtectedRoute` (moved to `middleware.ts`)

### 4. Server Actions (mutations only)
- [ ] Create `src/lib/actions/`
- [ ] Create `src/lib/actions/projects.ts`:
  - [ ] `createProject`
  - [ ] `updateProject`
  - [ ] `deleteProject`
- [ ] Create `src/lib/actions/tasks.ts`:
  - [ ] `createTask`
  - [ ] `updateTask`
  - [ ] `deleteTask`
  - [ ] `updateTaskStatus`
- [ ] Validate all payloads with Zod
- [ ] Standardize return shape: `{ success, data?, error? }`
- [ ] Enforce auth checks on all mutations
- [ ] Add explicit IDOR protections:
  - [ ] always scope updates/deletes by ownership (`userId`)
  - [ ] validate `projectId` ownership before task mutations
  - [ ] never trust client-provided ownership fields

### 5. Server-side reads (no mocks)
- [ ] Remove dashboard dependency on mock hooks
- [ ] Implement server-side Prisma reads on pages:
  - [ ] `/` (overview with real metrics)
  - [ ] `/projects` (user project list)
  - [ ] `/projects/[id]` (project tasks with status filter)
  - [ ] `/tasks` (all user tasks with filters)
- [ ] Keep existing UI system (sidebar, header, shadcn, charts)
- [ ] Connect forms to mutation Server Actions

### 6. Minimum delivery quality
- [ ] `npm run lint` with zero errors
- [ ] `npm test -- --watch=false` passing
- [ ] `npm run build` passing
- [ ] Manual validation of core flows:
  - [ ] Google login
  - [ ] create/edit/delete project
  - [ ] create/edit/delete task
  - [ ] update task status

---

## Phase 2 - Technical polish

Goal: harden architecture and improve UX consistency.

- [ ] Migrate unnecessary Client Components to Server Components
- [ ] Apply `Suspense` + `Skeleton` consistently across critical flows
- [ ] Add polished empty states for all list/detail screens
- [ ] Standardize error handling and user feedback patterns
- [ ] Review accessibility and interaction states
- [ ] Add tests for critical paths (unit/integration)
- [ ] Upgrade Next.js 14 -> 15
- [ ] Run compatibility pass after upgrade (Auth.js, Prisma, lint/build/tests)

---

## Phase 3 - Product evolution (Model 3)

Goal: evolve into a hybrid list + kanban experience.

- [ ] Add Kanban view to `/projects/[id]`
- [ ] Implement drag and drop with `dnd-kit`
- [ ] Improve advanced filtering in `/tasks`
- [ ] Improve productivity metrics (by period/project/priority)
- [ ] Add assignees support:
  - [ ] model relations and permissions
  - [ ] assign/unassign flows in UI
  - [ ] assignee-based filters and metrics

---

## Out of scope for now

- [ ] Broad refactors without direct MVP impact
