# Hybrid Pro SaaS Dashboard

Meauxbility's comprehensive dashboard and application ecosystem built on Cloudflare Workers, R2, and D1.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Cloudflare account
- Wrangler CLI installed globally: `npm install -g wrangler`

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Deployment

```bash
npm run deploy
```

## 📁 Project Structure

```
├── src/
│   ├── index.js          # Main dashboard worker
│   └── meauxv2.js        # Meauxbility v2 website worker
├── dashboard.html        # Main dashboard UI
├── community.html        # Community hub page
├── meaux-*.html          # Application pages (Talk, Board, Docs, etc.)
├── wrangler.jsonc        # Main worker config (gitignored - contains secrets)
├── wrangler.meauxv2.jsonc # Meauxv2 worker config
└── .github/
    └── workflows/
        └── deploy-meauxv2.yml # CI/CD for meauxv2
```

## 🔧 Workers

### meauxaccessmvp
- **URL**: https://meauxaccessmvp.meauxbility.workers.dev
- **Purpose**: Main dashboard and application ecosystem
- **R2 Buckets**: inneranimalmedia-assets, inneranimalmedia-trash, inneranimalmedia-email-archive
- **D1 Database**: meaux-work-db

### meauxv2
- **URL**: https://meauxv2.meauxbility.workers.dev
- **Purpose**: Meauxbility website (serves from R2 bucket `meauxbilityv2`)
- **R2 Bucket**: meauxbilityv2

## 🗄️ MCP Server (Model Context Protocol)

Access all 12 D1 databases directly from Cursor!

### Quick Setup

```bash
# Install dependencies
npm install

# Run setup script
./setup-mcp.sh

# Restart Cursor
```

See `MCP_QUICK_START.md` for full instructions.

### Available Tools
- `d1_list_databases` - List all 12 databases
- `d1_list_tables` - List tables in a database
- `d1_table_schema` - Get table schema
- `d1_query` - Execute SQL queries

## 📚 Documentation

- **MCP Quick Start**: `MCP_QUICK_START.md`
- **MCP Full Setup**: `D1_MCP_SETUP.md`
- **Cursor Config**: `CURSOR_MCP_CONFIG.md`
- **Database List**: `D1_DATABASES_LIST.md`
- **Meauxv2 README**: `README.meauxv2.md`

## 🔐 Security

- `wrangler.jsonc` is gitignored (contains API keys)
- `.env` files are gitignored
- Use GitHub Secrets for CI/CD
- Never commit sensitive credentials

## 🚢 CI/CD

GitHub Actions automatically deploys:
- `meauxv2` worker on push to `main`
- See `.github/workflows/deploy-meauxv2.yml`

## 📊 Pages Deployed

- **Repository**: 12 HTML pages
- **R2 Storage**: 31 total pages across 2 buckets
- **Workers**: 2 active workers serving content

## 🛠️ Available Applications

- **MeauxTalk** - Team communications
- **MeauxBoard** - Project management
- **MeauxDocs** - Documentation
- **MeauxPhoto** - Asset library
- **MeauxDesign** - AI design tools
- **MeauxCloud** - Cloud storage
- **MeauxMail** - Email management
- **MeauxCalendar** - Calendar & events
- **MeauxWallet** - Financial tracking

---

**Built with ❤️ for Meauxbility**
