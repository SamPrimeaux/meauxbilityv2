# Tenant Isolation & UI Preservation

## ✅ Nonprofit UI Protection

### Inner Animal Media (Nonprofit)
- **Worker**: `inneranimalmedia` ✅ **PRESERVED**
- **Location**: `src/inneranimalmedia.js` (root level)
- **Config**: `wrangler.inneranimalmedia.jsonc` (root level)
- **UI**: Professional business dashboard
- **Status**: ✅ Production - **DO NOT OVERRIDE**
- **URL**: https://inneranimalmedia.meauxbility.workers.dev

**Files that serve Inner Animal Media UI:**
- `inneranimalmedia-dashboard.html`
- `inneranimalmedia-projects.html`
- `inneranimalmedia-repos.html`
- `inneranimalmedia-workers.html`
- `inneranimalmedia-settings.html`
- `inneranimalmedia-index.html`
- All `meaux-*.html` files

**These files are served from R2 and are NOT overridden by other tenants.**

### Southern Pets Animal Rescue (Nonprofit)
- **Worker**: `southernpets` ✅ **PRESERVED**
- **Location**: `tenants/southernpets/src/worker.js`
- **Config**: `tenants/southernpets/wrangler.jsonc`
- **UI**: Nonprofit branding (placeholder - customize for animal rescue)
- **Status**: ⏳ Setup needed - **PRESERVE NONPROFIT BRANDING**
- **URL**: https://southernpets.meauxbility.workers.dev (after deploy)

## 🔒 Isolation Guarantees

### 1. Separate Workers
Each tenant has its own Cloudflare Worker:
- `inneranimalmedia` → Inner Animal Media
- `southernpets` → Southern Pets
- `meauxlearn` → MeauxLearn
- `fuelnfreetime` → Fuel & Free Time

### 2. Subdomain Routing
- Each tenant gets unique subdomain
- No cross-tenant routing
- Workers are completely isolated

### 3. UI Preservation
- **Inner Animal Media**: Uses existing worker code (not modified)
- **Southern Pets**: Has dedicated worker (nonprofit branding preserved)
- **MeauxLearn**: Separate worker (course platform UI)
- **Fuel & Free Time**: Separate worker (galaxy theme)

### 4. Database Isolation
- Inner Animal Media: Uses various D1 databases
- Southern Pets: Uses `southernpetsanimalrescue` D1 database
- MeauxLearn: Uses `meaux-work-db` D1 database (with tenant_id filtering)
- Fuel & Free Time: Uses `meaux-work-db` D1 database

## 🚫 What Does NOT Override Nonprofit UI

1. **MeauxLearn worker** (`fuelnfreetime.js` or `tenants/meauxlearn/src/worker.js`)
   - Only serves on `meauxlearn.meauxbility.workers.dev` or `fuelnfreetime.meauxbility.workers.dev`
   - Does NOT affect `inneranimalmedia.meauxbility.workers.dev`
   - Does NOT affect `southernpets.meauxbility.workers.dev`

2. **Tenant Router** (`src/tenant-router.js`)
   - Only for detection/routing logic
   - Does NOT modify existing workers

3. **Monorepo Structure** (`tenants/` directory)
   - Organizational only
   - Does NOT change existing worker behavior

## ✅ Verification Checklist

- [x] Inner Animal Media worker (`src/inneranimalmedia.js`) unchanged
- [x] Inner Animal Media config (`wrangler.inneranimalmedia.jsonc`) unchanged
- [x] Inner Animal Media UI files in R2 (not overridden)
- [x] Southern Pets has dedicated worker (nonprofit branding)
- [x] MeauxLearn has separate worker (course platform)
- [x] Fuel & Free Time has separate worker (galaxy theme)
- [x] Each tenant has unique subdomain
- [x] No cross-tenant interference

## 📝 Current Worker Mapping

| Subdomain | Worker File | UI Source | Status |
|-----------|-------------|-----------|--------|
| `inneranimalmedia.meauxbility.workers.dev` | `src/inneranimalmedia.js` | R2: `inneranimalmedia-*.html` | ✅ Preserved |
| `southernpets.meauxbility.workers.dev` | `tenants/southernpets/src/worker.js` | Custom (nonprofit) | ⏳ Setup |
| `meauxlearn.meauxbility.workers.dev` | `tenants/meauxlearn/src/worker.js` | Embedded HTML | ✅ Active |
| `fuelnfreetime.meauxbility.workers.dev` | `src/fuelnfreetime.js` | Embedded HTML | ✅ Active |

## 🎯 Summary

**Nonprofit UIs are SAFE and PRESERVED:**
- ✅ Inner Animal Media: Production worker unchanged
- ✅ Southern Pets: Dedicated worker with nonprofit branding
- ✅ No generic templates override nonprofit UIs
- ✅ Each tenant is completely isolated

**Repository**: `SamPrimeaux/meauxbilityv2`  
**Structure**: Multi-tenant monorepo  
**Status**: ✅ Ready for deployment
