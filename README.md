# CivilCalc Pro

AI-powered civil engineering platform for the Indian construction industry — RCC design calculators (IS 456:2000), estimation tools, IS code library, and an AI engineering assistant powered by Claude.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Database:** MongoDB (Atlas-ready)
- **Auth:** JWT + bcrypt
- **AI:** Emergent Universal LLM Key → Claude Sonnet 4 (with mock fallback)
- **PDF:** jsPDF + jspdf-autotable

## Features

- 14+ engineering calculators (RCC Beam / Column / One-Way & Two-Way Slab / Footing / Concrete Mix / Steel Weight / Brickwork / Plaster / Excavation / Rate Analysis / Unit Converter)
- AI Engineering Assistant (RCC design help, IS code explanations, quantity estimation)
- Searchable IS Code Library (IS 456 / IS 875 / IS 1893 / IS 13920)
- Branded PDF report generation for every calculation
- Admin panel with user & subscription management
- 100 % free — no paywalls, no premium tiers

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/<your-username>/civilcalc-pro.git
cd civilcalc-pro
yarn install
```

### 2. Configure environment

```bash
cp .env.example .env.local
# Edit .env.local — fill MONGO_URL, JWT_SECRET, EMERGENT_LLM_KEY (optional)
```

### 3. Run development server

```bash
yarn dev
# App on http://localhost:3000
```

### 4. Production build

```bash
yarn build
yarn start
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com), **Import Project**, select the repo.
3. Framework will auto-detect as **Next.js**.
4. Set these **Environment Variables** in Vercel:
   - `MONGO_URL` — MongoDB Atlas connection string (whitelist `0.0.0.0/0` in Atlas Network Access for Vercel)
   - `DB_NAME` — e.g. `civilcalc_pro`
   - `JWT_SECRET` — `openssl rand -hex 32`
   - `EMERGENT_LLM_KEY` (optional) — for real Claude responses
   - `ADMIN_EMAILS` — comma-separated emails for admin access
   - `NEXT_PUBLIC_BASE_URL` — your Vercel URL
5. Click **Deploy**.
6. After first deploy, sign up with an email listed in `ADMIN_EMAILS` to get admin access.

## Admin Access

The first user that signs up with an email in `ADMIN_EMAILS` is auto-granted `role: 'admin'` and can access `/dashboard/admin`.

## API Routes

All backend routes are served by the catch-all `app/api/[[...path]]/route.js`:

- `POST /api/auth/signup` · `POST /api/auth/login` · `GET /api/auth/me`
- `POST /api/calculate/beam` · `POST /api/calculate/column` · `POST /api/calculate/slab` · `POST /api/calculate/two-way-slab` · `POST /api/calculate/footing` · `POST /api/calculate/concrete-volume` · `POST /api/calculate/steel-weight` · `POST /api/calculate/brickwork` · `POST /api/calculate/excavation` · `POST /api/calculate/plaster` · `POST /api/calculate/rate-analysis`
- `POST /api/ai/chat` · `GET /api/ai/sessions` · `GET /api/ai/sessions/{id}` · `DELETE /api/ai/sessions/{id}`
- `GET /api/admin/stats` · `GET /api/admin/users` · `POST /api/admin/users/{id}/plan`

## License

Proprietary. Not for redistribution.
