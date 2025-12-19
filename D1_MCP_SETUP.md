# Cloudflare D1 MCP Server - Complete Setup Guide

## Overview

This MCP (Model Context Protocol) server provides direct access to all 12 of your Cloudflare D1 databases from Cursor and CLI tools.

## Prerequisites

- Node.js 18+ installed
- Cloudflare account with D1 databases
- Cursor IDE (for MCP integration)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `@modelcontextprotocol/sdk` - MCP SDK for server implementation

### 2. Get Cloudflare API Token

1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Click **"Create Token"**
3. Use **"Edit Cloudflare Workers"** template
4. Add these permissions:
   - **Account → D1 → Read**
   - **Account → D1 → Write**
5. Copy the token

### 3. Configure Environment

Create `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` and add your token:

```bash
CLOUDFLARE_ACCOUNT_ID=ede6590ac0d2fb7daf155b35653457b2
CLOUDFLARE_API_TOKEN=your_token_here
```

### 4. Configure Cursor

**Option A: Quick Setup (Recommended)**

```bash
chmod +x setup-mcp.sh
./setup-mcp.sh
```

This script will:
- Create `.env` if missing
- Install dependencies
- Configure Cursor MCP settings automatically

**Option B: Manual Setup**

1. Open Cursor Settings (`Cmd/Ctrl + ,`)
2. Search for "MCP" or navigate to MCP settings
3. Add server configuration:

```json
{
  "mcpServers": {
    "cloudflare-d1": {
      "command": "node",
      "args": ["/Users/samprimeaux/Downloads/hybridprosaas-dashboard/mcp-d1-server.js"],
      "env": {
        "CLOUDFLARE_ACCOUNT_ID": "ede6590ac0d2fb7daf155b35653457b2",
        "CLOUDFLARE_API_TOKEN": "your_token_here"
      }
    }
  }
}
```

**Note**: Replace the path with your actual project path.

### 5. Restart Cursor

**Important**: You must completely quit and reopen Cursor for MCP changes to take effect.

- macOS: `Cmd + Q` then reopen
- Windows/Linux: Close all windows then reopen

### 6. Test the Connection

In Cursor chat, try:

```
List all D1 databases
```

You should see all 12 databases listed!

## Available Tools

Once configured, you can use these tools in Cursor:

### 1. `d1_list_databases`
List all available D1 databases.

**Example**: "List all D1 databases"

### 2. `d1_list_tables`
List all tables in a specific database.

**Example**: "List tables in meaux-work-db"

### 3. `d1_table_schema`
Get the schema (column definitions) for a table.

**Example**: "Get schema for projects table in meaux-work-db"

### 4. `d1_query`
Execute any SQL query against a database.

**Example**: "Query meaux-work-db: SELECT * FROM projects LIMIT 5"

## Available Databases

All 12 databases configured:

1. **meauxbility-dashboard-db** (`613e4fe1-94f3-4aa1-8dfc-7f321d3bc46f`)
2. **meauxos** (`d8261777-9384-44f7-924d-c92247d55b46`)
3. **inneranimalmedia_app_library** (`ff10ed0d-fb18-4f94-8e8a-2d8eb2053bef`)
4. **inneranimalmedia-assets** (`e0ec00b8-4e3c-422e-abba-70b7548c1f87`)
5. **meauxbility-api-db** (`49b16b7d-ecb9-4cc4-b337-559f94854757`)
6. **meauxaccess-db** (`1aaf9981-30f9-49f7-833f-462b523e4abb`)
7. **meauxbilityorg** (`011d1629-b5c8-49e7-8f6d-ca311ba936fe`)
8. **meauxmarkets_dev** (`df192326-00b4-4d68-ad0d-5dd439dc8898`)
9. **meaux-work-db** (`2a3a763a-92f1-4633-849e-268ddb31998f`)
10. **meauxwork-db** (`7a8dbae8-9c9c-4872-8824-9dc6fbc62fb2`)
11. **meauxstack-saas-db** (`ee3e3adb-da99-457d-8c2c-390ff19f6435`)
12. **southernpetsanimalrescue** (`f01e1fbb-01fb-4900-80e9-bbb90db51bbe`)

## Example Usage

### Explore Databases
```
"Show me all D1 databases"
"List tables in meauxos"
"What tables are in meaux-work-db?"
```

### Schema Exploration
```
"Get schema for users table in meauxos"
"Show me the structure of projects table in meaux-work-db"
"What columns does the teams table have?"
```

### Data Queries
```
"Query meaux-work-db: SELECT COUNT(*) FROM projects"
"Show me 5 recent projects from meaux-work-db"
"List all users from meauxos database"
```

## Troubleshooting

### Server Not Connecting

**Check environment variables:**
```bash
# Verify .env file exists and has correct values
cat .env
```

**Verify token permissions:**
- Token must have D1 Read and Write permissions
- Token must be for the correct account

**Check Cursor logs:**
- Look for MCP connection errors in Cursor's developer console
- Check if the server process is running

### "Database not found" Error

- Use exact database names from the list above
- Use `d1_list_databases` tool first to see available databases
- Database names are case-sensitive

### "Permission denied" Error

- Verify your API token has D1 Read/Write permissions
- Check token hasn't expired
- Ensure token is for the correct Cloudflare account

### Server Crashes

- Check Node.js version: `node --version` (needs 18+)
- Verify dependencies installed: `npm list @modelcontextprotocol/sdk`
- Check server logs for specific error messages

## Advanced Configuration

### Custom Database List

Edit `mcp-d1-server.js` and update the `DATABASES` array to add/remove databases.

### Environment Variables

You can also set environment variables directly in Cursor config instead of using `.env`:

```json
{
  "mcpServers": {
    "cloudflare-d1": {
      "command": "node",
      "args": ["path/to/mcp-d1-server.js"],
      "env": {
        "CLOUDFLARE_ACCOUNT_ID": "ede6590ac0d2fb7daf155b35653457b2",
        "CLOUDFLARE_API_TOKEN": "your_token_here"
      }
    }
  }
}
```

## Security Notes

- ⚠️ Never commit `.env` file to git (already in `.gitignore`)
- ⚠️ Never share your API token publicly
- ⚠️ Rotate tokens if accidentally exposed
- ✅ Use environment variables for sensitive data
- ✅ Keep tokens with minimal required permissions

## Support

For issues or questions:
1. Check this documentation
2. Review Cursor MCP logs
3. Verify Cloudflare API token permissions
4. Test with `d1_list_databases` tool first

---

**Ready to query your D1 databases from Cursor!** 🚀
