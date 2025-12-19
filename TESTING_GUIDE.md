# 🧪 Testing Guide - Live Workers & MCP/CI/CD

## 🌐 Live Workers & URLs

### 1. Main Dashboard Worker
**URL**: https://meauxaccessmvp.meauxbility.workers.dev

**Routes**:
- `/` or `/dashboard` → Main dashboard UI
- `/talk` → MeauxTalk app
- `/board` → MeauxBoard app
- `/docs` → MeauxDocs app
- `/photo` → MeauxPhoto app
- `/design` → MeauxDesign app
- `/cloud` → MeauxCloud app
- `/mail` → MeauxMail app
- `/calendar` → MeauxCalendar app
- `/wallet` → MeauxWallet app
- `/community` → Community hub

**API Endpoints**:
- `/api/workers` → List all Cloudflare Workers
- `/api/github/repos` → List GitHub repositories
- `/api/projects` → D1 database projects

### 2. Meauxbility v2 Website Worker
**URL**: https://meauxv2.meauxbility.workers.dev

**Routes**:
- `/` → Home page (index.html from R2)
- `/pages/about-us.html` → About page
- `/pages/community.html` → Community page
- `/pages/donate.html` → Donate page
- `/pages/*.html` → All other pages

**R2 Public URL**: https://pub-755243305fca4f6c84c44523f0772f06.r2.dev

---

## 🧪 Testing the UI

### Test Main Dashboard

1. **Open**: https://meauxaccessmvp.meauxbility.workers.dev/dashboard

2. **Check Stats Cards**:
   - Should show real worker count (124)
   - Should show project count
   - Should show GitHub builds count

3. **Test Navigation**:
   - Click app tiles (MeauxTalk, MeauxBoard, etc.)
   - Verify routes work: `/talk`, `/board`, `/docs`, etc.

4. **Test API Integration**:
   - Open browser console (F12)
   - Check Network tab for API calls
   - Verify `/api/workers` returns data
   - Verify `/api/github/repos` returns data

### Test Meauxv2 Website

1. **Open**: https://meauxv2.meauxbility.workers.dev/

2. **Test Routes**:
   - `/` → Should show index.html
   - `/pages/about-us.html` → Should show about page
   - `/pages/donate.html` → Should show donate page

3. **Verify R2 Serving**:
   - All pages should load from R2 bucket
   - Check Network tab for R2 URLs

---

## 🔧 Testing MCP (Model Context Protocol)

### Local Testing

1. **Test Server Directly**:
   ```bash
   cd /Users/samprimeaux/Downloads/hybridprosaas-dashboard
   node mcp-d1-server.js
   ```
   (This will run on stdio - normal for MCP)

2. **Test in Cursor**:
   After restarting Cursor, try these commands:
   ```
   List all D1 databases
   List tables in meaux-work-db
   Get schema for projects table in meaux-work-db
   Query meaux-work-db: SELECT COUNT(*) FROM projects
   ```

### Verify MCP Connection

1. **Check Cursor MCP Status**:
   - Look for MCP server indicator in Cursor
   - Check Cursor logs for connection status

2. **Test Tools**:
   - `d1_list_databases` should return 12 databases
   - `d1_list_tables` should list tables
   - `d1_query` should execute SQL

---

## 🚀 Testing CI/CD

### GitHub Actions

1. **Check Workflow Status**:
   - Go to: https://github.com/SamPrimeaux/meauxbilityv2/actions
   - Verify `deploy-meauxv2.yml` runs on push

2. **Test Deployment**:
   ```bash
   # Make a small change
   echo "# Test" >> README.md
   git add README.md
   git commit -m "Test CI/CD"
   git push origin main
   ```
   - Watch GitHub Actions run
   - Verify worker deploys automatically

3. **Verify Deployment**:
   - Check: https://meauxv2.meauxbility.workers.dev
   - Should update within 1-2 minutes

### Manual Deployment Test

```bash
# Test meauxv2 worker deployment
export CLOUDFLARE_API_TOKEN="y1MUpWJDYFQbGcLTVb2Z_L_f3YDt1fGWCoQqgCwF"
npx wrangler deploy --config wrangler.meauxv2.jsonc
```

---

## 🖥️ Testing CLI Powers

### Wrangler CLI

1. **List R2 Objects**:
   ```bash
   npx wrangler r2 object put meauxbilityv2/test.html --file=test.html
   ```

2. **Deploy Worker**:
   ```bash
   npx wrangler deploy
   ```

3. **View Logs**:
   ```bash
   npx wrangler tail
   ```

### Test API Endpoints via CLI

```bash
# Test workers API
curl https://meauxaccessmvp.meauxbility.workers.dev/api/workers

# Test GitHub repos API
curl https://meauxaccessmvp.meauxbility.workers.dev/api/github/repos

# Test projects API
curl https://meauxaccessmvp.meauxbility.workers.dev/api/projects
```

---

## 📊 Quick Test Checklist

### ✅ UI Functionality
- [ ] Dashboard loads at `/dashboard`
- [ ] Stats show real data (workers, projects, GitHub)
- [ ] All app routes work (`/talk`, `/board`, etc.)
- [ ] Community page loads
- [ ] Meauxv2 website loads at root

### ✅ API Endpoints
- [ ] `/api/workers` returns worker list
- [ ] `/api/github/repos` returns repositories
- [ ] `/api/projects` returns D1 projects

### ✅ MCP Server
- [ ] Cursor connects to MCP server
- [ ] `d1_list_databases` works
- [ ] `d1_query` executes SQL
- [ ] Can explore all 12 databases

### ✅ CI/CD
- [ ] GitHub Actions workflow exists
- [ ] Pushing to main triggers deployment
- [ ] Worker deploys successfully
- [ ] Changes appear on live site

### ✅ R2 Storage
- [ ] Pages serve from R2
- [ ] Meauxv2 bucket accessible
- [ ] Public URLs work

---

## 🔍 Debugging

### Check Worker Logs

```bash
# Tail live logs
npx wrangler tail meauxaccessmvp

# Or for meauxv2
npx wrangler tail meauxv2
```

### Check Browser Console

1. Open: https://meauxaccessmvp.meauxbility.workers.dev/dashboard
2. Press F12 → Console tab
3. Look for errors or API responses

### Test MCP Server Manually

```bash
# Check if server starts
cd /Users/samprimeaux/Downloads/hybridprosaas-dashboard
node -e "import('./mcp-d1-server.js')"
```

---

## 🎯 Quick Test Commands

```bash
# Test main dashboard
open https://meauxaccessmvp.meauxbility.workers.dev/dashboard

# Test meauxv2 website
open https://meauxv2.meauxbility.workers.dev

# Test API
curl https://meauxaccessmvp.meauxbility.workers.dev/api/workers | jq

# Check worker status
npx wrangler deployments list meauxaccessmvp
npx wrangler deployments list meauxv2
```

---

## 📝 Expected Results

### Dashboard Stats Should Show:
- **Total Projects**: Number from D1 database
- **Active Workers**: 124 (from Cloudflare API)
- **GitHub Builds**: Number of repositories

### MCP Should Return:
- **12 databases** when listing
- **Table lists** for each database
- **Query results** from SQL execution

### CI/CD Should:
- **Auto-deploy** on push to main
- **Update worker** within 1-2 minutes
- **Show success** in GitHub Actions

---

**Ready to test!** 🚀
