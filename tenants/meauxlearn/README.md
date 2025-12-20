# MeauxLearn Tenant

Professional course platform tenant.

## Configuration

- **Worker Name**: `meauxlearn`
- **Subdomain**: `meauxlearn.meauxbility.workers.dev`
- **Custom Domain**: `meauxlearn.dev` (optional)
- **D1 Database**: `meaux-work-db`
- **R2 Bucket**: `inneranimalmedia` (shared)

## Deployment

```bash
npm run deploy:meauxlearn
```

Or via GitHub Actions (auto-deploys on push).

## Features

- Multi-tenant course platform
- 14 courses included
- Progress tracking
- Beautiful iOS-level UI
- Cloudflare D1 + R2 (NO Supabase)

## Database Setup

See `database/meauxlearn-schema.sql` and `database/meauxlearn-seed.sql`

## Status

✅ Active (migrated from fuelnfreetime worker)
