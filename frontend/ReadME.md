# RecruitIQ

> An agentic recruitment intelligence platform that parses, scores, and ranks thousands of resumes in minutes — powered by LLM-based document parsing, vector-space semantic matching, and a feedback-driven scoring engine.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql)
![Redis](https://img.shields.io/badge/Redis-BullMQ-DC382D?style=flat-square&logo=redis)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker)
![Claude API](https://img.shields.io/badge/Claude-Sonnet_4.6-D4A853?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## What It Does

Companies that post jobs receive thousands of resumes. Manual screening at that volume is not possible. RecruitIQ solves this with a two-sided platform:

- **Applicants** browse open positions and submit applications through a clean hosted form — no account needed.
- **Recruiters** define job requirements once, connect their existing channels (Gmail, Outlook, Greenhouse, Lever), and receive a live-ranked shortlist as applications arrive — without touching a single file manually.

Every resume is parsed by AI into structured data, scored against the job's specific requirements using a 4-dimension weighted engine, stored permanently in a searchable database, and surfaced to the recruiter with a plain-English AI rationale explaining why each candidate scored the way they did.

---

## Key Features

- **Multi-source ingestion** — resumes arrive from the platform form, Gmail/Outlook inboxes, and ATS platforms (Greenhouse, Lever) via webhooks. All sources feed the same pipeline.
- **AI parsing** — Claude API extracts structured candidate data from messy, unformatted resumes (education, experience, skills, certifications, projects).
- **4-dimension scoring** — skills match, experience match, education match, and semantic relevance via vector embeddings. Recruiter controls the weight of each dimension.
- **Semantic matching** — cosine similarity between job description and resume embeddings catches relevance that keyword matching misses.
- **Permanent candidate database** — every resume ever received is stored, searchable, and filterable across all jobs and all time.
- **Email notifications** — instant alert when a candidate clears the cutoff, or daily digest summarising all activity. Recruiter can shortlist or reject directly from the email.
- **Feedback learning loop** — recruiter marks hired/rejected outcomes after each round. Scoring weights self-adjust per company toward patterns that produced good hires.
- **AI rationale** — every shortlisted candidate gets a 2–3 sentence plain-English explanation of their score. No black-box decisions.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        INTAKE LAYER                             │
│                                                                 │
│  Platform Form      Gmail/Outlook        Greenhouse / Lever     │
│  /apply/:jobId      OAuth polling        Webhook receiver       │
│       │                  │                      │               │
│       └──────────────────┴──────────────────────┘               │
│                          │                                      │
│              Universal Candidate Object                         │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                     INGESTION PIPELINE                          │
│                                                                 │
│  File → MinIO Storage                                           │
│  Job queued → BullMQ + Redis                                    │
│  Claude API → Structured JSON (parse)                           │
│  Embedding model → Vector stored in Qdrant                      │
│  Scoring engine → Composite score (0–100)                       │
│  PostgreSQL → Candidate record written                          │
│  Score ≥ cutoff → Notification queued                           │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                      OUTPUT LAYER                               │
│                                                                 │
│  Recruiter Dashboard (Next.js)   Email Notifications            │
│  ├─ Jobs + Shortlist             ├─ Instant alert               │
│  ├─ Resume Database              └─ Daily digest                │
│  ├─ Candidate Profile                                           │
│  ├─ Analytics                                                   │
│  └─ Integrations                                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), Tailwind CSS |
| Backend | Node.js, Express |
| AI — Parsing & Rationale | Claude API (`claude-sonnet-4-6`) |
| AI — Embeddings | `nomic-embed-text` (free) or OpenAI `text-embedding-3-small` |
| Vector Database | Qdrant |
| Job Queue | BullMQ + Redis |
| Primary Database | PostgreSQL 16 |
| File Storage | MinIO (self-hosted S3-compatible) |
| Email | Nodemailer + MJML |
| OAuth (Gmail, Outlook) | `arctic` |
| Containerisation | Docker Compose |

---

## Project Structure

```
recruitiq/
│
├── apps/
│   ├── web/                        # Next.js frontend
│   │   ├── app/
│   │   │   ├── (public)/           # Applicant-facing routes
│   │   │   │   ├── jobs/           # Job listings
│   │   │   │   └── apply/[jobId]/  # Application form
│   │   │   ├── recruiter/
│   │   │   │   ├── login/          # Recruiter auth
│   │   │   │   └── dashboard/      # Protected recruiter app
│   │   │   │       ├── jobs/
│   │   │   │       ├── database/
│   │   │   │       ├── analytics/
│   │   │   │       ├── integrations/
│   │   │   │       ├── notifications/
│   │   │   │       └── settings/
│   │   │   └── api/                # Next.js API routes (thin layer)
│   │   └── components/
│   │       ├── ui/                 # Base primitives (no component library)
│   │       ├── candidate/          # Profile panel, score bar
│   │       ├── jobs/               # Job cards, new job panel
│   │       └── layout/             # Sidebar, shell
│   │
│   └── api/                        # Express backend
│       ├── src/
│       │   ├── routes/
│       │   │   ├── auth.ts         # Login, session, logout
│       │   │   ├── jobs.ts         # Job CRUD
│       │   │   ├── candidates.ts   # Candidate actions
│       │   │   ├── connectors.ts   # Connector management
│       │   │   └── webhooks/       # ATS webhook receivers
│       │   │       ├── greenhouse.ts
│       │   │       └── lever.ts
│       │   ├── pipeline/
│       │   │   ├── ingest.ts       # Universal ingestion entry point
│       │   │   ├── parse.ts        # Claude API resume parsing
│       │   │   ├── embed.ts        # Embedding generation
│       │   │   └── score.ts        # Composite scoring engine
│       │   ├── connectors/
│       │   │   ├── interface.ts    # ConnectorInterface definition
│       │   │   ├── gmail.ts
│       │   │   ├── outlook.ts
│       │   │   ├── greenhouse.ts
│       │   │   └── lever.ts
│       │   ├── queue/
│       │   │   ├── workers.ts      # BullMQ workers
│       │   │   └── jobs.ts         # Job definitions
│       │   ├── notifications/
│       │   │   ├── email.ts        # Nodemailer sender
│       │   │   ├── templates/      # MJML templates
│       │   │   └── scheduler.ts    # Digest cron jobs
│       │   ├── db/
│       │   │   ├── client.ts       # PostgreSQL pool
│       │   │   ├── migrations/     # SQL migration files
│       │   │   └── queries/        # Typed query functions
│       │   ├── storage/
│       │   │   └── minio.ts        # MinIO client + signed URLs
│       │   └── middleware/
│       │       ├── auth.ts         # Session validation
│       │       └── rateLimit.ts
│       └── tests/
│
├── docker-compose.yml
├── docker-compose.dev.yml
└── .env.example
```

---

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 20+
- An Anthropic API key (for Claude)
- A Google Cloud project (for Gmail OAuth) — optional for MVP

### 1. Clone the repository

```bash
git clone https://github.com/your-username/recruitiq.git
cd recruitiq
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in all required values. See the [Environment Variables](#environment-variables) section below for the full list and what each value does.

### 3. Start all services

```bash
docker-compose up -d
```

This starts PostgreSQL, Redis, MinIO, and Qdrant. The first run pulls all images — allow a few minutes.

### 4. Run database migrations

```bash
cd apps/api
npm install
npm run migrate
```

### 5. Start the backend

```bash
# In apps/api/
npm run dev
```

Backend runs at `http://localhost:4000`.

### 6. Start the frontend

```bash
# In apps/web/
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`.

### 7. Create a recruiter account

The platform does not have public registration — recruiter accounts are provisioned manually via a seed script:

```bash
# In apps/api/
npm run seed:recruiter -- --email "recruiter@company.com" --password "yourpassword" --company "Acme Corp"
```

You can now log in at `http://localhost:3000/recruiter/login`.

---

## Environment Variables

Create a `.env` file at the root. All variables below are required unless marked optional.

```env
# ─── Backend ──────────────────────────────────────────────────
PORT=4000
NODE_ENV=development

# ─── Database ─────────────────────────────────────────────────
DATABASE_URL=postgresql://recruitiq:recruitiq@localhost:5432/recruitiq

# ─── Redis ────────────────────────────────────────────────────
REDIS_URL=redis://localhost:6379

# ─── MinIO (File Storage) ─────────────────────────────────────
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=recruitiq-resumes
MINIO_USE_SSL=false

# ─── Qdrant (Vector DB) ───────────────────────────────────────
QDRANT_URL=http://localhost:6333
QDRANT_COLLECTION=resumes

# ─── Claude API ───────────────────────────────────────────────
ANTHROPIC_API_KEY=sk-ant-...

# ─── Embeddings ───────────────────────────────────────────────
# Options: 'nomic' (free, local) or 'openai'
EMBEDDING_PROVIDER=nomic
OPENAI_API_KEY=sk-...                     # only needed if EMBEDDING_PROVIDER=openai

# ─── Auth ─────────────────────────────────────────────────────
SESSION_SECRET=a-long-random-string-min-32-chars
SESSION_MAX_AGE_MS=28800000               # 8 hours

# ─── Credential Encryption ────────────────────────────────────
# AES-256 key for encrypting OAuth tokens stored in DB
# Must be exactly 32 bytes (64 hex chars)
ENCRYPTION_KEY=your-64-char-hex-string-here

# ─── Email (Nodemailer) ───────────────────────────────────────
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@yourcompany.com
SMTP_PASS=your-app-password

# ─── App URL (used in email links) ────────────────────────────
APP_URL=http://localhost:3000

# ─── Gmail Connector (optional) ───────────────────────────────
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:4000/api/connectors/gmail/callback

# ─── Outlook Connector (optional) ─────────────────────────────
MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
MICROSOFT_REDIRECT_URI=http://localhost:4000/api/connectors/outlook/callback

# ─── Frontend ─────────────────────────────────────────────────
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## Running with Docker Compose (Full Stack)

A complete `docker-compose.yml` is included that runs every service:

```bash
# Start everything
docker-compose up -d

# View logs
docker-compose logs -f api
docker-compose logs -f web

# Stop everything
docker-compose down

# Stop and wipe all data volumes
docker-compose down -v
```

Services and their ports:

| Service | Port |
|---|---|
| Next.js frontend | `3000` |
| Express API | `4000` |
| PostgreSQL | `5432` |
| Redis | `6379` |
| MinIO (API) | `9000` |
| MinIO (Console) | `9001` |
| Qdrant | `6333` |

MinIO console available at `http://localhost:9001` (user: `minioadmin`, pass: `minioadmin`).

---

## API Reference

All API routes are prefixed with `/api`. Protected routes require a valid session cookie from `/api/auth/login`.

### Authentication

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Recruiter login. Body: `{ email, password }` |
| `POST` | `/api/auth/logout` | Invalidates session |
| `GET` | `/api/auth/me` | Returns current session user |

### Jobs

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/jobs` | List all jobs for the company |
| `POST` | `/api/jobs` | Create a new job posting |
| `GET` | `/api/jobs/:id` | Get a single job with stats |
| `PATCH` | `/api/jobs/:id` | Update job (title, weights, cutoff, status) |
| `DELETE` | `/api/jobs/:id` | Delete a job and all its candidates |
| `POST` | `/api/jobs/extract` | AI-extract requirements from a raw JD string |

### Candidates

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/candidates` | List all candidates (global DB, with filters) |
| `GET` | `/api/jobs/:jobId/candidates` | Candidates for a specific job |
| `GET` | `/api/candidates/:id` | Full candidate profile |
| `PATCH` | `/api/candidates/:id/status` | Update status: shortlisted / rejected / priority |
| `PATCH` | `/api/candidates/:id/outcome` | Mark hiring outcome: hired / interviewed / rejected_post |
| `GET` | `/api/candidates/:id/resume` | Generate signed URL for resume file download |

### Application Form (Public)

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/apply/:jobId` | Get public job info for the application form |
| `POST` | `/api/apply/:jobId` | Submit an application (multipart/form-data) |

### Connectors

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/connectors` | List all connectors for the company |
| `DELETE` | `/api/connectors/:id` | Disconnect and remove a connector |
| `POST` | `/api/connectors/:id/sync` | Manually trigger a poll for email connectors |
| `GET` | `/api/connectors/gmail/auth` | Start Gmail OAuth flow |
| `GET` | `/api/connectors/gmail/callback` | OAuth callback |
| `GET` | `/api/connectors/outlook/auth` | Start Outlook OAuth flow |
| `GET` | `/api/connectors/outlook/callback` | OAuth callback |

### Webhooks (Public, verified via HMAC)

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/webhooks/greenhouse` | Receive Greenhouse application webhook |
| `POST` | `/api/webhooks/lever` | Receive Lever application webhook |

### Notifications

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/notifications/settings` | Get notification settings |
| `PATCH` | `/api/notifications/settings` | Update notification settings |

### Analytics

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/analytics/:jobId` | Score distribution, source breakdown, processing stats |

---

## Scoring System

Each resume receives a composite score from 0–100 built from four dimensions:

| Dimension | Method | Default Weight |
|---|---|---|
| Skills match | Set intersection + semantic similarity | 40% |
| Experience match | Duration comparison + role relevance | 30% |
| Education match | Degree tier + field match (rule-based) | 20% |
| Semantic relevance | Cosine similarity (resume vs JD embedding) | 10% |

Weights are recruiter-configurable per job and must total 100%. Disqualifier rules run before scoring — a candidate matching any disqualifier receives score 0 and status `disqualified` without consuming API credits.

---

## Connecting ATS Platforms

### Greenhouse

1. Go to **Integrations** in the dashboard and click **Connect Greenhouse**.
2. Enter your Greenhouse API key.
3. Copy the displayed webhook URL: `https://yourdomain.com/api/webhooks/greenhouse`.
4. In Greenhouse, go to **Configure → Integrations → Web Hooks** and paste the URL. Select the `Application Created` and `Application Updated` events.
5. Copy the webhook secret from Greenhouse and paste it into the RecruitIQ connector settings.

Applications submitted on Greenhouse will now appear in RecruitIQ in real-time.

### Lever

1. Go to **Integrations** and click **Connect Lever**.
2. Enter your Lever API key.
3. Copy the webhook URL: `https://yourdomain.com/api/webhooks/lever`.
4. In Lever, go to **Settings → Integrations & API → Webhooks** and add the URL.
5. Paste the signing secret into RecruitIQ.

### Gmail

1. Go to **Integrations** and click **Connect Gmail**.
2. Complete the Google OAuth flow — RecruitIQ requests `gmail.readonly` scope only.
3. Select which job this inbox should feed into.
4. Emails with PDF or DOCX attachments sent to that inbox will be polled every 5–10 minutes and ingested automatically.

---

## Continuous Learning

After a hiring round, open the candidate profile and mark the final outcome (`Hired`, `Interviewed`, `Rejected after interview`). After enough feedback is collected, the system runs a weight optimisation step:

- It calculates which weight configuration would have ranked the hired candidates higher than they were actually ranked.
- Weights update incrementally per company — nudging the system toward patterns that produced good outcomes.
- All weight changes are logged in `scoring_weights_history` with a before/after snapshot.
- Recruiters can view and manually override weights at any time from the Job Settings tab.

This is not LLM fine-tuning — it is a lightweight Bayesian weight update that runs on your own server with no external dependencies.

---

## Deployment

### Minimum Server Requirements (Production)

| Resource | Minimum |
|---|---|
| CPU | 2 vCPUs |
| RAM | 4GB |
| Disk | 20GB (scales with resume volume) |
| OS | Ubuntu 22.04 LTS |

### Environment Setup

1. Install Docker and Docker Compose on your server.
2. Clone the repository.
3. Copy `.env.example` → `.env` and fill in production values.
4. Set `NODE_ENV=production` and `APP_URL=https://yourdomain.com`.
5. Use a strong random `SESSION_SECRET` and `ENCRYPTION_KEY`.
6. Point your domain to the server and configure a reverse proxy (Nginx recommended) to forward port 80/443 to the Next.js frontend on 3000.

```bash
docker-compose -f docker-compose.yml up -d
```

### TLS / HTTPS

Use Certbot with Nginx:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## Development Notes

### Adding a New Connector

1. Create `/apps/api/src/connectors/your-connector.ts`.
2. Implement the `ConnectorInterface`:
   - `connect(credentials)` — store encrypted token
   - `poll()` — fetch new resumes (email connectors)
   - `receive(payload)` — handle webhook (ATS connectors)
   - `normalize(rawData)` — return a `IngestedCandidate` object
3. Register the connector type in `/apps/api/src/connectors/registry.ts`.
4. Add a UI card in the Integrations dashboard view.

Nothing else changes downstream. The ingestion pipeline only ever consumes the normalised `IngestedCandidate` object.

### Running Tests

```bash
# Backend
cd apps/api && npm test

# Frontend
cd apps/web && npm test
```

### Linting

```bash
npm run lint        # in either app
npm run lint:fix    # auto-fix
```

---

## Roadmap

- [x] Platform application form (Option 1)
- [x] Gmail connector
- [x] Greenhouse webhook connector
- [x] Lever webhook connector
- [ ] Outlook connector
- [ ] BambooHR connector
- [ ] Workday connector
- [ ] Job board integration (LinkedIn, Indeed) — requires partnership
- [ ] Multi-language resume support
- [ ] Candidate-facing status tracking portal
- [ ] Team roles and permissions (admin / viewer)
- [ ] Bulk candidate messaging

---

## License

MIT License. See `LICENSE` for details.

---

## Author

Built by **Spectra** — Mechanical Engineering student at Dr. D.Y. Patil Institute of Technology, Pune, transitioning into software engineering and AI systems.

Portfolio · GitHub · LinkedIn
