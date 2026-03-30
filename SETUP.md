# STRATIQ – Complete Setup Guide
**Decide With Precision.**

This guide walks you through every step required to deploy the STRATIQ Decision Intelligence Platform from scratch — including Next.js, Supabase, Stripe, and SendGrid setup.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Project Installation](#2-project-installation)
3. [Supabase Setup (Auth + Database)](#3-supabase-setup)
4. [Database Schema Deployment](#4-database-schema-deployment)
5. [Stripe Setup (Billing)](#5-stripe-setup)
6. [SendGrid Setup (Email)](#6-sendgrid-setup)
7. [Environment Variables](#7-environment-variables)
8. [Run the Development Server](#8-run-locally)
9. [Deploy to Production (Vercel)](#9-deploy-to-production)
10. [Post-Deployment Checklist](#10-post-deployment-checklist)
11. [Feature Flags & Customisation](#11-feature-flags--customisation)
12. [Architecture Overview](#12-architecture-overview)

---

## 1. Prerequisites

Make sure you have the following installed:

```bash
node --version   # v18.17.0 or higher (v20 LTS recommended)
npm --version    # v9 or higher
git --version    # Any recent version
```

You will also need accounts with:
- [Supabase](https://supabase.com) — free tier is fine to start
- [Stripe](https://stripe.com) — free test account
- [SendGrid](https://sendgrid.com) — free tier (100 emails/day)
- [Vercel](https://vercel.com) — for production deployment (optional)

---

## 2. Project Installation

### 2a. Clone or Extract the Project

If you received a zip:
```bash
unzip stratiq.zip -d stratiq
cd stratiq
```

If using git:
```bash
git clone https://github.com/your-org/stratiq.git
cd stratiq
```

### 2b. Install Dependencies

```bash
npm install
```

This installs all dependencies including Next.js 14, Supabase SDK, Stripe, Framer Motion, Recharts, and more.

### 2c. Copy Environment Variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in each value as instructed in section 7.

---

## 3. Supabase Setup

### 3a. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and log in
2. Click **"New Project"**
3. Set:
   - **Project Name**: `stratiq` (or your preferred name)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click **"Create new project"** — wait ~2 minutes for provisioning

### 3b. Get Your API Keys

1. In your Supabase project, go to **Settings → API**
2. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` key → `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client/browser.**

### 3c. Configure Authentication

1. Go to **Authentication → Providers**
2. Ensure **Email** provider is enabled (it is by default)
3. Under **Email → Confirm email**: Enable "Confirm email" for production security

**Optional: Google OAuth**
1. In Supabase: **Authentication → Providers → Google** → Enable
2. Go to [Google Cloud Console](https://console.cloud.google.com)
3. Create a project → **APIs & Services → Credentials**
4. Create **OAuth 2.0 Client ID** (Web application type)
5. Add Authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`
   - `https://yourdomain.com/auth/callback`
6. Paste Client ID and Client Secret into Supabase Google provider settings

### 3d. Configure Auth Email Templates (Optional)

1. Go to **Authentication → Email Templates**
2. Customise **Confirm signup**, **Reset password** templates to match STRATIQ branding
3. Recommended: Set the `Redirect To` URL in template to `https://yourdomain.com/auth/callback`

### 3e. Set Auth Settings

1. Go to **Authentication → URL Configuration**
2. Set **Site URL** to your production domain: `https://yourdomain.com`
3. Add **Redirect URLs**:
   - `https://yourdomain.com/auth/callback`
   - `http://localhost:3000/auth/callback` (for development)

---

## 4. Database Schema Deployment

### 4a. Run the Migration

1. In your Supabase project, go to **SQL Editor**
2. Click **"New Query"**
3. Open the file: `supabase/migrations/001_initial_schema.sql`
4. Copy the entire contents and paste into the SQL editor
5. Click **"Run"** (Ctrl+Enter)

You should see: `Success. No rows returned`

### 4b. Verify Tables Were Created

1. Go to **Table Editor** in Supabase
2. Confirm these tables exist:
   - `users`
   - `subscriptions`
   - `decisions`
   - `decision_options`
   - `variables`
   - `variable_scores`
   - `simulation_results`
   - `reports`
   - `teams`
   - `team_members`

### 4c. Verify RLS Is Enabled

1. Click each table → go to **Policies** tab
2. Confirm "RLS enabled" and policies are listed

### 4d. Create Storage Bucket for Reports

1. Go to **Storage** in Supabase
2. Click **"New bucket"**
3. Name it: `reports`
4. Set to **Private** (not public)
5. Click **"Create bucket"**
6. Go to **Policies** → Add policy:
   - Template: "Give users access to only their own folder"
   - Modify to use `user_id` path prefix

---

## 5. Flutterwave Setup

### 5a. Create a Flutterwave Account

1. Go to [flutterwave.com](https://flutterwave.com) and sign up for a dashboard account.
2. Complete the merchant onboarding process to accept live payments.

### 5b. Get API Keys

1. In your Flutterwave Dashboard, go to **Settings → API Keys**.
2. Copy:
   - **Public Key** → `NEXT_PUBLIC_FLW_PUBLIC_KEY`
   - **Secret Key** → `FLW_SECRET_KEY`
   - **Encryption Key** → `FLW_ENCRYPTION_KEY`

For development, use the **Test mode** keys (prefixed with `FLWPUBK_TEST-` and `FLWSECK_TEST-`).

### 5c. Create Payment Plans

In the Flutterwave Dashboard, go to **Payments → Plans**:

**Professional Plan**
- Create a plan for the "Professional" tier.
- Set the frequency (Monthly or Annual).
- Copy the **Plan ID** and add it to your `.env.local`:
  - `FLW_PRO_MONTHLY_PLAN_ID`
  - `FLW_PRO_ANNUAL_PLAN_ID`

Repeat for the **Enterprise** plan if applicable.

### 5d. Set Up Flutterwave Webhooks

1. Go to **Settings → Webhooks**.
2. Endpoint URL: `https://yourdomain.com/api/flutterwave/webhook`.
3. Secret Hash: Create a unique string (e.g., a UUID) and add it to `FLW_SECRET_HASH` in your `.env.local`.
4. Enter the same Secret Hash in the Flutterwave Dashboard.
5. Flutterwave will send a `verif-hash` header with every webhook for verification.

---

---

## 6. SendGrid Setup

### 6a. Create a SendGrid Account

1. Go to [sendgrid.com](https://sendgrid.com) and sign up
2. Free tier: 100 emails/day (sufficient for most startups)

### 6b. Create an API Key

1. Go to **Settings → API Keys → Create API Key**
2. Name: `STRATIQ Production`
3. Permissions: **Restricted Access**
   - Mail Send: **Full Access**
4. Click **Create & View**
5. Copy the key → `SENDGRID_API_KEY`

⚠️ You'll only see the key once. Save it immediately.

### 6c. Verify Your Sender Domain (Critical for Deliverability)

1. Go to **Settings → Sender Authentication**
2. Click **"Authenticate Your Domain"**
3. Enter your domain (e.g., `stratiq.io`)
4. Follow the DNS record instructions provided
5. Verify DNS propagation (can take up to 24 hours)

### 6d. Set Environment Variables

```env
SENDGRID_API_KEY=SG.your_key_here
SENDGRID_FROM_EMAIL=hello@stratiq.io
SENDGRID_FROM_NAME=STRATIQ
```

---

## 7. Environment Variables

Fill in `.env.local` with all collected values:

```env
# ── Supabase ──────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://abc123.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# ── Flutterwave ───────────────────────────────────────────
NEXT_PUBLIC_FLW_PUBLIC_KEY=FLWPUBK_TEST-...
FLW_SECRET_KEY=FLWSECK_TEST-...
FLW_ENCRYPTION_KEY=FLW_ENCRYPTION_KEY_...
FLW_SECRET_HASH=your_webhook_secret_hash

FLW_PRO_MONTHLY_PLAN_ID=...
FLW_PRO_ANNUAL_PLAN_ID=...
FLW_ENTERPRISE_MONTHLY_PLAN_ID=...
FLW_ENTERPRISE_ANNUAL_PLAN_ID=...

# ── SendGrid ──────────────────────────────────────────────
SENDGRID_API_KEY=SG.your_key
SENDGRID_FROM_EMAIL=hello@stratiq.io
SENDGRID_FROM_NAME=STRATIQ

# ── Application ───────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=STRATIQ
```

---

## 8. Run Locally

### 8a. Start the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 8b. Start Stripe Webhook Listener (separate terminal)

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### 8c. Test the Full Flow

1. Go to `http://localhost:3000`
2. Click **Get Started** → Sign up with email
3. Verify email (check inbox or Supabase Auth logs)
4. Log in → Land on Dashboard
5. Create a new Decision
6. Score options
7. Run a Simulation
8. View results

---

## 9. Deploy to Production (Vercel)

### 9a. Push to GitHub

```bash
git init
git add .
git commit -m "Initial STRATIQ deployment"
git remote add origin https://github.com/your-org/stratiq.git
git push -u origin main
```

### 9b. Deploy with Vercel

1. Go to [vercel.com](https://vercel.com) and log in
2. Click **"New Project"** → Import from GitHub
3. Select your `stratiq` repository
4. Framework: **Next.js** (auto-detected)
5. Root directory: `/`

### 9c. Add Environment Variables in Vercel

1. In Vercel project → **Settings → Environment Variables**
2. Add ALL variables from `.env.local`
3. Change `NEXT_PUBLIC_APP_URL` to your production domain: `https://stratiq.io`
4. Change all Stripe keys from `test` to `live` prefixes
5. Click **Deploy**

### 9d. Set Up Custom Domain

1. Vercel → **Settings → Domains**
2. Add your domain (e.g., `stratiq.io`)
3. Update your DNS registrar with the provided CNAME/A records
4. SSL is provisioned automatically

### 9e. Update Supabase for Production

1. Supabase → **Authentication → URL Configuration**
2. Update **Site URL** to your production domain
3. Add production domain to **Redirect URLs**

---

## 10. Post-Deployment Checklist

Run through these after deployment:

### Authentication
- [ ] Email signup works end-to-end
- [ ] Email confirmation arrives (check spam)
- [ ] Login redirects to Dashboard
- [ ] Google OAuth works (if enabled)
- [ ] Password reset flow works

### Database
- [ ] New user creates entry in `users` table
- [ ] Starter subscription auto-created on signup
- [ ] Creating a decision inserts into all relevant tables
- [ ] RLS prevents cross-user data access

### Stripe
- [ ] Stripe Checkout opens from Pricing page
- [ ] Test payment succeeds (use card `4242 4242 4242 4242`)
- [ ] Subscription is created in `subscriptions` table after payment
- [ ] Webhook events appear in Stripe Dashboard logs
- [ ] Billing portal opens from Account page

### Email
- [ ] Welcome email arrives on signup
- [ ] Subscription confirmation email arrives after payment
- [ ] Password reset email arrives

### Simulation Engine
- [ ] Create decision with options and variables
- [ ] Score options (0–10)
- [ ] Run simulation via `/api/simulate`
- [ ] Results are saved to `simulation_results`
- [ ] Results display correctly in Decision Detail

### Security
- [ ] Accessing `/dashboard` while logged out redirects to `/auth/login`
- [ ] API routes return 401 for unauthenticated requests
- [ ] Stripe webhook returns 400 for invalid signatures

---

## 11. Feature Flags & Customisation

### Changing Brand Colours

Edit `tailwind.config.ts`:
```ts
stratiq: {
  blue: '#3B82F6',    // Change to your primary accent
  teal: '#0EA5A4',    // Change to your secondary accent
}
```

### Changing Pricing

Edit `lib/stripe/index.ts` — update `STRIPE_PRICES` and `PLAN_LIMITS`.
Update the pricing UI in `app/pricing/page.tsx`.

### Adding New Variable Types

In `types/index.ts`:
```ts
export type VariableType = 
  'financial' | 'risk' | 'time' | 'strategic' | 'operational' | 'custom' | 'your_new_type'
```

Update the VARIABLE_TYPES array in `app/decisions/new/page.tsx`.

### Modifying the Simulation Algorithm

The simulation engine is in `lib/simulation/engine.ts`. It is intentionally transparent and straightforward. Key functions:

- `calculateOptionScore()` — weighted score per option
- `calculateRiskScore()` — risk classification
- `calculateExpectedValue()` — EV with risk discount
- `calculateConfidenceBand()` — uncertainty range

### Adding New Email Templates

In `lib/sendgrid/index.ts`, add a new function:
```ts
export async function sendYourEmail(to: string, ...) {
  const content = `...`
  await sgMail.send({ to, from: FROM, subject: '...', html: baseTemplate(content) })
}
```

---

## 12. Architecture Overview

```
stratiq/
├── app/                         # Next.js App Router
│   ├── page.tsx                 # Marketing homepage
│   ├── pricing/page.tsx         # Pricing page
│   ├── product/page.tsx         # Product overview
│   ├── security/page.tsx        # Security page
│   ├── contact/page.tsx         # Contact form
│   ├── auth/
│   │   ├── login/page.tsx       # Login page
│   │   ├── signup/page.tsx      # Signup page
│   │   └── callback/route.ts    # OAuth callback
│   ├── dashboard/
│   │   ├── layout.tsx           # Dashboard shell with sidebar
│   │   └── page.tsx             # Dashboard overview
│   ├── decisions/
│   │   ├── page.tsx             # Decisions list
│   │   ├── new/page.tsx         # Decision builder
│   │   └── [id]/page.tsx        # Decision detail + scoring
│   ├── simulate/page.tsx        # Simulation runner
│   ├── reports/page.tsx         # Reports list
│   ├── account/page.tsx         # Account + billing
│   └── api/
│       ├── simulate/route.ts    # Simulation API
│       ├── stripe/
│       │   ├── checkout/route.ts # Create checkout session
│       │   └── webhook/route.ts  # Stripe webhook handler
│
├── components/
│   ├── marketing/               # Public site components
│   │   ├── MarketingNav.tsx
│   │   └── MarketingFooter.tsx
│   └── dashboard/               # App components
│       ├── Sidebar.tsx
│       ├── TopBar.tsx
│       ├── DashboardContent.tsx
│       ├── DecisionDetailContent.tsx
│       └── AccountContent.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts            # Browser Supabase client
│   │   ├── server.ts            # Server Supabase client
│   │   └── middleware.ts        # Auth middleware
│   ├── stripe/
│   │   └── index.ts             # Stripe client + helpers
│   ├── sendgrid/
│   │   └── index.ts             # Email templates + sender
│   └── simulation/
│       └── engine.ts            # Core simulation algorithm
│
├── types/
│   └── index.ts                 # All TypeScript types
│
├── utils/
│   └── index.ts                 # Utilities + formatters
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Complete DB schema + RLS
│
├── middleware.ts                # Next.js auth middleware
├── tailwind.config.ts           # Design system
└── .env.example                 # Environment template
```

### Data Flow

```
User Action
    ↓
Next.js Client Component
    ↓
Supabase Client (browser) / API Route (server)
    ↓
Supabase PostgreSQL (with RLS enforced)
    ↓
Simulation Engine (server-side, lib/simulation/engine.ts)
    ↓
Results saved to simulation_results table
    ↓
Client receives results + renders charts
```

### Authentication Flow

```
User signs up → Supabase creates auth.users entry
    → trigger: handle_new_user() creates users row
    → trigger: handle_new_subscription() creates starter subscription
    → User receives confirmation email
    → User confirms → session created
    → Middleware validates session on every protected route
```

---

## Support

For questions about this codebase, refer to:

- **Supabase docs**: https://supabase.com/docs
- **Next.js docs**: https://nextjs.org/docs
- **Stripe docs**: https://stripe.com/docs
- **SendGrid docs**: https://docs.sendgrid.com
- **Framer Motion**: https://www.framer.com/motion
- **Recharts**: https://recharts.org

---

*STRATIQ – Decide With Precision.*
