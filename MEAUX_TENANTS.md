# Meaux Module Tenants

Complete list of all Meaux module tenants in the monorepo.

## 📋 All Meaux Tenants

| Tenant | Worker | Subdomain | UI Source | Status |
|--------|--------|-----------|----------|--------|
| **meauxbility** | `meauxbility` | `meauxbility.meauxbility.workers.dev` | R2: `MEAUXGLOBE.html` | ⏳ Ready |
| **meauxcad** | `meauxcad` | `meauxcad.meauxbility.workers.dev` | R2: `meaux-cad.html` | ⏳ Ready |
| **meauxwork** | `meauxwork` | `meauxwork.meauxbility.workers.dev` | R2: `meauxmcp.html` | ⏳ Ready |
| **meauxcloud** | `meauxcloud` | `meauxcloud.meauxbility.workers.dev` | R2: `meaux-cloud.html` | ⏳ Ready |
| **meauxmcp** | `meauxmcp` | `meauxmcp.meauxbility.workers.dev` | R2: MCP pages | ⏳ Ready |
| **meauxresearch** | `meauxresearch` | `meauxresearch.meauxbility.workers.dev` | Embedded | ⏳ Ready |
| **meauxexplore** | `meauxexplore` | `meauxexplore.meauxbility.workers.dev` | Embedded | ⏳ Ready |
| **meauxcreate** | `meauxcreate` | `meauxcreate.meauxbility.workers.dev` | Embedded | ⏳ Ready |
| **meauxmoney** | `meauxmoney` | `meauxmoney.meauxbility.workers.dev` | R2: `meaux-wallet.html` | ⏳ Ready |
| **meauxlearn** | `meauxlearn` | `meauxlearn.meauxbility.workers.dev` | Embedded (course platform) | ✅ Active |

## 🚀 Deploy All Meaux Tenants

```bash
npm run deploy:meauxbility
npm run deploy:meauxcad
npm run deploy:meauxwork
npm run deploy:meauxcloud
npm run deploy:meauxmcp
npm run deploy:meauxresearch
npm run deploy:meauxexplore
npm run deploy:meauxcreate
npm run deploy:meauxmoney
npm run deploy:meauxlearn
```

Or deploy all at once:
```bash
npm run deploy:all
```

## 📁 Tenant Structure

Each tenant has:
- `wrangler.jsonc` - Worker configuration
- `src/worker.js` - Worker code
- `README.md` - Tenant documentation

## 🔗 URLs

Once deployed, each tenant will be available at:
- `https://{tenant}.meauxbility.workers.dev`
- `https://{tenant}.dev` (if custom domain configured)

## ✅ UI Preservation

Tenants that serve existing HTML from R2:
- ✅ **meauxbility** - Serves `MEAUXGLOBE.html`
- ✅ **meauxcad** - Serves `meaux-cad.html`
- ✅ **meauxwork** - Serves `meauxmcp.html`
- ✅ **meauxcloud** - Serves `meaux-cloud.html`
- ✅ **meauxmcp** - Serves MCP pages
- ✅ **meauxmoney** - Serves `meaux-wallet.html`

Tenants with embedded UI (can be customized):
- **meauxresearch** - Research platform
- **meauxexplore** - Exploration platform
- **meauxcreate** - Creative platform
- **meauxlearn** - Course platform

## 🎯 Next Steps

1. Deploy all tenants: `npm run deploy:all`
2. Verify each subdomain works
3. Customize embedded UIs as needed
4. Set up custom `.dev` domains (optional)
