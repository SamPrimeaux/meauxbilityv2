# 🌐 inneranimal.app Custom Domain Setup

## ✅ Current Status

- **Worker**: `inneranimalmedia` ✅ Deployed
- **Worker URL**: https://inneranimalmedia.meauxbility.workers.dev ✅ Live
- **Custom Domain**: `inneranimal.app` ⏳ Needs DNS Configuration

## 🎯 Goal

Connect `inneranimal.app` to the `inneranimalmedia` Cloudflare Worker so the site is accessible at:
- **https://inneranimal.app** (primary)
- **https://www.inneranimal.app** (www subdomain)

## 📋 Setup Steps

### 1. Add Domain to Cloudflare Account

1. **Log into Cloudflare Dashboard**
   - Go to: https://dash.cloudflare.com
   - Navigate to your account

2. **Add Domain**
   - Click "Add a Site"
   - Enter: `inneranimal.app`
   - Follow the setup wizard
   - Cloudflare will scan existing DNS records

3. **Update Nameservers** (if required)
   - Cloudflare will provide nameservers
   - Update your domain registrar with these nameservers
   - Wait for DNS propagation (usually 24-48 hours)

### 2. Configure DNS Records

Once the domain is in Cloudflare:

1. **Go to DNS Settings**
   - Navigate to: DNS → Records

2. **Add/Verify Records**:
   ```
   Type: A
   Name: @
   Content: 192.0.2.1 (or use Cloudflare's proxy IP)
   Proxy: Proxied (orange cloud) ✅
   
   Type: AAAA
   Name: @
   Content: 2001:db8::1 (or use Cloudflare's proxy IPv6)
   Proxy: Proxied (orange cloud) ✅
   
   Type: CNAME
   Name: www
   Content: inneranimal.app
   Proxy: Proxied (orange cloud) ✅
   ```

### 3. Configure Worker Routes

The `wrangler.inneranimalmedia.jsonc` file has been updated with routes:

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

### 4. Deploy Worker with Custom Domain

**Option A: Via Wrangler CLI**
```bash
cd /Users/samprimeaux/Downloads/hybridprosaas-dashboard
wrangler deploy --config wrangler.inneranimalmedia.jsonc
```

**Option B: Via GitHub Actions**
- Push changes to `main` branch
- The workflow `.github/workflows/inneranimalmedia-deploy.yml` will deploy automatically

### 5. Verify Custom Domain in Cloudflare Dashboard

1. **Go to Workers & Pages**
   - Navigate to: Workers & Pages → inneranimalmedia

2. **Add Custom Domain**
   - Click "Custom Domains" tab
   - Click "Add Custom Domain"
   - Enter: `inneranimal.app`
   - Click "Add Domain"
   - Repeat for `www.inneranimal.app`

3. **Wait for SSL Certificate**
   - Cloudflare will automatically provision SSL certificates
   - This usually takes 5-15 minutes
   - Status will show "Active" when ready

## 🔍 Verification

### Test Custom Domain
```bash
# Test primary domain
curl https://inneranimal.app/

# Test www subdomain
curl https://www.inneranimal.app/

# Test API endpoints
curl https://inneranimal.app/api/github/repos
curl https://inneranimal.app/api/workers
```

### Expected Behavior
- ✅ Both `inneranimal.app` and `www.inneranimal.app` serve the same content
- ✅ SSL certificates are active (HTTPS works)
- ✅ All routes work: `/`, `/MEAUXGLOBE.html`, `/api/*`, etc.
- ✅ Content served from R2 bucket `inneranimalmedia`

## 📊 Current URLs

| Type | URL | Status |
|------|-----|--------|
| **Worker (.dev)** | https://inneranimalmedia.meauxbility.workers.dev | ✅ Live |
| **Custom Domain** | https://inneranimal.app | ⏳ Pending DNS |
| **WWW Subdomain** | https://www.inneranimal.app | ⏳ Pending DNS |
| **GitHub Pages** | https://samprimeaux.github.io/inneranimalmedia/ | ✅ Live |

## 🚀 After Setup

Once `inneranimal.app` is configured:

1. **Update Links**
   - Update any hardcoded links to use `inneranimal.app`
   - Update social media profiles
   - Update email signatures

2. **SEO Configuration**
   - Set up redirects (if needed)
   - Configure canonical URLs
   - Update sitemap.xml

3. **Monitoring**
   - Set up Cloudflare Analytics
   - Monitor SSL certificate status
   - Track custom domain health

## 🔧 Troubleshooting

### Domain Not Resolving
- Check DNS records are correct
- Verify nameservers are updated at registrar
- Wait for DNS propagation (can take up to 48 hours)

### SSL Certificate Issues
- Ensure domain is proxied (orange cloud) in Cloudflare
- Wait 15-30 minutes for certificate provisioning
- Check SSL/TLS settings in Cloudflare dashboard

### Worker Not Serving Content
- Verify routes are configured in wrangler config
- Check custom domain is added in Cloudflare dashboard
- Ensure worker is deployed with latest config

### 404 Errors
- Verify R2 bucket has content
- Check file paths match R2 keys
- Review worker logs in Cloudflare dashboard

## 📝 Files Updated

- ✅ `wrangler.inneranimalmedia.jsonc` - Added routes configuration
- ✅ `INNERANIMAL_APP_SETUP.md` - This setup guide

## 🎉 Next Steps

1. **Add domain to Cloudflare** (if not already)
2. **Configure DNS records** (A, AAAA, CNAME)
3. **Deploy worker** with updated config
4. **Add custom domain** in Cloudflare dashboard
5. **Wait for SSL** certificate provisioning
6. **Test** all URLs and endpoints
7. **Update** any external links/references

---

**Once complete, `inneranimal.app` will be fully operational!** 🚀
