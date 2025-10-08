// backend/api/index.js
// Adapter for Vercel serverless. No changes to your existing files.
// It builds a small Express app and mounts your existing routers.

const express = require("express");
const cors = require("cors");

// Boot your DB/init code (safe if it’s idempotent)
try {
  require("../config/initDatabase");
} catch (e) {
  console.log("initDatabase not present or failed:", e?.message || e);
}

// Import your existing route modules (they should export an Express router)
const auth = safeRequire("../routes/auth");
const admin = safeRequire("../routes/admin");
const campaigns = safeRequire("../routes/campaigns");
const integrations = safeRequire("../routes/integrations");
const niches = safeRequire("../routes/niches");
const trends = safeRequire("../routes/trends");

// Build the app
const app = express();

// CORS: allow your frontends (set CORS_ORIGIN in Vercel → Env)
const allowed = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map(s => s.trim())
  : ["*"];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowed.includes("*") || allowed.some(a => origin.endsWith(a) || origin === a)) {
      return cb(null, true);
    }
    return cb(new Error("Not allowed by CORS: " + origin));
  },
  credentials: true
}));
app.use(express.json());

// Simple health checks
app.get("/health", (_, res) => res.json({ ok: true }));
app.get("/api/health", (_, res) => res.json({ ok: true }));

// Mount your existing routers under /api
if (auth) app.use("/api/auth", auth);
if (admin) app.use("/api/admin", admin);
if (campaigns) app.use("/api/campaigns", campaigns);
if (integrations) app.use("/api/integrations", integrations);
if (niches) app.use("/api/niches", niches);
if (trends) app.use("/api/trends", trends);

// Export as a Vercel serverless function handler
module.exports = (req, res) => {
  // Express apps are request handlers; just delegate.
  app(req, res);
};

// Helper: require without crashing the function if a file is missing
function safeRequire(p) {
  try { return require(p); } catch (e) { console.log(`Optional module ${p} not found or failed:`, e?.message || e); return null; }
}
