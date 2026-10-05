# ANTI PICKS — Premium Affiliate Product Discovery Platform

> **"DISCOVER WHAT'S WORTH BUYING."**  
> Curated products, honest ratings, and smart picks. Pure editorial discernment with zero sponsored noise.

---

## 1. Architecture & Overview

ANTI PICKS is a full-stack, high-performance affiliate product discovery platform built with:
- **Frontend**: React (v19), Vite, Tailwind CSS (v4), Framer Motion, Lucide React, React Router (v7).
- **Backend**: Node.js, Express, Helmet, CORS, Morgan, Express Rate Limit.
- **Database & Auth**: PostgreSQL, Supabase Auth, Row Level Security (RLS) migrations.
- **Tracking Engine**: Deduplicated product views (cryptographic IP hash) and safe affiliate click redirects (`/go/:slug` and `/api/products/:id/click`).
- **Admin Control Room**: Standalone protected administration suite with real database analytics, product CRUD, multi-image gallery manager, category taxonomy, rating moderation, and global site settings.

---

## 2. Directory Structure

```
anti-picks/
│
├── client/                     # Vite React Frontend
│   ├── src/
│   │   ├── animations/         # Framer motion presets
│   │   ├── components/         # Navbar, Hero, ProductCard, Gallery, Skeletons, Modals
│   │   ├── context/            # ToastContext & AuthContext
│   │   ├── layouts/            # MainLayout & AdminLayout
│   │   ├── lib/                # API client & Frontend Supabase config
│   │   ├── pages/              # Home, ProductDetail, About, Contact, Legal, Admin
│   │   ├── utils/              # Formatters & Helpers
│   │   ├── index.css           # Tailwind v4 theme & typography
│   │   └── main.jsx
│   └── package.json
│
├── server/                     # Express Node.js Backend API
│   ├── config/                 # Env validation & Supabase service
│   ├── controllers/            # Products, Categories, Admin & Redirects
│   ├── middleware/             # Supabase Auth guard & Rate Limiters
│   ├── routes/                 # Express API routes & /go redirects
│   ├── services/               # Unified database layer (Supabase / In-Memory Seed)
│   ├── server.js               # Main Express entry & static server
│   └── package.json
│
├── supabase/
│   ├── migrations/             # 20261005_init.sql (PostgreSQL tables, indexes, RLS, triggers)
│   └── seed/                   # seed.sql (Curated products, multi-angle images, reviews)
│
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules (secrets protected)
├── README.md                   # This documentation
└── package.json                # Root concurrent scripts
```

---

## 3. Quick Start / Local Development

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Step 1: Install Dependencies
From the repository root:
```bash
npm run install:all
```
*(or run `npm install` in the root, `/client`, and `/server`)*

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(Note: If you do not yet have a Supabase project created, the app will run immediately using the built-in high-fidelity local database layer pre-populated with all curated tech and lifestyle seed data!)*

### Step 3: Run the Application
Run both the Express backend and the Vite client concurrently:
```bash
npm run dev
```

- **Frontend Application**: [http://localhost:5173](http://localhost:5173)
- **Backend API Server**: [http://localhost:5000](http://localhost:5000)
- **Admin Control Room**: [http://localhost:5173/admin](http://localhost:5173/admin)

---

## 4. Admin Credentials & Access

To access the admin panel:
1. Navigate to [http://localhost:5173/admin](http://localhost:5173/admin) (or click **Admin** in the header / footer).
2. Default administrator login:
   - **Email**: `admin@antipicks.com`
   - **Password**: `admin123` *(or your configured `ADMIN_SECRET`)*
3. In production with a connected Supabase project, create an admin user in Supabase Auth and assign the `role = 'admin'` profile.

---

## 5. Connecting Remote Supabase Database

When you are ready to connect to your live Supabase project:

1. Create a project at [https://supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Run the migration script in:
   `supabase/migrations/20261005_init.sql`
4. Run the seed data script in:
   `supabase/seed/seed.sql`
5. Retrieve your project URL and keys from **Project Settings → API**:
   - `Project URL` → `SUPABASE_URL` and `VITE_SUPABASE_URL`
   - `anon public` key → `SUPABASE_ANON_KEY` and `VITE_SUPABASE_ANON_KEY`
   - `service_role secret` key → `SUPABASE_SERVICE_ROLE_KEY`
6. Paste them into your `.env` file and restart the server.

> **Security Rule**: The `SUPABASE_SERVICE_ROLE_KEY` and `ADMIN_SECRET` are used **strictly on the server** and are never exposed to the frontend bundle or Git history.

---

## 6. Key Features Implemented

| Feature | Description |
|---|---|
| **White + Black Visual Identity** | Minimalist aesthetic with Space Grotesk display headings, Plus Jakarta Sans body, and subtle micro-animations. |
| **Cinematic Initial Loader** | Short brand reveal (300ms–900ms) with animated typography. |
| **Live Dynamic Search** | Debounced search with loading spinners, keywords, categories, and `⌘K` keyboard shortcut. |
| **Category Navigation** | Dynamic horizontal scrollable pills with active states. |
| **Multi-Image Product Gallery** | Ecommerce desktop view with thumbnails + mobile swipeable carousel + fullscreen lightbox modal. |
| **Deduplicated View Tracking** | SHA-256 IP-hash deduplication with 15-minute sliding window to prevent refresh inflation. |
| **Affiliate Redirect Engine** | Server-side click tracking via `/api/products/:id/click` and direct `/go/:slug` with safe URL validation. |
| **Share Sheet & Web Share** | Native mobile Web Share API with fallbacks to WhatsApp, Telegram, X, Facebook, and Copy Link with toast. |
| **Full Admin Control Room** | Real-time analytics, product CRUD, image gallery manager, taxonomy management, ratings moderation, and site settings. |
| **SEO & Sitemap** | Dynamic OpenGraph tags, canonical URLs, auto-generated `/sitemap.xml`, and `/robots.txt`. |

---

## 7. Production Build & Deployment

Build the optimized client bundle:
```bash
npm run build
```

Start the production server (which serves the API and the pre-built client static assets):
```bash
npm start
```

---

## 8. License & Editorial Rights

© 2026 ANTI PICKS. All rights reserved.
