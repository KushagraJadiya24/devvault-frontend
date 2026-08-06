# 🔐 DevVault Frontend

> The official Next.js dashboard for [DevVault](https://github.com/KushagraJadiya24/devvault-backend) — an open-source self-hosted secrets manager for engineering teams.

## 🌐 Live Demo
**Frontend:** https://devvault-frontend.vercel.app

**Backend API Docs:** https://devvault-backend-production-d964.up.railway.app/swagger-ui/index.html

---

## 🚀 What is this?

This is the frontend for DevVault — a clean, minimal dashboard built with Next.js 15 and shadcn/ui that lets your team manage secrets without touching the API directly.

**Pages:**
- `/login` — Sign in to your vault
- `/register` — Create account (invite only after first user)
- `/dashboard` — All projects overview
- `/project/[id]` — Secrets management per project with environment filtering
- `/audit` — Full audit trail of every access
- `/team` — ADMIN controls who can join

---

## ✨ Features

- 🌑 Clean dark UI built with Tailwind CSS + shadcn/ui
- 📁 Organize secrets by project and environment (dev/staging/prod)
- 👁 Reveal secrets on demand — never stored in the browser
- 📋 One-click copy to clipboard
- ↑ Import `.env` files directly from the UI
- ↓ Export secrets as `.env` files
- 📋 Live audit log with color-coded actions
- 👥 Team management — ADMIN invites teammates by email

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS |
| Components | shadcn/ui (Radix UI) |
| Font | Inter |
| Deployment | Vercel |

---

## 🚀 Run Locally

### Prerequisites
- Node.js 18+
- A running DevVault backend (see [devvault-backend](https://github.com/KushagraJadiya24/devvault-backend))

### Setup

```bash
git clone https://github.com/KushagraJadiya24/devvault-frontend.git
cd devvault-frontend
npm install
npm run dev
```

Open `http://localhost:3000`

### Point to your backend

In `lib/api.ts`, update `API_BASE`:

```typescript
const API_BASE = "https://your-backend-url.com"
```

---

## 🔑 First Time Setup

1. Make sure your DevVault backend is running
2. Go to `/register` — first user automatically becomes **ADMIN**
3. Go to **Team** tab → add your teammates' emails
4. Share the URL — teammates register and get **MEMBER** access

---

## 📸 Screenshots

> Dashboard — projects overview

> Project page — secrets with environment tabs

> Audit log — color coded actions

> Team management — ADMIN controls access

---

## 👤 Author

**Kushagra Jadiya**
- GitHub: [@KushagraJadiya24](https://github.com/KushagraJadiya24)
- LinkedIn: https://www.linkedin.com/in/kushagra-jadiya/

---

## 📄 License
MIT
