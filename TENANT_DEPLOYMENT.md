# Multi-Tenant Deployment Guide

## 🏗️ Monorepo Structure

This is a **multi-tenant monorepo** where each tenant has:
- Isolated worker code
- Own subdomain (`.meauxbility.workers.dev`)
- Optional custom domain (`.dev`)
- Preserved UI (for nonprofits)

## 📋 Current Tenants

### 1. Inner Animal Media (Nonprofit) ✅
- **Worker**: `inneranimalmedia`
- **Subdomain**: `inneranimalmedia.meauxbility.workers.dev`
- **Custom Domain**: `inneranimal.app`
- **UI**: **PRESERVED** - Professional business dashboard
- **Status**: Production

### 2. Southern Pets Animal Rescue (Nonprofit) ⏳
- **Worker**: `southernpets`
- **Subdomain**: `southernpets.meauxbility.workers.dev`
- **Custom Domain**: `southernpets.dev` (optional)
- **UI**: **PRESERVED** - Nonprofit branding (setup needed)
- **Status**: Setup needed

### 3. MeauxLearn ✅
- **Worker**: `meauxlearn`
- **Subdomain**: `meauxlearn.meauxbility.workers.dev`
- **Custom Domain**: `meauxlearn.dev` (optional)
- **UI**: Fortune 500-grade iOS design
- **Status**: Active (migrated from fuelnfreetime)

### 4. Fuel & Free Time ✅
- **Worker**: `fuelnfreetime`
- **Subdomain**: `fuelnfreetime.meauxbility.workers.dev`
- **UI**: Galaxy theme landing
- **Status**: Active

## 🚀 Deployment

### Deploy All Tenants
```bash
npm run deploy:all
```

### Deploy Single Tenant
```bash
# Inner Animal Media (nonprofit - preserved UI)
npm run deploy:inneranimalmedia

# Southern Pets (nonprofit - preserved UI)
npm run deploy:southernpets

# MeauxLearn (course platform)
npm run deploy:meauxlearn

# Fuel & Free Time
npm run deploy:fuelnfreetime
```

### GitHub Actions
- **Auto-deploy**: Push to `main` → All tenants deploy
- **Selective**: Push to `tenants/{tenant}/` → Only that tenant deploys

## 🔐 Tenant Isolation

### UI Preservation
- **Inner Animal Media**: ✅ UI preserved (production)
- **Southern Pets**: ✅ UI preserved (nonprofit branding)
- **MeauxLearn**: Custom UI (Fortune 500-grade)
- **Fuel & Free Time**: Custom UI (galaxy theme)

### Database Isolation
- Each tenant can use:
  - Shared D1 database (with tenant_id filtering)
  - Separate D1 database (recommended for nonprofits)
  - Hybrid approach

### Storage Isolation
- R2 buckets can be:
  - Shared: `inneranimalmedia` bucket
  - Separate: `{tenant}-assets` bucket
  - Per-tenant: `{tenant}` bucket

## 📁 Directory Structure

```
tenants/
├── inneranimalmedia/          # Nonprofit (UI preserved)
│   └── README.md
├── southernpets/              # Nonprofit (UI preserved)
│   ├── src/
│   │   └── worker.js
│   ├── wrangler.jsonc
│   └── README.md
├── meauxlearn/                # Course platform
│   ├── src/
│   │   └── worker.js
│   ├── database/
│   │   ├── meauxlearn-schema.sql
│   │   └── meauxlearn-seed.sql
│   ├── wrangler.jsonc
│   └── README.md
└── fuelnfreetime/             # General platform
    └── (uses root-level config)
```

## ✅ Nonprofit UI Protection

**Important**: Nonprofit tenants (Inner Animal Media, Southern Pets) have their UI **PRESERVED**:

- ✅ Inner Animal Media uses existing `src/inneranimalmedia.js`
- ✅ Southern Pets has placeholder that preserves branding
- ✅ No generic templates override nonprofit UIs
- ✅ Each nonprofit can customize independently

## 🌐 Subdomain Routing

Each tenant automatically gets:
- `{tenant}.meauxbility.workers.dev` - Workers.dev subdomain
- `{tenant}.dev` - Custom domain (optional, requires DNS setup)

## 📝 Adding New Tenant

1. Create directory: `tenants/{tenant-name}/`
2. Add `wrangler.jsonc` with tenant config
3. Create `src/worker.js` with tenant logic
4. Add UI files if needed
5. Update `.github/workflows/deploy-all-tenants.yml`
6. Add to `package.json` scripts
7. Deploy: `npm run deploy:{tenant-name}`

## 🔧 Configuration

Each tenant's `wrangler.jsonc` includes:
- Worker name
- D1 database binding
- R2 bucket binding
- Routes for subdomain and custom domain
- Environment variables

## 📊 Status Summary

| Tenant | Worker | Subdomain | UI Status | Database |
|--------|--------|-----------|-----------|----------|
| Inner Animal Media | `inneranimalmedia` | ✅ | ✅ Preserved | Shared |
| Southern Pets | `southernpets` | ⏳ | ✅ Preserved | `southernpetsanimalrescue` |
| MeauxLearn | `meauxlearn` | ⏳ | ✅ Custom | `meaux-work-db` |
| Fuel & Free Time | `fuelnfreetime` | ✅ | ✅ Custom | `meaux-work-db` |

## 🎯 Next Steps

1. **Deploy MeauxLearn tenant**:
   ```bash
   npm run deploy:meauxlearn
   ```

2. **Deploy Southern Pets tenant**:
   ```bash
   npm run deploy:southernpets
   ```

3. **Verify nonprofit UIs are preserved**:
   - Inner Animal Media: https://inneranimalmedia.meauxbility.workers.dev
   - Southern Pets: https://southernpets.meauxbility.workers.dev (after deploy)

4. **Set up custom domains** (optional):
   - Add DNS records for `.dev` domains
   - Configure in Cloudflare Dashboard
