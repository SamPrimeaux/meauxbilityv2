# MeauxCAD Tenant

CAD and design tools platform.

## Configuration

- **Worker Name**: `meauxcad`
- **Subdomain**: `meauxcad.meauxbility.workers.dev`
- **Custom Domain**: `meauxcad.dev` (optional)
- **D1 Database**: `meaux-work-db`
- **R2 Bucket**: `inneranimalmedia` (shared)

## UI

Serves `meaux-cad.html` from R2 (preserves existing UI).

## Deployment

```bash
npm run deploy:meauxcad
```
