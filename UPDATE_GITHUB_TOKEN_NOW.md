# ⚠️ URGENT: Update GitHub Token - Repos Not Loading

## Current Error
```
"Bad credentials" - GitHub API returning 401
```

## Quick Fix - Update Token in Cloudflare Dashboard

### Step 1: Open Cloudflare Dashboard
**Direct Link**: https://dash.cloudflare.com/ede6590ac0d2fb7daf155b35653457b2/workers/services/view/inneranimalmedia/settings/variables

### Step 2: Update GITHUB_TOKEN Secret

1. Scroll down to **"Variables and Secrets"** section
2. Find **`GITHUB_TOKEN`** in the Secrets list
3. Click the **pencil/edit icon** next to it
4. **Delete the old token value**
5. **Paste the new InnerAnimal GitHub token** (get from secure storage)
6. Click **Save**

### Step 3: Test
After saving, wait 10-15 seconds, then test:
```bash
curl https://inneranimalmedia.meauxbility.workers.dev/api/github/repos
```

Or visit in browser:
https://inneranimalmedia.meauxbility.workers.dev/api/github/repos

You should see 50 InnerAnimal repositories!

---

## Alternative: If GITHUB_TOKEN Doesn't Exist

If you don't see `GITHUB_TOKEN` in the secrets list:

1. Click **"Add Secret"** button
2. **Name**: `GITHUB_TOKEN`
3. **Value**: (Get from secure storage - InnerAnimal GitHub token)
4. Click **Save**

---

## Token Details
- **Account**: InnerAnimal (info@inneranimals.com)
- **Expected Repos**: 50 repositories
- **Token Type**: GitHub Personal Access Token

---

## Why This Is Needed

The current token in Cloudflare is either:
- Expired
- Invalid
- Not set

The new token has been verified and works with the InnerAnimal GitHub account.
