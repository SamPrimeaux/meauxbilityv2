# 🌐 inneranimal.app - DNS Setup Guide

## ✅ Domain is on Cloudflare - Use Workers Routes (Recommended)

Since `inneranimal.app` is already on Cloudflare, **you don't need CNAME records**. Cloudflare Workers Routes handle this automatically.

## 🎯 Option 1: Workers Routes (Proper Method - Recommended)

### Step 1: Add Custom Domain in Cloudflare Dashboard

1. **Go to Workers & Pages**
   - Navigate to: https://dash.cloudflare.com
   - Click: **Workers & Pages** → **inneranimalmedia**

2. **Add Custom Domain**
   - Click the **"Custom Domains"** tab
   - Click **"Add Custom Domain"**
   - Enter: `inneranimal.app`
   - Click **"Add Domain"**
   - Repeat for: `www.inneranimal.app`

3. **Cloudflare will automatically:**
   - Create the necessary DNS records
   - Provision SSL certificates
   - Route traffic to your worker

### Step 2: Deploy Worker with Routes

The routes are already configured in `wrangler.inneranimalmedia.jsonc`:
```jsonc
"routes": [
  {
    "pattern": "inneranimal.app/*",
    "custom_domain": true
  },
  {
    "pattern": "www.inneranimal.app/*",
    "custom_domain": true
  }
]
```

Deploy:
```bash
wrangler deploy --config wrangler.inneranimalmedia.jsonc
```

**That's it!** No DNS records needed - Cloudflare handles everything.

---

## 🔄 Option 2: Temporary CNAME (If Needed Before Full Swap)

If you need a temporary solution before the 31st, you can use a **subdomain** with CNAME:

### Setup Temporary Subdomain

1. **In Cloudflare DNS**, add:
   ```
   Type: CNAME
   Name: dev (or temp, staging, etc.)
   Target: inneranimalmedia.meauxbility.workers.dev
   Proxy: Proxied ✅ (orange cloud)
   ```

2. **This gives you:**
   - `dev.inneranimal.app` → Worker
   - Or `temp.inneranimal.app` → Worker
   - Or `staging.inneranimal.app` → Worker

3. **Note:** The root domain (`inneranimal.app`) cannot use CNAME - it needs Workers Routes.

---

## 📋 DNS Records (If Not Using Workers Routes)

If for some reason you can't use Workers Routes yet, here's what you'd need:

### For Root Domain (`inneranimal.app`)
**You CANNOT use CNAME for root domain** - you need:
- **A record** pointing to Cloudflare proxy IP (or use Workers Routes)

### For Subdomain (`www.inneranimal.app`)
You could use:
```
Type: CNAME
Name: www
Target: inneranimalmedia.meauxbility.workers.dev
Proxy: Proxied ✅
```

**BUT** - This won't work because `workers.dev` domains don't accept CNAME records from external domains.

---

## ✅ Recommended Approach (Best Practice)

### Use Cloudflare Workers Routes:

1. **Deploy worker** (already configured):
   ```bash
   wrangler deploy --config wrangler.inneranimalmedia.jsonc
   ```

2. **Add custom domain in Cloudflare Dashboard:**
   - Workers & Pages → inneranimalmedia → Custom Domains
   - Add: `inneranimal.app`
   - Add: `www.inneranimal.app`

3. **Cloudflare automatically:**
   - Creates DNS records
   - Provisions SSL
   - Routes traffic
   - No manual DNS needed!

4. **Wait 5-15 minutes** for SSL certificate provisioning

5. **Test:**
   ```bash
   curl https://inneranimal.app/
   curl https://inneranimal.app/api/health
   ```

---

## 🔧 Current Worker URL

**Worker Dev URL**: `https://inneranimalmedia.meauxbility.workers.dev`

This is what the custom domain will route to once configured.

---

## ⚠️ Important Notes

1. **Root Domain (`inneranimal.app`):**
   - Cannot use CNAME (DNS limitation)
   - Must use Workers Routes or A record
   - Workers Routes is the recommended method

2. **Subdomain (`www.inneranimal.app`):**
   - Can use CNAME, but Workers Routes is still better
   - Workers Routes handles SSL automatically

3. **Temporary Solution:**
   - Use a subdomain like `dev.inneranimal.app` with CNAME
   - Point to worker .dev URL
   - But this won't work because workers.dev doesn't accept external CNAMEs

4. **Best Solution:**
   - Use Workers Routes (already configured)
   - Add custom domain in dashboard
   - Deploy worker
   - Done!

---

## 🚀 Quick Start (Recommended)

```bash
# 1. Deploy worker
wrangler deploy --config wrangler.inneranimalmedia.jsonc

# 2. Go to Cloudflare Dashboard
# 3. Workers & Pages → inneranimalmedia → Custom Domains
# 4. Add: inneranimal.app
# 5. Add: www.inneranimal.app
# 6. Wait for SSL (5-15 min)
# 7. Test!
```

**No CNAME records needed!** Cloudflare Workers Routes handle everything automatically. 🎉
