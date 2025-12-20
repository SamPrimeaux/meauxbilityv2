# Multi-Tenant Monorepo Structure

## 🏗️ Architecture

This monorepo supports multiple tenants, each with their own:
- Worker deployment
- Subdomain routing (tenant.dev)
- UI/UX customization
- Database isolation
- R2 bucket (optional)

## 📁 Directory Structure

```
hybridprosaas-dashboard/
├── tenants/
│   ├── inneranimalmedia/          # Inner Animal Media (Nonprofit)
│   │   ├── src/
│   │   │   └── worker.js           # Tenant-specific worker
│   │   ├── ui/
│   │   │   ├── index.html
│   │   │   ├── dashboard.html
│   │   │   └── ...
│   │   ├── wrangler.jsonc
│   │   └── README.md
│   │
│   ├── southernpets/               # Southern Pets Animal Rescue (Nonprofit)
│   │   ├── src/
│   │   ├── ui/
│   │   ├── wrangler.jsonc
│   │   └── README.md
│   │
│   ├── meauxlearn/                 # MeauxLearn Course Platform
│   │   ├── src/
│   │   │   └── worker.js
│   │   ├── ui/
│   │   ├── database/
│   │   ├── wrangler.jsonc
│   │   └── README.md
│   │
│   └── fuelnfreetime/              # Fuel & Free Time
│       ├── src/
│       ├── ui/
│       ├── wrangler.jsonc
│       └── README.md
│
├── src/                            # Shared utilities
│   ├── tenant-router.js            # Multi-tenant routing
│   └── shared/
│       ├── auth.js
│       └── utils.js
│
├── .github/workflows/
│   ├── deploy-all-tenants.yml      # Deploy all tenants
│   └── deploy-tenant.yml            # Deploy single tenant
│
└── wrangler.*.jsonc                 # Root-level configs (legacy)
```

## 🌐 Tenant Subdomains

Each tenant gets their own subdomain:

| Tenant | Subdomain | Worker Name | Status |
|--------|-----------|-------------|--------|
| Inner Animal Media | `inneranimalmedia.meauxbility.workers.dev` | `inneranimalmedia` | ✅ Active |
| Southern Pets | `southernpets.meauxbility.workers.dev` | `southernpets` | ⏳ Setup |
| MeauxLearn | `meauxlearn.meauxbility.workers.dev` | `meauxlearn` | ⏳ Setup |
| Fuel & Free Time | `fuelnfreetime.meauxbility.workers.dev` | `fuelnfreetime` | ✅ Active |

## 🔧 Tenant Configuration

Each tenant has:
- **Worker Name**: Unique Cloudflare Worker name
- **Subdomain**: `{tenant}.meauxbility.workers.dev`
- **Custom Domain** (optional): `{tenant}.dev`
- **D1 Database**: Tenant-specific or shared
- **R2 Bucket**: Tenant-specific assets
- **UI Theme**: Customizable branding

## 🚀 Deployment

### Deploy All Tenants
```bash
npm run deploy:all
```

### Deploy Single Tenant
```bash
npm run deploy:tenant -- inneranimalmedia
```

### GitHub Actions
- Push to `main` → Auto-deploy all tenants
- Push to tenant directory → Deploy that tenant only

## 📋 Tenant Isolation

- **Database**: Each tenant can have separate D1 database
- **Storage**: Separate R2 buckets per tenant
- **Routing**: Subdomain-based routing
- **UI**: Completely isolated UI/UX
- **API**: Tenant-scoped API endpoints

## ✅ Current Tenants

### 1. Inner Animal Media (Nonprofit)
- **Purpose**: Media agency dashboard
- **UI**: Professional business dashboard
- **Features**: GitHub repos, Workers list, Projects
- **Status**: ✅ Production

### 2. Southern Pets Animal Rescue (Nonprofit)
- **Purpose**: Animal rescue organization
- **UI**: TBD (preserve nonprofit branding)
- **Status**: ⏳ Setup needed

### 3. MeauxLearn
- **Purpose**: Course platform
- **UI**: Fortune 500-grade iOS design
- **Features**: Multi-tenant courses, progress tracking
- **Status**: ✅ Active (fuelnfreetime worker)

### 4. Fuel & Free Time
- **Purpose**: General platform
- **UI**: Galaxy theme landing
- **Status**: ✅ Active

## 🔐 Tenant Detection

Workers detect tenant from:
1. **Subdomain**: `{tenant}.meauxbility.workers.dev`
2. **Custom Domain**: `{tenant}.dev`
3. **Header**: `X-Tenant-ID` (for API calls)

## 📝 Adding New Tenant

1. Create tenant directory: `tenants/{tenant-name}/`
2. Add `wrangler.jsonc` with tenant config
3. Create `src/worker.js` with tenant logic
4. Add UI files in `ui/` directory
5. Update `.github/workflows/deploy-all-tenants.yml`
6. Deploy: `npm run deploy:tenant -- {tenant-name}`
