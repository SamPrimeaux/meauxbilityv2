#!/bin/bash

# Quick deploy script for fuelnfreetime worker
# Uses Cloudflare API to deploy directly

ACCOUNT_ID="ede6590ac0d2fb7daf155b35653457b2"
WORKER_NAME="fuelnfreetime"

echo "🚀 Deploying fuelnfreetime worker..."

# Read the worker code
WORKER_CODE=$(cat src/fuelnfreetime.js)

# Create deployment via Cloudflare API
# Note: This requires CLOUDFLARE_API_TOKEN to be set in environment
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo "⚠️  CLOUDFLARE_API_TOKEN not set. Trying wrangler deploy..."
    wrangler deploy --config wrangler.fuelnfreetime.jsonc --name fuelnfreetime
else
    echo "✅ Using Cloudflare API token..."
    # Upload worker script
    curl -X PUT "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/scripts/${WORKER_NAME}" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/javascript" \
        --data-binary "@src/fuelnfreetime.js" \
        -F "metadata={\"main_module\":\"fuelnfreetime.js\"}"
    
    echo ""
    echo "✅ Worker deployed! Check: https://${WORKER_NAME}.meauxbility.workers.dev"
fi
