# 🔧 Fix GitHub Token - Repos Not Loading

## Current Issue
The GitHub token is returning "Bad credentials" (401 error). This means either:
- The token is expired
- The token was revoked
- The token doesn't have the right permissions
- The token in Cloudflare is incorrect

## Solution 1: Update Token in Cloudflare Dashboard

### Quick Steps:
1. **Open**: https://dash.cloudflare.com/ede6590ac0d2fb7daf155b35653457b2/workers/services/view/inneranimalmedia/settings/variables

2. **Find** `GITHUB_TOKEN` in the Secrets section

3. **Click Edit** (pencil icon)

4. **Update the token** with one of these options:
   - Use the InnerAnimal GitHub token (get from secure storage)
   - OR generate a new token (see Solution 2 below)

5. **Save** and wait 10-15 seconds

6. **Test**: Visit https://inneranimalmedia.meauxbility.workers.dev/api/github/repos

---

## Solution 2: Generate New GitHub Token

If the token doesn't work, create a new one:

### Steps:
1. Go to: https://github.com/settings/tokens?type=beta
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. **Name**: `InnerAnimal Media Dashboard`
4. **Expiration**: Choose your preference (90 days recommended)
5. **Scopes**: Check these:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `read:org` (Read org and team membership)
6. Click **"Generate token"**
7. **Copy the token immediately** (you won't see it again!)
8. Update it in Cloudflare Dashboard (Solution 1, step 4)

---

## Solution 3: Verify Token Works

Test the token before adding it to Cloudflare:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     -H "Accept: application/vnd.github.v3+json" \
     "https://api.github.com/user/repos?per_page=1"
```

If you see repository data (not "Bad credentials"), the token works!

---

## After Updating

Once the token is updated in Cloudflare:
- Wait 10-15 seconds for propagation
- Visit: https://inneranimalmedia.meauxbility.workers.dev/api/github/repos
- You should see all 50 InnerAnimal repositories in a beautiful styled page!

---

## Need Help?

If the token still doesn't work after updating:
1. Verify the token is correct (no extra spaces, copied fully)
2. Check token hasn't expired
3. Verify token has `repo` scope permissions
4. Try generating a fresh token (Solution 2)
