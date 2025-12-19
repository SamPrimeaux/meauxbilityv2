# Setting Up API Credentials for Inner Animal Media Worker

## ✅ Quick Setup (Cloudflare Dashboard)

Since CLI is rate-limited, use the Cloudflare Dashboard:

### Step 1: Set the API Token Secret

1. Go to: https://dash.cloudflare.com/
2. Navigate to **Workers & Pages** → **inneranimalmedia**
3. Go to **Settings** → **Variables and Secrets**
4. Under **Secrets**, click **Add Secret**
5. **Name**: `CLOUDFLARE_API_TOKEN`
6. **Value**: `y1MUpWJDYFQbGcLTVb2Z_L_f3YDt1fGWCoQqgCwF`
7. Click **Save**

### Step 2: Verify Account ID

The `CLOUDFLARE_ACCOUNT_ID` is already configured in `wrangler.inneranimalmedia.jsonc`:
```json
"vars": {
  "ENVIRONMENT": "production",
  "CLOUDFLARE_ACCOUNT_ID": "ede6590ac0d2fb7daf155b35653457b2"
}
```

### Step 3: Test the API

After setting the secret, test the endpoint:

```bash
curl https://inneranimalmedia.meauxbility.workers.dev/api/workers
```

You should get a JSON response with your workers list instead of:
```json
{"success":false,"error":"Cloudflare API credentials not configured"}
```

---

## 🔄 Alternative: Using Wrangler CLI (After Rate Limit Clears)

Wait 5-10 minutes for rate limits to clear, then:

```bash
wrangler secret put CLOUDFLARE_API_TOKEN --config wrangler.inneranimalmedia.jsonc
```

When prompted, paste: `y1MUpWJDYFQbGcLTVb2Z_L_f3YDt1fGWCoQqgCwF`

---

## 📋 GitHub Actions Secrets (For Automated Deployments)

Make sure these secrets exist in GitHub:

1. Go to: https://github.com/SamPrimeaux/meauxbilityv2/settings/secrets/actions
2. Verify these secrets exist:
   - `CLOUDFLARE_API_TOKEN` = `y1MUpWJDYFQbGcLTVb2Z_L_f3YDt1fGWCoQqgCwF`
   - `CLOUDFLARE_ACCOUNT_ID` = `ede6590ac0d2fb7daf155b35653457b2`

**Note**: GitHub Actions secrets are for deployment only. The worker itself also needs the secret set in Cloudflare (Step 1 above).

---

## ✅ What's Already Configured

- ✅ Account ID added to `wrangler.inneranimalmedia.jsonc`
- ✅ Worker code checks for credentials
- ✅ API endpoint `/api/workers` is ready
- ⏳ **Need to set**: `CLOUDFLARE_API_TOKEN` secret in Cloudflare Dashboard

---

## 🧪 Testing

Once the secret is set, test all endpoints:

```bash
# Workers API
curl https://inneranimalmedia.meauxbility.workers.dev/api/workers

# GitHub Repos API (needs GITHUB_TOKEN secret)
curl https://inneranimalmedia.meauxbility.workers.dev/api/github/repos

# Health Check
curl https://inneranimalmedia.meauxbility.workers.dev/api/health
```

---

## 🔒 Security Notes

- ✅ API Token is stored as a **secret** (encrypted, not visible in code)
- ✅ Account ID is a **variable** (not sensitive, safe in config)
- ❌ Never commit API tokens to git
- ❌ Never log or expose API tokens
