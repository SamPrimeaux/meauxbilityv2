# MeauxCloud Tenant

Cloud storage and projects platform.

## Configuration

- **Worker Name**: `meauxcloud`
- **Subdomain**: `meauxcloud.meauxbility.workers.dev`
- **Custom Domain**: `meauxcloud.dev` (optional)
- **D1 Database**: `meaux-work-db`
- **R2 Bucket**: `inneranimalmedia` (shared)

## UI

Serves `meaux-cloud.html` from R2 (preserves existing UI).

## Deployment

```bash
npm run deploy:meauxcloud
```
