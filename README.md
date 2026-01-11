# EAwiz Platform

AI-powered tools and community for Executive Assistants.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth + Database)
- Stripe (Subscriptions)
- Resend (Transactional Email)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_APP_URL` - Your app URL (http://localhost:3000 for dev)
- `NEXT_PUBLIC_SITE_URL` - Site URL for Stripe redirects (same as APP_URL)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `STRIPE_SECRET_KEY` - Stripe secret key (server-only)
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY` - Stripe price ID for $40/month subscription
- `NEXT_PUBLIC_STRIPE_PRICE_ID_ANNUAL` - Stripe price ID for $400/year subscription
- `NEXT_PUBLIC_STRIPE_PRICE_ID_COURTNEY` - Stripe price ID for Courtney's coaching
- `NEXT_PUBLIC_STRIPE_PRICE_ID_MOLLY` - Stripe price ID for Molly's coaching
- `RESEND_API_KEY` - Resend API key
- `FROM_EMAIL` - Sender email address
- `ADMIN_EMAIL` - Admin notification email

### 3. Database Setup

Run the schema and seed files in your Supabase SQL editor:

1. Run `supabase/schema.sql` to create tables
2. Run `supabase/seed.sql` to populate prompt categories and prompts

### 4. Stripe Setup

1. Create a product in Stripe with two prices: $40/month and $400/year
2. Copy the Price IDs to `NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY` and `NEXT_PUBLIC_STRIPE_PRICE_ID_ANNUAL`
3. Set up a webhook endpoint pointing to `/api/stripe/webhook`
4. Configure webhook to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`

### 5. Supabase Auth Setup

1. Enable Email auth provider in Supabase
2. Configure Magic Link settings
3. Set redirect URL to `{YOUR_APP_URL}/auth/callback`

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- **Public Pages**: Home, About, Tools, Events, Coaching, Speaking
- **Auth**: Magic link authentication via Supabase
- **Membership**: $40/month or $400/year subscription via Stripe
- **Prompt Library**: 380+ prompts across 19 categories (members only)
- **The EAwiz Lounge**: Community forum for members
- **1:1 Coaching**: Private coaching sessions with Stripe checkout
- **Speaking Form**: Inquiry form with admin notifications

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/          # Auth endpoints
│   │   ├── speaking/      # Speaking form submission
│   │   ├── stripe/        # Stripe webhooks & checkout
│   │   └── prompts/       # Prompt tracking
│   ├── about/             # About page
│   ├── account/           # User account
│   ├── auth/              # Auth callback
│   ├── coaching/          # 1:1 coaching with Stripe checkout
│   ├── events/            # Events listing
│   ├── join/              # Checkout flow
│   ├── login/             # Magic link login
│   ├── lounge/            # Community forum
│   ├── prompts/           # Prompt library
│   ├── speaking/          # Speaking inquiry form
│   └── tools/             # Tools directory
├── components/            # React components
│   ├── layout/           # Navbar, Footer
│   └── ui/               # Reusable UI components
├── lib/                   # Utilities & API clients
│   ├── resend.ts         # Email functions
│   ├── stripe.ts         # Stripe functions
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # Helper functions
└── types/                 # TypeScript types
    └── database.ts       # Supabase types

supabase/
├── schema.sql            # Database schema & RLS
└── seed.sql              # Seed data (prompts, categories)
```

## External Links

- EAwiz GPT: https://chatgpt.com/g/g-67c94fd1f9a08191bb21bfb7ef790a02-eawiz-the-ultimate-ai-toolkit-for-assistants
- Calendar Audit: https://calaudit.streamlit.app/

## Admin

Admin notifications for speaking inquiries are sent to: vegascj@gmail.com
