# 🚀 Cloudflare D1 MCP Server - Quick Start

## What This Does

This MCP (Model Context Protocol) server gives Cursor and CLI tools direct access to all 12 of your Cloudflare D1 databases, enabling:

- ✅ Query databases directly from Cursor chat
- ✅ Explore database schemas without leaving your editor
- ✅ Rapid development workflows with instant database introspection
- ✅ Schema migration validation
- ✅ Data exploration and debugging

## ⚡ 3-Minute Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Get Cloudflare API Token

1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Click "Create Token"
3. Use "Edit Cloudflare Workers" template
4. Add permissions:
   - **Account → D1 → Read**
   - **Account → D1 → Write**
5. Copy the token

### 3. Configure Environment

Create or update `.env` file:

```bash
cp .env.example .env
# Then edit .env and add your CLOUDFLARE_API_TOKEN
```

Or use the token from `wrangler.jsonc`:
```bash
CLOUDFLARE_ACCOUNT_ID=ede6590ac0d2fb7daf155b35653457b2
CLOUDFLARE_API_TOKEN=y1MUpWJDYFQbGcLTVb2Z_L_f3YDt1fGWCoQqgCwF
```

### 4. Configure Cursor

**Option A: Quick Setup Script**
```bash
./setup-mcp.sh
```

**Option B: Manual Setup**

1. Open Cursor Settings (`Cmd/Ctrl + ,`)
2. Search for "MCP"
3. Add server:

```json
{
  "mcpServers": {
    "cloudflare-d1": {
      "command": "node",
      "args": ["/Users/samprimeaux/Downloads/hybridprosaas-dashboard/mcp-d1-server.js"],
      "env": {
        "CLOUDFLARE_ACCOUNT_ID": "ede6590ac0d2fb7daf155b35653457b2",
        "CLOUDFLARE_API_TOKEN": "y1MUpWJDYFQbGcLTVb2Z_L_f3YDt1fGWCoQqgCwF"
      }
    }
  }
}
```

### 5. Restart Cursor

Quit and reopen Cursor completely.

### 6. Test It

In Cursor chat, ask:
```
List all D1 databases
```

You should see all 12 databases listed! 🎉

## 📚 Available Tools

Once configured, you can use these in Cursor:

1. **`d1_list_databases`** - List all available databases
2. **`d1_list_tables`** - List tables in a database
3. **`d1_table_schema`** - Get table column definitions
4. **`d1_query`** - Execute any SQL query

## 💡 Example Usage

```
"List tables in meauxbility-dashboard-db"
"Get schema for projects table in meauxbility-dashboard-db"
"Query meauxos: SELECT * FROM users LIMIT 5"
"Show me all databases"
```

## 🗄️ Available Databases

All 12 databases from your configuration:

1. `meauxbility-dashboard-db` - Main dashboard
2. `meauxos` - MeauxOS system
3. `inneranimalmedia_app_library` - App library
4. `inneranimalmedia-assets` - Assets
5. `meauxbility-api-db` - API database
6. `meauxaccess-db` - MeauxAccess
7. `meauxbilityorg` - Website database
8. `meauxmarkets_dev` - Markets dev
9. `meaux-work-db` - Work database
10. `meauxwork-db` - MeauxWork
11. `meauxstack-saas-db` - SaaS core
12. `southernpetsanimalrescue` - Rescue project

## 🔧 Troubleshooting

**Server not connecting?**
- Check `.env` file has `CLOUDFLARE_API_TOKEN`
- Verify token has D1 permissions
- Restart Cursor completely

**"Database not found" error?**
- Use exact database names from list above
- Use `d1_list_databases` tool first

**Need more help?**
- See `D1_MCP_SETUP.md` for detailed guide
- See `CURSOR_MCP_CONFIG.md` for Cursor-specific setup

## 📖 Full Documentation

- **Setup Guide**: `D1_MCP_SETUP.md`
- **Cursor Config**: `CURSOR_MCP_CONFIG.md`
- **Database List**: `D1_DATABASES_LIST.md`

---

**Ready to query your D1 databases from Cursor!** 🚀
