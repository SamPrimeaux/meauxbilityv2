#!/bin/bash

# Cloudflare D1 MCP Server Setup Script

echo "🚀 Setting up Cloudflare D1 MCP Server..."

# Check if .env exists
if [ ! -f .env ]; then
  echo "📝 Creating .env file from .env.example..."
  cp .env.example .env
  echo "⚠️  Please update .env with your CLOUDFLARE_API_TOKEN"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Get the current directory
CURRENT_DIR=$(pwd)

# Try to get token from .env or wrangler.jsonc
if [ -f .env ]; then
  source .env
elif [ -f wrangler.jsonc ]; then
  # Extract token from wrangler.jsonc (basic extraction)
  CLOUDFLARE_API_TOKEN=$(grep -o '"CLOUDFLARE_API_TOKEN": "[^"]*' wrangler.jsonc | cut -d'"' -f4 || echo "")
fi

if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
  echo "⚠️  CLOUDFLARE_API_TOKEN not found. Please set it in .env file."
  CLOUDFLARE_API_TOKEN="your_token_here"
fi

# Create Cursor MCP config
echo "⚙️  Creating Cursor MCP configuration..."

CURSOR_CONFIG_DIR="$HOME/.cursor"
MCP_CONFIG_FILE="$CURSOR_CONFIG_DIR/mcp.json"

# Create .cursor directory if it doesn't exist
mkdir -p "$CURSOR_CONFIG_DIR"

# Check if mcp.json exists
if [ -f "$MCP_CONFIG_FILE" ]; then
  echo "⚠️  $MCP_CONFIG_FILE already exists. Backing up to mcp.json.backup"
  cp "$MCP_CONFIG_FILE" "$MCP_CONFIG_FILE.backup"
fi

# Create MCP config
cat > "$MCP_CONFIG_FILE" << EOF
{
  "mcpServers": {
    "cloudflare-d1": {
      "command": "node",
      "args": ["$CURRENT_DIR/mcp-d1-server.js"],
      "env": {
        "CLOUDFLARE_ACCOUNT_ID": "ede6590ac0d2fb7daf155b35653457b2",
        "CLOUDFLARE_API_TOKEN": "$CLOUDFLARE_API_TOKEN"
      }
    }
  }
}
EOF

echo "✅ MCP server configured!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env file with your CLOUDFLARE_API_TOKEN"
echo "2. Restart Cursor completely (quit and reopen)"
echo "3. Test by asking: 'List all D1 databases'"
echo ""
echo "📁 Config file: $MCP_CONFIG_FILE"
