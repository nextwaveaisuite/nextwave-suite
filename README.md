# NextWave Suite (Option 2 Architecture)

Monorepo with one backend (Express) and multiple frontends. No source edits performed.

## Apps
- backend/ — Express API (brain)
- unified-dashboard/ — main UI
- shared-ui/ — reusable components for frontends

## Deploy
- Backend: Railway/Render → set env: JWT_SECRET, DATABASE_URL, (optional) CORS_ORIGIN
- Frontends (Vercel): Set VITE_API_URL to your backend URL
