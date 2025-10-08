// backend/api/index.js
const express = require("express");
const cors = require("cors");

function safeRequire(p) { try { return require(p); } catch (e) { console.log(`Optional ${p}:`, e?.message || e); return null; } }

safeRequire("../config/initDatabase"); // ok if it does nothing

const auth = safeRequire("../routes/auth");
const admin = safeRequire("../routes/admin");
const campaigns = safeRequire("../routes/campaigns");
const integrations = safeRequire("../routes/integrations");
const niches = safeRequire("../routes/niches");
const trends = safeRequire("../routes/trends");

const app = express();

const allowed = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map(s => s.trim())
  : ["*"];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowed.includes("*") || allowed.some(a => origin === a || origin.endsWith(a))) return cb(null, true);
    return cb(new Error("Not allowed by CORS: " + origin));
  },
  credentials: true
}));

app.use(express.json());

app.get("/health", (_, res) => res.json({ ok: true }));
app.get("/api/health", (_, res) => res.json({ ok: true }));

if (auth) app.use("/api/auth", auth);
if (admin) app.use("/api/admin", admin);
if (campaigns) app.use("/api/campaigns", campaigns);
if (integrations) app.use("/api/integrations", integrations);
if (niches) app.use("/api/niches", niches);
if (trends) app.use("/api/trends", trends);

// Export as serverless handler
module.exports = (req, res) => app(req, res);
