# Appointment Booking System

A full-stack appointment booking system that allows customers to browse bank branches, view available time slots, and book appointments. Built as part of the Capitec SE3 take-home assessment.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development](#local-development)
  - [Docker](#docker)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [CI/CD](#cicd)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                        Frontend                         │
│  React + Vite  ──►  React Query  ──►  Axios API Client │
└───────────────────────────┬─────────────────────────────┘
                            │ HTTP /api
┌───────────────────────────▼─────────────────────────────┐
│                         Backend                         │
│  Express Routes                                         │
│    └── Validation (Zod middleware)                      │
│    └── Controllers  (HTTP in/out)                       │
│        └── Services (business logic)                    │
│            └── Repositories (data access)               │
│                └── Prisma ORM ──► PostgreSQL            │
└─────────────────────────────────────────────────────────┘
```

**Key design decisions:**
- **Repository pattern** — services never touch Prisma directly; data access is isolated and testable
- **Zod validation** on both client and server — schemas are co-located with their domains
- **React Query** for server state — automatic caching, background refetch, and stale-while-revalidate
- **Prisma transactions** on booking creation — prevents race conditions on concurrent slot booking
- **Fire-and-forget email** — confirmation email is non-blocking so booking creation is never delayed by SMTP

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, TailwindCSS |
| State Management | TanStack React Query v5 |
| Forms | React Hook Form + Zod |
| Backend | Node.js, Express 5, TypeScript |
| ORM | Prisma 7 (PostgreSQL adapter) |
| Database | PostgreSQL 15 |
| Validation | Zod (shared schemas) |
| Logging | Pino (JSON in production, pretty in dev) |
| Testing (backend) | Jest + Supertest |
| Testing (frontend) | Vitest + Testing Library |
| Containerisation | Docker + Docker Compose |
| CI/CD | GitHub Actions |

---

## Getting Started

### Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [npm 10+](https://www.npmjs.com/)

### Local Development

**1. Install all dependencies (root, backend, frontend):**

```bash
npm run install:all
```

**2. Copy and configure environment files:**

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edit `backend/.env` with your local values (see [Environment Variables](#environment-variables)).

**3. Start PostgreSQL:**

```bash
docker compose up postgres -d
```

**4. Run database migrations and seed:**

```bash
cd backend && npm run db:setup
```

**5. Start both frontend and backend with a single command (from repo root):**

```bash
npm run dev
```

This starts:
- Backend API at **http://localhost:5000**
- Frontend at **http://localhost:5173**

> **Note:** Docker uses different ports to avoid conflicts with local dev — see the [Docker](#docker) section.

---

### Docker

**Build and run all services (PostgreSQL + backend + frontend):**

```bash
npm run docker:up
```

Or using Make:

```bash
make docker
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5001/api |
| PostgreSQL | localhost:5433 |
| Mailpit (email UI) | http://localhost:8025 |

After booking an appointment, open **http://localhost:8025** to view the confirmation email in Mailpit's inbox — no real email is sent.

**Stop all services:**

```bash
npm run docker:down
```

> On first run, migrations and seed data are applied automatically by the backend entrypoint.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | ✅ | — | PostgreSQL connection string |
| `PORT` | ❌ | `5000` | HTTP port the API listens on |
| `NODE_ENV` | ❌ | `development` | `development` \| `production` \| `test` |
| `FRONTEND_URL` | ❌ | `http://localhost:5173` | CORS allowed origin |
| `SMTP_HOST` | ❌ | — | SMTP host for email (e.g. `localhost` for Mailpit) |
| `SMTP_PORT` | ❌ | `1025` | SMTP port (Mailpit default: `1025`) |

**Example:**
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/appointments
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Optional — point to a local Mailpit instance for email UI
# docker run -d -p 8025:8025 -p 1025:1025 --name mailpit axllent/mailpit
SMTP_HOST=localhost
SMTP_PORT=1025
```

### Frontend (`frontend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | ❌ | `/api` | Backend API base URL (defaults to nginx proxy in Docker) |

**Example:**
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Database

### Migrations

```bash
# Apply all pending migrations (safe for production)
cd backend && npx prisma migrate deploy

# Create a new migration during development
cd backend && npm run db:migrate

# Reset database (drops and recreates — dev only)
cd backend && npm run db:reset
```

### Seeding

Branch data is defined in [`backend/prisma/data/branches.json`](backend/prisma/data/branches.json). To add a new branch, add an entry to that JSON file and re-run the seed — no TypeScript changes required.

```bash
# Run migrations then seed (use after a fresh or dropped database)
cd backend && npm run db:setup

# Seed only (safe to run multiple times — uses upsert + skipDuplicates)
cd backend && npm run db:seed
```

Seeding creates branches and generates 30-minute time slots across a 14-day rolling window for each branch.

---

## API Reference

All endpoints are prefixed with `/api`.

### Health

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Service health check |

**Response `200`:**
```json
{ "status": "ok" }
```

---

### Branches

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/branches` | List all active branches |
| `GET` | `/api/branches/:id` | Get a branch by UUID |

**Query parameters for `GET /api/branches`:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `search` | string | — | Filter by name or city (case-insensitive) |
| `page` | number | `1` | Page number for pagination |
| `limit` | number | `9` | Results per page (max 50) |

**Response `200`:**
```json
{
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "name": "Sandton Branch",
      "location": "Sandton City Mall",
      "address": "Shop 123, Sandton City, 83 Rivonia Rd",
      "city": "Johannesburg",
      "province": "Gauteng",
      "openingTime": "08:00",
      "closingTime": "17:00",
      "isActive": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 9,
    "total": 5,
    "totalPages": 1,
    "hasNextPage": false
  }
}
```

---

### Slots

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/slots` | Get available time slots |

**Query parameters (all required):**

| Parameter | Type | Description |
|---|---|---|
| `branchId` | UUID | Branch to query slots for |
| `date` | `YYYY-MM-DD` | Date to query slots for |

**Response `200`:**
```json
{
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "startTime": "09:00",
      "endTime": "09:30",
      "isBooked": false
    }
  ]
}
```

---

### Bookings

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/bookings` | Create a new booking |
| `GET` | `/api/bookings/:bookingReference` | Get a booking by reference |

> `POST /api/bookings` is rate-limited to **10 requests per minute** per IP.

**`POST /api/bookings` — Request body:**

```json
{
  "slotId": "uuid",
  "branchId": "uuid",
  "customerName": "Jane Doe",
  "customerEmail": "jane@example.com",
  "customerPhone": "0821234567",
  "notes": "Optional notes"
}
```

| Field | Type | Rules |
|---|---|---|
| `slotId` | UUID | Required |
| `branchId` | UUID | Required |
| `customerName` | string | 2–100 characters |
| `customerEmail` | string | Valid email |
| `customerPhone` | string | 10–20 characters |
| `notes` | string | Optional, max 500 characters |

**Response `201`:**
```json
{
  "message": "Booking confirmed",
  "data": {
    "bookingReference": "BK-20260511-A1B2",
    "customerName": "Jane Doe",
    "customerEmail": "jane@example.com",
    "slotDate": "2026-05-15",
    "startTime": "09:00",
    "endTime": "09:30",
    "branchName": "Sandton Branch"
  }
}
```

### Error responses

| Status | Code | Meaning |
|---|---|---|
| `400` | `VALIDATION_ERROR` | Invalid request body or query params |
| `404` | `BRANCH_NOT_FOUND` | Branch UUID does not exist |
| `404` | `SLOT_NOT_FOUND` | Slot UUID does not exist |
| `409` | `SLOT_UNAVAILABLE` | Slot was already booked |
| `429` | `RATE_LIMIT_EXCEEDED` | Too many booking requests |
| `500` | `INTERNAL_ERROR` | Unexpected server error |

---

## Testing

### Run all tests

```bash
# From repo root
npm test

# Backend only
cd backend && npm test

# Frontend only
cd frontend && npm test
```

### Run with coverage

```bash
cd backend && npm run test:coverage
cd frontend && npm run test:coverage
```

### Test strategy

| Layer | Framework | Coverage |
|---|---|---|
| Backend unit tests | Jest | Services, utils, validators |
| Backend integration tests | Jest + Supertest | All API endpoints against a real PostgreSQL test DB |
| Frontend component tests | Vitest + Testing Library | UI components, form validation, user interactions |

Integration tests use a separate `.env.test` file and an isolated test database. Each test suite cleans up its data in `beforeEach`/`afterAll` hooks.

---

## Project Structure

```
appointment-booking-system/
├── backend/
│   ├── prisma/
│   │   ├── data/branches.json      # Branch seed data (edit to add branches)
│   │   ├── migrations/             # Prisma migration history
│   │   ├── schema.prisma           # Database schema
│   │   └── seed.ts                 # Seed script
│   ├── src/
│   │   ├── config/                 # env, database, logger
│   │   ├── controllers/            # HTTP request/response handlers
│   │   ├── middleware/             # asyncHandler, validate, error, notFound
│   │   ├── repositories/           # Data access layer (Prisma)
│   │   ├── routes/                 # Express route definitions
│   │   ├── services/               # Business logic
│   │   ├── utils/                  # ApiError, response helpers, generateReference
│   │   └── validators/             # Zod schemas
│   └── tests/
│       ├── integration/            # API endpoint tests
│       └── unit/                   # Service, util, validator tests
└── frontend/
    └── src/
        ├── app/                    # App entry, providers, routes
        ├── components/
        │   ├── booking/            # Domain-specific components
        │   ├── forms/              # Reusable form primitives
        │   ├── layout/             # Navbar, PageContainer
        │   └── ui/                 # Button, Input, Card, Alert, Spinner…
        ├── features/bookings/
        │   ├── api/                # Raw API call functions
        │   ├── hooks/              # React Query hooks
        │   ├── types/              # TypeScript interfaces
        │   └── validation/         # Zod client-side schemas
        ├── hooks/                  # Shared hooks (useDebounce)
        ├── pages/                  # HomePage, BookingPage, ConfirmationPage
        └── services/               # Axios client, endpoint constants
```

---

## CI/CD

The GitHub Actions pipeline ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) runs on every push and on every pull request.

```
lint ──► test ──► build ──► docker
```

| Job | What it does |
|---|---|
| `lint` | ESLint on frontend, `tsc --noEmit` on backend |
| `test` | Frontend (Vitest) + backend (Jest + Supertest) against a real PostgreSQL service container |
| `build` | Vite production build (frontend) + `tsc` compile (backend) |
| `docker` | Builds Docker images for frontend and backend to verify Dockerfiles are valid |

Each job runs only if the previous one passes — a lint failure will not waste runner minutes on tests.
