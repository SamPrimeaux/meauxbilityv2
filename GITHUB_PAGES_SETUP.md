# GitHub Pages Setup for Inner Animal Media

## 🎯 Goal

Set up https://samprimeaux.github.io/inneranimalmedia/ to work with the same functionality as other workers.

## ✅ What's Already Done

1. **Cloudflare Worker Deployed**: https://inneranimalmedia.meauxbility.workers.dev
2. **Worker has GitHub API + Cloudflare API access**
3. **R2 bucket configured**: `inneranimalmedia-assets`
4. **Index page uploaded to R2**

## 📝 GitHub Pages Setup

### Option 1: Redirect to Worker (Recommended)

1. **Clone the inneranimalmedia repo**:
   ```bash
   git clone https://github.com/SamPrimeaux/inneranimalmedia.git
   cd inneranimalmedia
   ```

2. **Copy the redirect file**:
   ```bash
   cp /Users/samprimeaux/Downloads/hybridprosaas-dashboard/github-pages-index.html index.html
   ```

3. **Commit and push**:
   ```bash
   git add index.html
   git commit -m "Add GitHub Pages redirect to worker"
   git push origin main
   ```

4. **Enable GitHub Pages**:
   - Go to: https://github.com/SamPrimeaux/inneranimalmedia/settings/pages
   - Source: Deploy from a branch
   - Branch: `main` / `/ (root)`
   - Save

### Option 2: Serve Static Site from GitHub Pages

If you want to serve content directly from GitHub Pages:

1. **Create `index.html` in repo root** (use `inneranimalmedia-index.html` as template)
2. **Enable GitHub Pages** in repo settings
3. **Update API calls** to use worker URL:
   ```javascript
   fetch('https://inneranimalmedia.meauxbility.workers.dev/api/workers')
   ```

## 🔧 Worker Configuration

**Worker Name**: `inneranimalmedia`  
**Worker URL**: https://inneranimalmedia.meauxbility.workers.dev  
**R2 Bucket**: `inneranimalmedia-assets`

### API Endpoints Available

- `/api/workers` - List Cloudflare Workers
- `/api/github/repos` - List GitHub repositories
- `/` - Serves `index.html` from R2

## 🧪 Testing

### Test Worker Directly
```bash
# Test home page
curl https://inneranimalmedia.meauxbility.workers.dev/

# Test GitHub API
curl https://inneranimalmedia.meauxbility.workers.dev/api/github/repos

# Test Workers API
curl https://inneranimalmedia.meauxbility.workers.dev/api/workers
```

### Test GitHub Pages
After setup, visit:
- https://samprimeaux.github.io/inneranimalmedia/

Should redirect to worker or serve content.

## 🔄 CI/CD

The workflow `.github/workflows/deploy-inneranimalmedia.yml` will:
- Deploy worker on push
- Upload index.html to R2
- Keep everything in sync

## 📦 Files Created

- `wrangler.inneranimalmedia.jsonc` - Worker config
- `src/inneranimalmedia.js` - Worker code
- `inneranimalmedia-index.html` - Home page (uploaded to R2)
- `github-pages-index.html` - Redirect file for GitHub Pages
- `.github/workflows/deploy-inneranimalmedia.yml` - CI/CD workflow

---

**Worker is LIVE**: https://inneranimalmedia.meauxbility.workers.dev ✅
