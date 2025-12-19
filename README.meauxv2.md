# Meauxbility v2 - R2 + Cloudflare Worker

This repository contains the Meauxbility website served from Cloudflare R2 via a Cloudflare Worker.

## 🚀 Live URLs

- **Worker**: https://meauxv2.meauxbility.workers.dev
- **R2 Public**: https://pub-755243305fca4f6c84c44523f0772f06.r2.dev
- **Home Page**: https://meauxv2.meauxbility.workers.dev/ (serves `index.html`)

## 📁 Structure

```
R2 Bucket: meauxbilityv2
├── index.html              # Home page (served at /)
└── pages/
    ├── about-us.html
    ├── community.html
    ├── donate.html
    └── ... (other pages)
```

## 🔧 Setup

### Required GitHub Secrets

- `CLOUDFLARE_API_TOKEN` - Cloudflare API token with R2:Edit permissions
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID
- `R2_BUCKET_NAME` - Set to `meauxbilityv2`

### Local Development

```bash
# Install Wrangler
npm install -g wrangler

# Deploy worker
wrangler deploy --config wrangler.meauxv2.jsonc
```

## 🔄 CI/CD

The GitHub Actions workflow automatically deploys the worker on push to `main` branch.

Workflow file: `.github/workflows/deploy-meauxv2.yml`

## 📝 Routing

- `/` → `index.html`
- `/pages/*.html` → `pages/*.html`
- `/about-us` → `about-us.html` (auto-adds .html if missing)

## 🎯 Worker Details

- **Name**: `meauxv2`
- **R2 Bucket**: `meauxbilityv2`
- **Binding**: `R2_MEAUXBILITYV2`
