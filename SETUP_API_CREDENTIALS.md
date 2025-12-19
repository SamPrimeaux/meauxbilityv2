# Setting Up Cloudflare API Credentials for Inner Animal Media Worker

## Problem

The `/api/workers` endpoint is returning:
```json
{"success":false,"error":"Cloudflare API credentials not configured"}
```

This happens because the worker needs access to Cloudflare API credentials to list your Workers.

## Solution

You need to set the `CLOUDFLARE_API_TOKEN` as a **secret** in your Cloudflare Worker.

### Option 1: Using Wrangler CLI (Recommended)

1. **Get your Cloudflare API Token**:
   - Go to: https://dash.cloudflare.com/profile/api-tokens
   - Click "Create Token"
   - Use "Edit Cloudflare Workers" template
   - Make sure it has these permissions:
     - `Account:Cloudflare Workers:Edit`
     - `Account:Account Settings:Read`
   - Copy the token

2. **Set the secret**:
   ```bash
   wrangler secret put CLOUDFLARE_API_TOKEN --config wrangler.inneranimalmedia.jsonc
   ```
   - When prompted, paste your API token
   - The secret will be encrypted and stored securely

3. **Verify it's set**:
   ```bash
   wrangler secret list --config wrangler.inneranimalmedia.jsonc
   ```

### Option 2: Using Cloudflare Dashboard

1. Go to: https://dash.cloudflare.com/
2. Navigate to **Workers & Pages** → **inneranimalmedia**
3. Go to **Settings** → **Variables and Secrets**
4. Under **Secrets**, click **Add Secret**
5. Name: `CLOUDFLARE_API_TOKEN`
6. Value: Your API token
7. Click **Save**

### Option 3: Using GitHub Actions Secrets (For Automated Deployments)

If you want the secrets to be set automatically during deployment:

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Make sure these secrets exist:
   - `CLOUDFLARE_API_TOKEN` - Your Cloudflare API token
   - `CLOUDFLARE_ACCOUNT_ID` - `ede6590ac0d2fb7daf155b35653457b2`

**Note**: GitHub Actions secrets are used for deployment, but the worker itself also needs the secret set in Cloudflare.

## Account ID

The `CLOUDFLARE_ACCOUNT_ID` is already configured in `wrangler.inneranimalmedia.jsonc` as a variable (it's not sensitive, so it can be in the config file).

## Testing

After setting the secret, test the API endpoint:

```bash
curl https://inneranimalmedia.meauxbility.workers.dev/api/workers
```

You should get a JSON response with your workers list instead of an error.

## Security Notes

- ✅ **API Token** should be a **secret** (encrypted, not visible in code)
- ✅ **Account ID** can be a **variable** (not sensitive, can be in config)
- ❌ Never commit API tokens to git
- ❌ Never log or expose API tokens

## Troubleshooting

### "Rate limit exceeded" error
Wait a few minutes and try again. Cloudflare has rate limits on API requests.

### "Authentication error"
- Verify your API token is valid and not expired
- Check that the token has the correct permissions
- Make sure you're using the right account

### "Secret not found"
- Verify the secret name is exactly `CLOUDFLARE_API_TOKEN` (case-sensitive)
- Make sure you're setting it for the correct worker (`inneranimalmedia`)
