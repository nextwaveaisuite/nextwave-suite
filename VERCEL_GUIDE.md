# 🚀 Vercel Deployment Guide

## 📋 Deploy All 6 Projects

Deploy each folder separately to Vercel.

---

## 1️⃣ Deploy Backend

**Project Name:** `nextwave-backend`

**Settings:**
- Framework: Express
- Root Directory: `backend`
- Build Command: (leave empty)
- Output Directory: (leave empty)

**Environment Variables:**
```
NODE_ENV=production
JWT_SECRET=NextWave2025SecretKey!ChangeThis
PORT=3000
```

**Click Deploy** → Wait 2-3 minutes → Copy your backend URL!

Example: `https://nextwave-backend-abc123.vercel.app`

---

## 2️⃣ Deploy NicheFinder

**Project Name:** `nextwave-nichefinder`

**Settings:**
- Framework: Vite
- Root Directory: `nichefinder`
- Build Command: `pnpm run build`
- Output Directory: `dist`

**Environment Variables:**
```
VITE_API_URL=https://nextwave-backend-abc123.vercel.app/api
VITE_BRAND_NAME=Next Wave AI Suite
VITE_BRAND_URL=https://nextwaveaisuite.com
```

(Replace `nextwave-backend-abc123.vercel.app` with your actual backend URL from step 1!)

**Click Deploy**

---

## 3️⃣ Deploy CampaignMaster

**Project Name:** `nextwave-campaignmaster`

**Settings:**
- Framework: Vite
- Root Directory: `campaignmaster`
- Build Command: `pnpm run build`
- Output Directory: `dist`

**Environment Variables:**
```
VITE_API_URL=https://nextwave-backend-abc123.vercel.app/api
VITE_BRAND_NAME=Next Wave AI Suite
VITE_BRAND_URL=https://nextwaveaisuite.com
```

**Click Deploy**

---

## 4️⃣ Deploy TrendScout

**Project Name:** `nextwave-trendscout`

**Settings:**
- Framework: Vite
- Root Directory: `trendscout`
- Build Command: `pnpm run build`
- Output Directory: `dist`

**Environment Variables:**
```
VITE_API_URL=https://nextwave-backend-abc123.vercel.app/api
VITE_BRAND_NAME=Next Wave AI Suite
VITE_BRAND_URL=https://nextwaveaisuite.com
```

**Click Deploy**

---

## 5️⃣ Deploy Admin Dashboard

**Project Name:** `nextwave-admin`

**Settings:**
- Framework: Vite
- Root Directory: `admin-dashboard`
- Build Command: `pnpm run build`
- Output Directory: `dist`

**Environment Variables:**
```
VITE_API_URL=https://nextwave-backend-abc123.vercel.app/api
VITE_BRAND_NAME=Next Wave AI Suite
VITE_BRAND_URL=https://nextwaveaisuite.com
```

**Click Deploy**

---

## 6️⃣ Deploy Unified Dashboard

**Project Name:** `nextwave-unified`

**Settings:**
- Framework: Vite
- Root Directory: `unified-dashboard`
- Build Command: `pnpm run build`
- Output Directory: `dist`

**Environment Variables:**
```
VITE_API_URL=https://nextwave-backend-abc123.vercel.app/api
VITE_BRAND_NAME=Next Wave AI Suite
VITE_BRAND_URL=https://nextwaveaisuite.com
```

**Click Deploy**

---

## ✅ Your Permanent URLs

After all deployments, you'll have:

| Product | URL |
|---------|-----|
| Backend | `https://nextwave-backend.vercel.app` |
| NicheFinder | `https://nextwave-nichefinder.vercel.app` |
| CampaignMaster | `https://nextwave-campaignmaster.vercel.app` |
| TrendScout | `https://nextwave-trendscout.vercel.app` |
| Admin | `https://nextwave-admin.vercel.app` |
| Unified | `https://nextwave-unified.vercel.app` |

---

## 🎉 Done!

All 6 projects are now live with permanent URLs!

---

© 2025 Next Wave AI Suite
