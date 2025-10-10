# 🏗️ Next Wave AI Suite - System Architecture

## 📐 High-Level Architecture

The Next Wave AI Suite follows a modern **client-server architecture** with multiple frontend applications communicating with a single backend API.

```
┌─────────────────────────────────────────────────────────┐
│                    USER LAYER                            │
│  (Browsers, Mobile Devices, Desktop Applications)       │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                 FRONTEND LAYER (React)                   │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │ NicheFinder  │ │CampaignMaster│ │ TrendScout   │   │
│  └──────────────┘ └──────────────┘ └──────────────┘   │
│  ┌──────────────┐ ┌──────────────┐                     │
│  │Admin Dashboard│ │Unified Dash  │                     │
│  └──────────────┘ └──────────────┘                     │
└─────────────────────────────────────────────────────────┘
                          │
                    REST API (HTTPS)
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              BACKEND LAYER (Express.js)                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  API Routes  │  Middleware  │  Services          │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│               DATA LAYER (SQLite)                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  10 Tables: users, niches, campaigns, etc.       │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│           EXTERNAL SERVICES LAYER                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │ClickBank │ │ Bing Ads │ │Google Ads│ │ Facebook │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
│  ┌──────────┐ ┌──────────┐                            │
│  │  Reddit  │ │  Amazon  │                            │
│  └──────────┘ └──────────┘                            │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Component Architecture

### Frontend Applications (5 Apps)

Each frontend is a **standalone React application** that can operate independently or communicate with the backend.

**Technology Stack:**
- React 18
- Vite (build tool)
- TailwindCSS (styling)
- Lucide React (icons)
- Axios (HTTP client)

**Common Structure:**
```
app/
├── src/
│   ├── components/     # Reusable UI components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   ├── App.jsx         # Main application component
│   ├── index.css       # Global styles
│   └── main.jsx        # Entry point
├── public/             # Static assets
├── index.html          # HTML template
├── package.json        # Dependencies
└── vite.config.js      # Build configuration
```

### Backend API (1 Server)

The backend is a **Node.js Express server** that provides RESTful API endpoints.

**Technology Stack:**
- Node.js 18+
- Express.js
- SQLite3
- JWT (authentication)
- Bcrypt (password hashing)
- CORS (cross-origin)

**Structure:**
```
backend/
├── src/
│   ├── routes/         # API endpoint definitions
│   ├── services/       # Business logic & external APIs
│   ├── middleware/     # Auth, validation, error handling
│   ├── config/         # Configuration & database setup
│   └── server.js       # Main server file
├── database/           # SQLite database file
├── package.json        # Dependencies
└── .env.example        # Environment variables template
```

---

## 🔄 Data Flow

### Example: Discover Trend → Create Campaign

```
1. User opens TrendScout
   │
   ▼
2. Clicks "Scan ClickBank"
   │
   ▼
3. TrendScout → POST /api/trends/discover
   │
   ▼
4. Backend calls ClickBank API
   │
   ▼
5. Backend saves trends to database
   │
   ▼
6. Backend returns trends to TrendScout
   │
   ▼
7. User clicks "Export to NicheFinder"
   │
   ▼
8. TrendScout → POST /api/niches (with trend data)
   │
   ▼
9. Backend saves niche to database
   │
   ▼
10. User opens NicheFinder
    │
    ▼
11. NicheFinder → GET /api/niches
    │
    ▼
12. Backend returns niches (including imported one)
    │
    ▼
13. User clicks "Export to CampaignMaster"
    │
    ▼
14. NicheFinder → POST /api/campaigns (with niche data)
    │
    ▼
15. Backend saves campaign draft
    │
    ▼
16. User opens CampaignMaster
    │
    ▼
17. CampaignMaster → GET /api/campaigns
    │
    ▼
18. Backend returns campaigns
    │
    ▼
19. User clicks "Launch to Bing Ads"
    │
    ▼
20. CampaignMaster → POST /api/campaigns/:id/launch
    │
    ▼
21. Backend calls Bing Ads API
    │
    ▼
22. Campaign goes live!
```

---

## 🗄️ Database Schema

### Tables and Relationships

```
users (1) ──────< campaigns (many)
  │
  └──────< niches (many)
  │
  └──────< access_requests (many)
  │
  └──────< invitations (many)

campaigns (1) ──────< ads (many)

niches (1) ──────< trends (many)

users (1) ──────< integrations (many)

system_settings (1) - global configuration

activity_log (*) - audit trail
```

### Table Details

**users**
- id, email, password_hash, name, role, subscription_tier
- status, created_at, last_login, metadata

**niches**
- id, user_id, name, category, description
- profitability_score, competition_level, revenue_potential
- created_at, updated_at

**campaigns**
- id, user_id, niche_id, name, status
- platform, budget, start_date, end_date
- performance_metrics, created_at, updated_at

**ads**
- id, campaign_id, headline, description, cta
- performance_metrics, status, created_at

**trends**
- id, source, title, description, category
- trending_score, discovered_at, metadata

**integrations**
- id, user_id, platform, api_key_encrypted
- status, connected_at, last_sync

**system_settings**
- id, key, value, updated_at

**access_requests**
- id, user_email, user_name, message
- status, requested_at, processed_at

**invitations**
- id, code, subscription_tier, max_uses
- used_count, created_by, created_at, expires_at

**activity_log**
- id, user_id, action, resource_type, resource_id
- details, ip_address, user_agent, created_at

---

## 🔐 Authentication Flow

```
1. User submits login form
   │
   ▼
2. Frontend → POST /api/auth/login
   │
   ▼
3. Backend validates credentials
   │
   ▼
4. Backend generates JWT token
   │
   ▼
5. Backend returns token + user data
   │
   ▼
6. Frontend stores token in localStorage
   │
   ▼
7. Frontend includes token in all API requests
   │
   ▼
8. Backend middleware validates token
   │
   ▼
9. Backend extracts user from token
   │
   ▼
10. Backend processes request with user context
```

---

## 🚀 Deployment Architecture

### Production Setup (Recommended)

```
┌─────────────────────────────────────────────────────────┐
│                    VERCEL CDN                            │
│  (Global Edge Network - Automatic HTTPS)                 │
└─────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ NicheFinder  │  │CampaignMaster│  │ TrendScout   │
│ (Vercel)     │  │  (Vercel)    │  │  (Vercel)    │
└──────────────┘  └──────────────┘  └──────────────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
                    REST API (HTTPS)
                          │
                          ▼
                ┌──────────────────┐
                │  Backend API     │
                │  (Vercel/Railway)│
                └──────────────────┘
                          │
                          ▼
                ┌──────────────────┐
                │  SQLite Database │
                │  (Persistent Vol)│
                └──────────────────┘
```

---

## 🔌 API Integration Architecture

### External Service Connections

```
Backend API
    │
    ├─→ ClickBank API
    │   └─→ Product marketplace data
    │
    ├─→ Bing Ads API
    │   └─→ Campaign creation & management
    │
    ├─→ Google Ads API
    │   └─→ Campaign creation & management
    │
    ├─→ Facebook Ads API
    │   └─→ Campaign creation & management
    │
    ├─→ Reddit API
    │   └─→ Trending topics & subreddit data
    │
    └─→ Amazon API
        └─→ Best-seller & product data
```

---

## 🛡️ Security Architecture

### Security Layers

**1. Transport Security**
- HTTPS everywhere (TLS 1.3)
- Automatic SSL certificates via Vercel

**2. Authentication**
- JWT tokens with expiration
- Secure password hashing (bcrypt)
- Token refresh mechanism

**3. Authorization**
- Role-based access control (RBAC)
- Owner/Admin/User roles
- Per-resource permissions

**4. Data Security**
- SQL injection prevention (parameterized queries)
- XSS protection (React auto-escaping)
- CSRF protection (SameSite cookies)
- API key encryption in database

**5. Rate Limiting**
- API request throttling
- Login attempt limiting
- Brute force protection

---

## 📊 Scalability Considerations

### Current Architecture (MVP)

**Suitable for:**
- Up to 10,000 users
- Up to 100,000 API requests/day
- Single-region deployment

**Limitations:**
- SQLite (single-file database)
- Serverless functions (10s timeout on Vercel free tier)
- No horizontal scaling

### Future Scaling Path

**Phase 1: Database Migration**
- SQLite → PostgreSQL
- Enables multiple backend instances
- Better concurrent access

**Phase 2: Caching Layer**
- Add Redis for session storage
- Cache frequently accessed data
- Reduce database load

**Phase 3: Microservices**
- Split backend into services
- Auth service, Campaign service, etc.
- Independent scaling

**Phase 4: Message Queue**
- Add RabbitMQ or AWS SQS
- Async processing for long tasks
- Better reliability

---

## 🔄 Development Workflow

```
Developer
    │
    ├─→ Edit code locally
    │
    ├─→ Test with local dev server
    │
    ├─→ Commit to Git
    │
    ├─→ Push to GitHub
    │
    └─→ Vercel auto-deploys
        │
        ├─→ Builds application
        │
        ├─→ Runs tests (if configured)
        │
        ├─→ Deploys to preview URL
        │
        └─→ (If main branch) Deploys to production
```

---

## 🎯 Technology Decisions

### Why React?
- Industry standard
- Large ecosystem
- Component reusability
- Strong community support

### Why Vite?
- Extremely fast builds
- Modern tooling
- Great developer experience
- Smaller bundle sizes

### Why Express.js?
- Simple and flexible
- Minimal boilerplate
- Large middleware ecosystem
- Easy to learn

### Why SQLite?
- Zero configuration
- Portable (single file)
- Perfect for MVP
- Easy migration path to PostgreSQL

### Why Vercel?
- Free tier generous
- Automatic deployments
- Global CDN
- Excellent developer experience

---

## 📈 Performance Optimization

### Frontend Optimizations
- Code splitting (React.lazy)
- Image optimization (Vercel automatic)
- Lazy loading
- Memoization (React.memo, useMemo)
- Tree shaking (Vite automatic)

### Backend Optimizations
- Database indexing
- Query optimization
- Response caching
- Gzip compression
- Connection pooling

### Network Optimizations
- CDN delivery (Vercel automatic)
- HTTP/2 (Vercel automatic)
- Asset minification (Vite automatic)
- Prefetching critical resources

---

## 🔍 Monitoring & Observability

### Recommended Tools

**Frontend Monitoring:**
- Vercel Analytics (built-in)
- Google Analytics
- Sentry (error tracking)

**Backend Monitoring:**
- Vercel Logs
- Custom logging middleware
- Database query logging

**Performance Monitoring:**
- Lighthouse scores
- Core Web Vitals
- API response times

---

## 🎊 Conclusion

The Next Wave AI Suite architecture is designed to be:

✅ **Simple** - Easy to understand and maintain
✅ **Scalable** - Clear path to handle growth
✅ **Secure** - Multiple security layers
✅ **Modern** - Uses current best practices
✅ **Flexible** - Easy to extend and modify

This architecture supports both personal use and SaaS business models, with a clear upgrade path as the platform grows.

---

© 2025 Next Wave AI Suite | nextwaveaisuite.com
