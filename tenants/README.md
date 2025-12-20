# Tenants Directory

Multi-tenant monorepo structure. Each tenant has isolated:
- Worker code
- UI/UX
- Configuration
- Assets

## Current Tenants

### 1. Inner Animal Media (Nonprofit)
- **Directory**: `inneranimalmedia/`
- **Worker**: `inneranimalmedia`
- **Subdomain**: `inneranimalmedia.meauxbility.workers.dev`
- **Status**: ✅ Production
- **UI**: Professional business dashboard (PRESERVED)

### 2. Southern Pets Animal Rescue (Nonprofit)
- **Directory**: `southernpets/`
- **Worker**: `southernpets`
- **Subdomain**: `southernpets.meauxbility.workers.dev`
- **Status**: ⏳ Setup needed
- **UI**: Nonprofit branding (PRESERVED)

### 3. MeauxLearn
- **Directory**: `meauxlearn/`
- **Worker**: `meauxlearn` (currently on `fuelnfreetime`)
- **Subdomain**: `meauxlearn.meauxbility.workers.dev`
- **Status**: ⏳ Migrate from fuelnfreetime
- **UI**: Fortune 500-grade iOS design

### 4. Fuel & Free Time
- **Directory**: `fuelnfreetime/`
- **Worker**: `fuelnfreetime`
- **Subdomain**: `fuelnfreetime.meauxbility.workers.dev`
- **Status**: ✅ Active
- **UI**: Galaxy theme landing

## Adding a New Tenant

1. Create directory: `tenants/{tenant-name}/`
2. Copy structure from existing tenant
3. Update `src/tenant-router.js`
4. Add deployment workflow
5. Deploy
