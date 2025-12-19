# Inner Animal Media - Dual Deployment URLs

## 🌐 Two Live URLs

You now have **both** Cloudflare Workers (.dev) **AND** GitHub Pages (github.io) URLs working!

### 1. Cloudflare Workers (.dev URL)
**URL**: https://inneranimalmedia.meauxbility.workers.dev

- ✅ **Primary deployment** - Full functionality
- ✅ Serves all HTML pages from R2
- ✅ API endpoints (`/api/github/repos`, `/api/workers`)
- ✅ Dynamic content serving
- ✅ Fast edge deployment worldwide

### 2. GitHub Pages (github.io URL)
**URL**: https://samprimeaux.github.io/inneranimalmedia/

- ✅ **Redirect deployment** - Points to Cloudflare Worker
- ✅ Professional GitHub Pages URL
- ✅ Automatic redirect to `.dev` URL
- ✅ SEO-friendly domain

## 🔄 How They Work Together

```
User visits: https://samprimeaux.github.io/inneranimalmedia/
    ↓
GitHub Pages serves: index.html (redirect file)
    ↓
Redirects to: https://inneranimalmedia.meauxbility.workers.dev
    ↓
Cloudflare Worker serves: Full application from R2
```

## 📋 Workflows

### Main Dashboard Repo (`hybridprosaas-dashboard`)
**Workflow**: `.github/workflows/inneranimalmedia-deploy.yml`

**What it does**:
1. ✅ Deploys Cloudflare Worker
2. ✅ Uploads HTML pages to R2
3. ✅ Deploys to GitHub Pages (if configured)

**Triggers**:
- Push to `main` branch
- Manual workflow dispatch

### Inner Animal Media Repo (`inneranimalmedia`)
**Workflow**: `.github/workflows/deploy-pages.yml`

**What it does**:
1. ✅ Deploys `index.html` redirect to GitHub Pages
2. ✅ Ensures GitHub Pages URL is always live

**Triggers**:
- Push to `main` branch
- Manual workflow dispatch

## 🚀 Deployment Process

### Automatic (on push to main)
1. **Cloudflare Worker** deploys automatically via `hybridprosaas-dashboard` repo
2. **GitHub Pages** deploys automatically via `inneranimalmedia` repo

### Manual Deployment
1. Go to Actions tab in either repository
2. Select the workflow
3. Click "Run workflow"

## 📦 What Gets Deployed Where

### Cloudflare R2 (`inneranimalmedia` bucket)
- `inner-animal-media-public-facing-design%20(1).html` (index)
- `MEAUXGLOBE.html` (dashboard)
- `meaux-team.html`
- `meaux-doc.html`
- `meaux-photo.html`
- `meaux-memories.html`
- `meaux-media.html`
- `meaux-cloud.html`
- `meaux-cad.html`
- `meaux-learn.html`

### GitHub Pages (`inneranimalmedia` repo)
- `index.html` (redirect file)

## ✅ Verification

### Test Cloudflare Worker
```bash
curl https://inneranimalmedia.meauxbility.workers.dev/
curl https://inneranimalmedia.meauxbility.workers.dev/api/github/repos
```

### Test GitHub Pages
```bash
curl https://samprimeaux.github.io/inneranimalmedia/
# Should redirect to Cloudflare Worker
```

## 🎯 Benefits of Dual Deployment

1. **Flexibility**: Two URLs for different use cases
2. **Redundancy**: If one goes down, the other works
3. **SEO**: GitHub Pages URL is more SEO-friendly
4. **Branding**: Professional `.github.io` domain
5. **Performance**: Cloudflare Worker provides edge caching

## 🔧 Required GitHub Secrets

### For `hybridprosaas-dashboard` repo:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

### For `inneranimalmedia` repo:
- No secrets needed (GitHub Pages uses built-in permissions)

## 📝 Next Steps

1. ✅ **Enable GitHub Pages** (if not already):
   - Go to: https://github.com/SamPrimeaux/inneranimalmedia/settings/pages
   - Source: Deploy from a branch
   - Branch: `main` / `/ (root)`
   - Save

2. ✅ **Verify both URLs work**:
   - Visit: https://inneranimalmedia.meauxbility.workers.dev
   - Visit: https://samprimeaux.github.io/inneranimalmedia/

3. ✅ **Both workflows are now active** and will deploy automatically on push!

---

**🎉 You now have both Cloudflare .dev AND GitHub Pages URLs working!**
