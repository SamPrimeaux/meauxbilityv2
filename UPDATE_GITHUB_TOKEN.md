# Update GitHub Token for Inner Animal Media Worker

## New Token
- **Account**: InnerAnimal (info@inneranimals.com)
- **Repos Found**: 50 repositories
- **Token**: See secure storage or contact admin

## Update Secret in Cloudflare Dashboard

1. Go to: https://dash.cloudflare.com/ede6590ac0d2fb7daf155b35653457b2/workers/services/view/inneranimalmedia/settings/variables
2. Find the `GITHUB_TOKEN` secret
3. Click **Edit** or **Update**
4. Paste the new InnerAnimal GitHub token (stored securely)
5. Click **Save**

## Or Use Wrangler CLI

```bash
# Token should be provided securely, not in documentation
echo "<TOKEN>" | wrangler secret put GITHUB_TOKEN --config wrangler.inneranimalmedia.jsonc
```

## Test After Update

```bash
curl https://inneranimalmedia.meauxbility.workers.dev/api/github/repos
```

You should see 50 InnerAnimal repositories instead of the previous count.
