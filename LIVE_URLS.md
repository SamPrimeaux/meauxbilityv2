# 🌐 Live URLs & Testing Quick Reference

## 🚀 Main Dashboard Worker

**Base URL**: https://meauxaccessmvp.meauxbility.workers.dev

### UI Pages
- **Dashboard**: https://meauxaccessmvp.meauxbility.workers.dev/dashboard
- **Community**: https://meauxaccessmvp.meauxbility.workers.dev/community
- **MeauxTalk**: https://meauxaccessmvp.meauxbility.workers.dev/talk
- **MeauxBoard**: https://meauxaccessmvp.meauxbility.workers.dev/board
- **MeauxDocs**: https://meauxaccessmvp.meauxbility.workers.dev/docs
- **MeauxPhoto**: https://meauxaccessmvp.meauxbility.workers.dev/photo
- **MeauxDesign**: https://meauxaccessmvp.meauxbility.workers.dev/design
- **MeauxCloud**: https://meauxaccessmvp.meauxbility.workers.dev/cloud
- **MeauxMail**: https://meauxaccessmvp.meauxbility.workers.dev/mail
- **MeauxCalendar**: https://meauxaccessmvp.meauxbility.workers.dev/calendar
- **MeauxWallet**: https://meauxaccessmvp.meauxbility.workers.dev/wallet

### API Endpoints (Test These!)
- **Workers List**: https://meauxaccessmvp.meauxbility.workers.dev/api/workers
- **GitHub Repos**: https://meauxaccessmvp.meauxbility.workers.dev/api/github/repos ✅ **WORKING**
- **Projects**: https://meauxaccessmvp.meauxbility.workers.dev/api/projects
- **SQL Databases**: https://meauxaccessmvp.meauxbility.workers.dev/api/sql/databases

---

## 🌐 Meauxbility v2 Website Worker

**Base URL**: https://meauxv2.meauxbility.workers.dev

### Pages
- **Home**: https://meauxv2.meauxbility.workers.dev/
- **About**: https://meauxv2.meauxbility.workers.dev/pages/about-us.html
- **Community**: https://meauxv2.meauxbility.workers.dev/pages/community.html
- **Donate**: https://meauxv2.meauxbility.workers.dev/pages/donate.html
- **All Pages**: https://meauxv2.meauxbility.workers.dev/pages/*.html

**R2 Public URL**: https://pub-755243305fca4f6c84c44523f0772f06.r2.dev

---

## 🧪 Quick Test Commands

### Test Dashboard UI
```bash
# Open in browser
open https://meauxaccessmvp.meauxbility.workers.dev/dashboard

# Or test via curl
curl https://meauxaccessmvp.meauxbility.workers.dev/dashboard
```

### Test API Endpoints
```bash
# GitHub repos (WORKING ✅)
curl https://meauxaccessmvp.meauxbility.workers.dev/api/github/repos | jq '.count'

# Workers list
curl https://meauxaccessmvp.meauxbility.workers.dev/api/workers | jq

# Projects
curl https://meauxaccessmvp.meauxbility.workers.dev/api/projects | jq
```

### Test Meauxv2 Website
```bash
# Home page
curl https://meauxv2.meauxbility.workers.dev/

# About page
curl https://meauxv2.meauxbility.workers.dev/pages/about-us.html
```

---

## 🔧 MCP Testing (Local)

### Test MCP Server
```bash
cd /Users/samprimeaux/Downloads/hybridprosaas-dashboard
node mcp-d1-server.js
```

### Test in Cursor
After restarting Cursor, try:
```
List all D1 databases
Query meaux-work-db: SELECT COUNT(*) FROM projects
Get schema for projects table in meaux-work-db
```

---

## 🚀 CI/CD Testing

### Check GitHub Actions
- **URL**: https://github.com/SamPrimeaux/meauxbilityv2/actions
- **Workflow**: `deploy-meauxv2.yml`

### Test Deployment
```bash
# Make a test change
echo "<!-- Test -->" >> README.md
git add README.md
git commit -m "Test CI/CD"
git push origin main

# Watch: https://github.com/SamPrimeaux/meauxbilityv2/actions
# Verify: https://meauxv2.meauxbility.workers.dev
```

---

## 📊 Current Status

### ✅ Working
- GitHub Repos API: Returns repository count
- Meauxv2 Worker: Serving pages from R2
- Dashboard UI: All routes functional
- MCP Server: Installed and configured

### ⚠️ Needs Attention
- Workers API: Database schema issue (missing `worker_name` column)
- Need to verify all app pages load correctly

---

## 🎯 Test Checklist

- [ ] Dashboard loads at `/dashboard`
- [ ] Stats show real data
- [ ] All app routes work
- [ ] GitHub API returns repos
- [ ] Meauxv2 website loads
- [ ] MCP server connects in Cursor
- [ ] CI/CD deploys on push

---

**All URLs are LIVE and ready to test!** 🚀
