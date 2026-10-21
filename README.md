# ⚡ AI Studio — Vue 3 + Vite + FastAPI Starter Kit

A production-ready frontend starter for building **AI-powered POC applications** on top of the companion `ai-app-backend-POC` FastAPI skeleton.

Stop rebuilding login, routing, and API plumbing every time you have a new idea. Clone this, connect it to your backend, and spend your time on the product — not the boilerplate.

> **🔗 Companion backend:** [ai-app-backend-POC](https://github.com/netoMaape/ai-app-backend-POC) — FastAPI + SQLite + JWT + provider-agnostic AI.

---

## ✨ What you get

- **🔐 Real JWT authentication** — login, register, protected routes, auto-logout on expired tokens. End-to-end with the FastAPI backend, no mocks.
- **🤖 Live AI workspace** — a clean prompt-and-response UI wired to `/api/v1/ai/summarize`. Shows real latency, real errors, real results.
- **🧪 Built-in API Explorer** — hit any backend endpoint from inside the app. Perfect for teaching what the backend actually does.
- **🎨 Component showcase** — every reusable piece (buttons, badges, modals, alerts) on one page. Extend without reinventing.
- **👤 Profile menu with modals** — Profile / Settings / Inference Logs all live in a single dropdown. No dead pages.
- **📱 Responsive + accessible** — mobile-first layout, keyboard navigation, focus rings, ARIA labels.
- **🧠 AI-friendly architecture** — a `frontend-context.md` file turns any LLM into a senior frontend engineer who can extend this starter for your specific idea.

---

## 🚀 Quick Start

### Prerequisites

- Node.js **18+** (`node --version`)
- The companion backend running at `http://127.0.0.1:8000`

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the backend URL

```bash
# Git Bash / macOS / Linux
cp .env.example .env

# Windows CMD
copy .env.example .env

# PowerShell
Copy-Item .env.example .env
```

The default `.env` points at `http://127.0.0.1:8000/api`. Adjust if your backend runs elsewhere.

### 3. Run the dev server

```bash
npm run dev
```

Open **http://localhost:8080**.

### 4. Sign in

Use one of the seeded accounts from the backend:

```
test@example.com  / password123
admin@example.com / admin123
```

Or click **Create account** to register a new user.

---

## 🗺️ What's in the box

```
src/
├── main.js                      # App bootstrap
├── App.vue                      # Auth-aware layout shell
├── api/
│   ├── client.js                # Axios instance + interceptors + 401 auto-logout
│   ├── auth.js                  # login / register / me (OAuth2 form flow)
│   └── ai.js                    # summarize
├── assets/styles.css            # Theme, gradients, component tweaks
├── components/
│   ├── AppModal.vue             # Teleported, animated modal
│   ├── Navbar.vue               # Profile dropdown + 3 modals
│   ├── Sidebar.vue              # Sectioned nav
│   └── ErrorAlert.vue           # Reusable error banner
├── router/index.js              # Routes + auth guard + user hydration
├── stores/
│   ├── authStore.js             # Token, user, login, register, logout
│   └── aiStore.js               # Session results, latency, errors
└── views/
    ├── LoginView.vue            # Split-screen sign-in
    ├── RegisterView.vue         # Split-screen registration
    ├── DashboardView.vue        # AI playground (main workspace)
    ├── ExplorerView.vue         # Live API tester
    └── ComponentsView.vue       # UI showcase
```

---

## 🧭 The user journey

1. **Visit the app** → redirected to `/login` if not signed in
2. **Sign in** (or register) → JWT is stored, `GET /users/me` hydrates the user
3. **Land on the Playground** → type a prompt → hit **Summarize** → real AI response
4. **Explore the toolkit** → `/explorer` lets you call any backend endpoint; `/components` shows the reusable UI
5. **Profile menu** → view your account, backend config, and session inference log — all in modals
6. **Sign out** → token cleared, back to `/login`

---

## 🔌 Backend contract

This starter kit is wired to the following endpoints. If your backend differs, the only files you need to touch are `src/api/*.js`.

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `POST` | `/api/v1/auth/login` | ❌ | OAuth2 password flow → `{access_token, token_type}` |
| `POST` | `/api/v1/auth/register` | ❌ | `{email, password}` → user object |
| `GET`  | `/api/v1/users/me` | ✅ | Returns the authenticated user |
| `POST` | `/api/v1/ai/summarize` | ✅ | `{prompt}` → `{summary}` |

The client automatically attaches `Authorization: Bearer <token>` to every non-auth request and forces a redirect to `/login` on any `401`.

---

## 🎨 Customizing the look

All theme tokens live in `src/assets/styles.css`:

```css
:root {
  --primary-gradient: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  --sidebar-width: 250px;
  --bg-app: #f8fafc;
}
```

Change the gradient, and every primary button, active nav item, and login panel updates at once.

---

## 🧠 Extending this kit for your own idea

You have two paths:

### Path A — Ask an AI to build your frontend

Drop the `frontend-context.md` file from this repo into a chat with your preferred LLM (Claude, GPT-4, DeepSeek) along with your app idea. The context file turns the AI into a senior frontend engineer who knows every file, every component, and every backend endpoint — and will plan before writing code.

### Path B — Build it manually

- **New page?** Copy `DashboardView.vue` → `src/views/YourView.vue`, add a route in `src/router/index.js`, and add a `<router-link>` in `src/components/Sidebar.vue`.
- **New backend call?** Add a method to `src/api/ai.js` (or a new file in `src/api/`), then call it from a store.
- **New store?** Copy `aiStore.js` as a template — same Pinia composition-API pattern.

---

## 🧪 Testing checklist

Before you demo or ship:

- [ ] Log in with `test@example.com / password123`
- [ ] Submit a prompt → real response appears
- [ ] Reload the page → still signed in
- [ ] Click **Sign out** → redirected to `/login`
- [ ] Open dev tools → submit a prompt → confirm `POST /api/v1/ai/summarize` returns 200
- [ ] Stop the backend → submit a prompt → see a real error, not a fake success
- [ ] Open `/explorer` → hit `/users/me` → see your user JSON
- [ ] Resize to mobile → sidebar collapses, forms remain usable

---

## 🛠️ Troubleshooting

| Symptom | Fix |
|---|---|
| Login returns `422 Unprocessable Entity` | The backend expects form-encoded data, not JSON. Confirm `src/api/auth.js` uses `URLSearchParams` (it already does). |
| `CORS policy` error in console | Add your frontend origin (`http://localhost:8080`) to the backend's `ALLOWED_ORIGINS` or CORS middleware. |
| `401` immediately after login | Your `ACCESS_TOKEN_EXPIRE_MINUTES` may be too short. Restart backend and log in again. |
| Requests go to `:8000` but backend is on another port | Update `VITE_API_BASE_URL` in `.env`, then restart `npm run dev`. |
| Prompt returns demo text instead of a real summary | Backend `AI_PROVIDER=mock` is active. That's expected — switch to `openai` or `gemini` in the backend `.env` for real responses. |

---

## 📦 Build for production

```bash
npm run build
```

Output goes to `dist/`. Serve it from any static host (Vercel, Netlify, Cloudflare Pages, nginx). Just set `VITE_API_BASE_URL` at build time to point at your production backend.

---

## 🙏 Credits

- **Vue 3 + Vite + Pinia** — the modern Vue stack
- **Bootstrap 5** — layout and utilities (CSS only, no JS wrapper dependencies)
- **Font Awesome 6** — icons
- **Inter + JetBrains Mono** — typography

---

## 📄 License

MIT. Use it, fork it, sell it, teach with it.

**Happy building. 🚀**