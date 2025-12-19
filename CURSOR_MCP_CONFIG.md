# Cursor MCP Configuration Guide

## Quick Reference

### Config File Location

- **macOS**: `~/.cursor/mcp.json`
- **Windows**: `%APPDATA%\Cursor\mcp.json`
- **Linux**: `~/.config/cursor/mcp.json`

### Configuration Format

```json
{
  "mcpServers": {
    "cloudflare-d1": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-d1-server.js"],
      "env": {
        "CLOUDFLARE_ACCOUNT_ID": "ede6590ac0d2fb7daf155b35653457b2",
        "CLOUDFLARE_API_TOKEN": "your_token_here"
      }
    }
  }
}
```

## Setup Methods

### Method 1: Automatic Setup Script

```bash
./setup-mcp.sh
```

This automatically:
- Creates the config file
- Sets up environment variables
- Configures the correct paths

### Method 2: Manual Setup

1. **Find your project path:**
   ```bash
   pwd
   # Example output: /Users/samprimeaux/Downloads/hybridprosaas-dashboard
   ```

2. **Create config directory:**
   ```bash
   mkdir -p ~/.cursor
   ```

3. **Create config file:**
   ```bash
   nano ~/.cursor/mcp.json
   ```

4. **Paste configuration** (update path):
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

5. **Save and restart Cursor**

### Method 3: Cursor Settings UI

1. Open Cursor Settings (`Cmd/Ctrl + ,`)
2. Search for "MCP"
3. Click "Edit MCP Settings"
4. Add the server configuration
5. Save and restart

## Verification

After setup, restart Cursor and test:

```
List all D1 databases
```

If you see the 12 databases, it's working! ✅

## Troubleshooting

### Config File Not Found

- Ensure you're using the correct path for your OS
- Check file permissions: `chmod 644 ~/.cursor/mcp.json`

### Server Not Starting

- Verify Node.js is in PATH: `which node`
- Check file path is absolute (not relative)
- Ensure `mcp-d1-server.js` is executable: `chmod +x mcp-d1-server.js`

### Environment Variables Not Loading

- Use absolute paths in config
- Set variables directly in `env` section
- Don't rely on `.env` file for Cursor MCP

## Multiple MCP Servers

You can add multiple servers:

```json
{
  "mcpServers": {
    "cloudflare-d1": {
      "command": "node",
      "args": ["/path/to/mcp-d1-server.js"],
      "env": {
        "CLOUDFLARE_ACCOUNT_ID": "...",
        "CLOUDFLARE_API_TOKEN": "..."
      }
    },
    "another-server": {
      "command": "python",
      "args": ["/path/to/other-server.py"]
    }
  }
}
```

---

**Need help?** See `D1_MCP_SETUP.md` for detailed troubleshooting.
