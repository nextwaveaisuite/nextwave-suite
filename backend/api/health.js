// backend/api/health.js
module.exports = (req, res) => {
  res.status(200).json({ ok: true, runtime: "vercel-node" });
};
