#!/bin/bash

# Setup script for Inner Animal Media GitHub Pages

echo "🚀 Setting up Inner Animal Media GitHub Pages..."

REPO_DIR="$HOME/Downloads/inneranimalmedia"
GITHUB_PAGES_INDEX="$HOME/Downloads/hybridprosaas-dashboard/github-pages-index.html"

# Check if repo exists locally
if [ ! -d "$REPO_DIR" ]; then
    echo "📦 Cloning inneranimalmedia repository..."
    cd ~/Downloads
    git clone https://github.com/SamPrimeaux/inneranimalmedia.git
    cd inneranimalmedia
else
    echo "📂 Using existing repository..."
    cd "$REPO_DIR"
    git pull origin main
fi

# Copy redirect file
echo "📝 Adding GitHub Pages redirect..."
cp "$GITHUB_PAGES_INDEX" index.html

# Check if already committed
if git diff --quiet index.html 2>/dev/null && git ls-files --error-unmatch index.html >/dev/null 2>&1; then
    echo "✅ index.html already exists and is up to date"
else
    git add index.html
    git commit -m "Add GitHub Pages redirect to Cloudflare Worker" || echo "No changes to commit"
    git push origin main
    echo "✅ Pushed to GitHub"
fi

echo ""
echo "📋 Next steps:"
echo "1. Go to: https://github.com/SamPrimeaux/inneranimalmedia/settings/pages"
echo "2. Enable GitHub Pages:"
echo "   - Source: Deploy from a branch"
echo "   - Branch: main / / (root)"
echo "3. Save and wait 1-2 minutes"
echo "4. Visit: https://samprimeaux.github.io/inneranimalmedia/"
echo ""
echo "✅ Worker is live at: https://inneranimalmedia.meauxbility.workers.dev"
