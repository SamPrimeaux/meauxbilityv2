# Update Cloudflare Worker Git Repository Connection

## 🎯 Goal
Update the `inneranimalmedia` worker's Git repository connection from:
- ❌ `SamPrimeaux/inneranimalmedia-app-library` (current)
- ✅ `SamPrimeaux/meauxbilityv2` (target)

## 🚀 Direct Link to Update

**Click this link to go directly to the settings page:**
```
https://dash.cloudflare.com/ede6590ac0d2fb7daf155b35653457b2/workers/services/view/inneranimalmedia/settings/builds
```

## 📋 Step-by-Step Instructions

### Step 1: Navigate to Builds Settings
1. Click the link above, OR
2. Go to: https://dash.cloudflare.com/
3. Navigate to: **Workers & Pages** → **inneranimalmedia** → **Settings** → **Builds**

### Step 2: Disconnect Current Repository
1. Find the **Git Repository** section
2. You should see: `SamPrimeaux/inneranimalmedia-app-library`
3. Click **Disconnect** or **Remove** button
4. Confirm the disconnection

### Step 3: Connect New Repository
1. Click **Connect to Git** or **Connect Repository** button
2. Select **GitHub** as the provider
3. If prompted, authorize Cloudflare to access your GitHub account
4. Search for: `meauxbilityv2`
5. Select: `SamPrimeaux/meauxbilityv2`
6. Configure build settings:
   - **Root directory**: `/`
   - **Production branch**: `main`
   - **Build command**: (leave empty - GitHub Actions handles deployment)
   - **Deploy command**: (leave empty)
7. Click **Save** or **Connect**

### Step 4: Verify
After connecting, you should see:
- ✅ Repository: `SamPrimeaux/meauxbilityv2`
- ✅ Branch: `main`
- ✅ Status: Connected

## ✅ What This Does

- **Cloudflare Git Integration**: Will auto-deploy when you push to `main` branch
- **GitHub Actions**: Will continue to work independently (already configured)
- **Both systems**: Can deploy the worker (redundancy is good!)

## 📝 Notes

- The Cloudflare Git connection is **optional** - GitHub Actions already handles deployments
- Having both means you have **two deployment methods** (more reliable)
- If you prefer only GitHub Actions, you can leave the Cloudflare connection disconnected

## 🔗 Quick Links

- **Worker Dashboard**: https://dash.cloudflare.com/ede6590ac0d2fb7daf155b35653457b2/workers/services/view/inneranimalmedia
- **Builds Settings**: https://dash.cloudflare.com/ede6590ac0d2fb7daf155b35653457b2/workers/services/view/inneranimalmedia/settings/builds
- **GitHub Repo**: https://github.com/SamPrimeaux/meauxbilityv2
- **GitHub Actions**: https://github.com/SamPrimeaux/meauxbilityv2/actions
