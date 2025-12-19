#!/bin/bash

# Script to help update Cloudflare Worker Git repository connection
# Note: This requires manual steps in the Cloudflare Dashboard

echo "🔧 Cloudflare Worker Git Repository Update Helper"
echo "=================================================="
echo ""
echo "Worker: inneranimalmedia"
echo "Current Repo: SamPrimeaux/inneranimalmedia-app-library"
echo "Target Repo: SamPrimeaux/meauxbilityv2"
echo ""
echo "📋 Steps to Update:"
echo ""
echo "1. Open Cloudflare Dashboard:"
echo "   https://dash.cloudflare.com/ede6590ac0d2fb7daf155b35653457b2/workers/services/view/inneranimalmedia/settings/builds"
echo ""
echo "2. Disconnect current repository (inneranimalmedia-app-library)"
echo ""
echo "3. Connect new repository (meauxbilityv2)"
echo ""
echo "4. Configure:"
echo "   - Root directory: /"
echo "   - Production branch: main"
echo "   - Build command: (leave empty)"
echo ""
echo "✅ After updating, your worker will be connected to the correct repository!"
echo ""
echo "Note: GitHub Actions will continue to work regardless of this connection."
