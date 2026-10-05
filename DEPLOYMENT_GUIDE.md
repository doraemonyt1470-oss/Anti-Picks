# ANTI PICKS — Production Deployment & Hosting Guide

Welcome to the **ANTI PICKS** production distribution. This document provides step-by-step instructions to configure, host, and run the platform on your server or **cPanel Hosting**.

---

## 📁 Project Architecture

```
anti-picks/
├── client/                 # React 19 Frontend (Vite + Tailwind CSS + Framer Motion)
│   ├── dist/               # Pre-compiled, production-ready static assets & .htaccess
│   ├── src/                # Complete frontend React source code
│   └── package.json
├── server/                 # Express.js REST API & Tracking Engine
│   ├── config/             # Environment & Supabase configurations
│   ├── controllers/        # Product, category, analytics & admin controllers
│   ├── middleware/         # Security headers (Helmet), Rate Limiting & Auth
│   ├── routes/             # Clean REST API endpoints & affiliate /go redirects
│   ├── services/           # Scraper engine & robust local database layer
│   ├── server.js           # Production server entrypoint (serves API & Client)
│   └── package.json
├── supabase/               # Database Schemas & Migrations
│   ├── migrations/         # PostgreSQL schema & tables
│   └── seed/               # Initial seed data
├── .env.example            # Master environment variables template
├── package.json            # Monorepo management scripts
└── DEPLOYMENT_GUIDE.md     # This comprehensive guide
```

---

## 🔒 Administrative Control Room

* **Secret Admin URL:** `https://yourdomain.com/adashishmin`
* **Default Notice:** For enterprise security, standard `/admin` is disabled and returns a standard `404 Not Found`. Access the console exclusively via `/adashishmin`.
* **Database & Key Security:** All database calls proxy through the secure `/api` backend. The client browser never receives database service role keys or direct database connection strings.

---

## ⚙️ Step 1: Environment Configuration

1. In the root directory (or inside `server/`), copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and configure your settings:
   ```env
   # Server Port (cPanel will assign automatically or use 5000)
   PORT=5000
   NODE_ENV=production
   CLIENT_URL=https://yourdomain.com

   # Strong 32+ character admin secret key
   ADMIN_SECRET=your_super_strong_secret_key_here_2026

   # Supabase Credentials (optional if using live Supabase)
   # If left empty, server runs automatically on local high-performance database
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

   # Public API endpoint (frontend uses relative /api or your domain)
   VITE_API_URL=https://yourdomain.com
   ```

> **Note:** If you do not have Supabase configured immediately, the server seamlessly runs on its built-in local database layer out-of-the-box.

---

## 🚀 Step 2: Hosting on cPanel (Recommended Method)

cPanel provides a built-in **"Setup Node.js App"** tool powered by CloudLinux / Phusion Passenger.

### Option A: All-in-One Node.js Deployment (Easiest & Best)

In this setup, Node.js serves both the API (`/api/*`, `/go/*`) and the React frontend on your primary domain.

1. **Upload Files:**
   * In cPanel **File Manager**, create a folder (e.g., `/home/username/antipicks_app`).
   * Upload the source zip and extract it into this folder.
2. **Open cPanel "Setup Node.js App":**
   * Click **Create Application**.
   * **Node.js Version:** Select **18.x, 20.x, or 22.x**.
   * **Application Mode:** Select **Production**.
   * **Application Root:** Enter `antipicks_app/server` (or the folder where `server.js` resides).
   * **Application URL:** Choose your domain or subdomain (e.g., `yourdomain.com`).
   * **Application Startup File:** Enter `server.js`.
3. **Install Dependencies:**
   * In the cPanel Node.js interface, click **Run NPM Install** (or enter the virtual environment via SSH/Terminal and run `npm install`).
4. **Build Frontend (Pre-built included):**
   * The `client/dist/` folder is already pre-built in this package!
   * The server automatically discovers `client/dist` and serves it directly.
5. **Start Application:**
   * Click **Restart Application** in cPanel.
   * Open your domain in the browser.

---

### Option B: Static Frontend (`public_html`) + Node.js API Subdomain

If your hosting plan prefers traditional Apache static hosting for frontend:

1. **Frontend (Static):**
   * Copy all contents of `client/dist/` directly into your cPanel `public_html/` folder.
   * Ensure `public_html/.htaccess` is present (included in `client/dist/.htaccess`) to support client-side routing.
2. **Backend API (Node.js):**
   * Setup a Node.js app in cPanel pointing to `server/server.js` on a subdomain (e.g., `api.yourdomain.com`).
   * In `client/.env`, set `VITE_API_URL=https://api.yourdomain.com` and rebuild (`npm run build`).

---

## 💻 Step 3: Running Locally or on a VPS (Ubuntu / Debian)

1. **Install dependencies:**
   ```bash
   npm run install:all
   ```
2. **Build frontend assets:**
   ```bash
   npm run build
   ```
3. **Start production server:**
   ```bash
   npm start
   ```
4. **Process Manager (PM2 for 24/7 uptime on VPS):**
   ```bash
   npm install -g pm2
   pm2 start server/server.js --name "antipicks"
   pm2 save
   pm2 startup
   ```

---

## 🗄️ Step 4: Supabase Database Setup (Optional)

To connect your own remote Supabase database:
1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase dashboard.
3. Open and run the SQL migration files provided in:
   * `supabase/migrations/`
4. Copy your project URL, Anon Key, and Service Role Key from **Project Settings → API** into your `.env` file.
5. Restart your Node.js application.

---

## 🛡️ Security Best Practices Included

* **Helmet & CORS:** Preconfigured headers protect against clickjacking and cross-site scripting.
* **Rate Limiting:** Protects API and scraper endpoints against DDoS and brute-force attacks.
* **Obfuscated Admin Route:** Admin interface hidden behind `/adashishmin` with 404 disguise on `/admin`.
* **Zero Client Leakage:** No database credentials or secret service tokens exist in the client JavaScript bundle.
