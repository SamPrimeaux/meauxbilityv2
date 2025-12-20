# Inner Animal Media Tenant

Nonprofit media agency tenant.

## Configuration

- **Worker Name**: `inneranimalmedia`
- **Subdomain**: `inneranimalmedia.meauxbility.workers.dev`
- **Custom Domain**: `inneranimal.app` (configured)
- **D1 Database**: Various (see D1_DATABASES_LIST.md)
- **R2 Bucket**: `inneranimalmedia`

## Deployment

```bash
npm run deploy:inneranimalmedia
```

## Status

✅ Production - UI PRESERVED

## Notes

- **PRESERVE UI**: This tenant's UI is production-ready and should NOT be overridden
- Uses existing `src/inneranimalmedia.js` worker
- Serves from R2 bucket `inneranimalmedia`
- Has custom domain `inneranimal.app` configured

## Files

- Worker: `src/inneranimalmedia.js` (root level)
- Config: `wrangler.inneranimalmedia.jsonc` (root level)
- UI: Served from R2 bucket
