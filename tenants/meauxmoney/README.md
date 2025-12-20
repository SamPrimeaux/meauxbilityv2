# MeauxMoney Tenant

Financial and payment platform.

## Configuration

- **Worker Name**: `meauxmoney`
- **Subdomain**: `meauxmoney.meauxbility.workers.dev`
- **Custom Domain**: `meauxmoney.dev` (optional)
- **D1 Database**: `meaux-work-db`
- **R2 Bucket**: `inneranimalmedia` (shared)

## UI

Serves `meaux-wallet.html` from R2 (preserves existing UI).

## Deployment

```bash
npm run deploy:meauxmoney
```
