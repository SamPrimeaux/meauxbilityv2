# Cloudflare D1 Databases Reference

Complete list of all 12 D1 databases accessible via MCP.

## Database List

| # | Name | ID | Binding | Description |
|---|------|-----|---------|-------------|
| 1 | **meauxbility-dashboard-db** | `613e4fe1-94f3-4aa1-8dfc-7f321d3bc46f` | `DB` | Main dashboard database |
| 2 | **meauxos** | `d8261777-9384-44f7-924d-c92247d55b46` | `MEAUXOS_DB` | MeauxOS system database |
| 3 | **inneranimalmedia_app_library** | `ff10ed0d-fb18-4f94-8e8a-2d8eb2053bef` | `APP_LIBRARY` | App library database |
| 4 | **inneranimalmedia-assets** | `e0ec00b8-4e3c-422e-abba-70b7548c1f87` | `ASSETS` | Assets database |
| 5 | **meauxbility-api-db** | `49b16b7d-ecb9-4cc4-b337-559f94854757` | `API_DB` | API database |
| 6 | **meauxaccess-db** | `1aaf9981-30f9-49f7-833f-462b523e4abb` | `MEAUXACCESS` | MeauxAccess database |
| 7 | **meauxbilityorg** | `011d1629-b5c8-49e7-8f6d-ca311ba936fe` | `MEAUXBILITYORG` | Meauxbility.org website database |
| 8 | **meauxmarkets_dev** | `df192326-00b4-4d68-ad0d-5dd439dc8898` | `MEAUXMARKETS` | Markets dev database |
| 9 | **meaux-work-db** | `2a3a763a-92f1-4633-849e-268ddb31998f` | `MEAUX_WORK` | Work database (primary) |
| 10 | **meauxwork-db** | `7a8dbae8-9c9c-4872-8824-9dc6fbc62fb2` | `MEAUXWORK` | MeauxWork database |
| 11 | **meauxstack-saas-db** | `ee3e3adb-da99-457d-8c2c-390ff19f6435` | `SAAS_DB` | SaaS core database |
| 12 | **southernpetsanimalrescue** | `f01e1fbb-01fb-4900-80e9-bbb90db51bbe` | `SOUTHERNPETS` | Southern Pets rescue project |

## Usage Examples

### List Tables
```
"List tables in meaux-work-db"
"Show me all tables in meauxos"
"What tables are in meauxbility-dashboard-db?"
```

### Query Data
```
"Query meaux-work-db: SELECT * FROM projects LIMIT 5"
"Show me users from meauxos database"
"Count records in meauxbility-dashboard-db projects table"
```

### Schema Exploration
```
"Get schema for projects table in meaux-work-db"
"Show me the structure of users table in meauxos"
"What columns does teams table have in meauxbility-dashboard-db?"
```

## Quick Reference

**Most Used Databases:**
- `meaux-work-db` - Primary work/projects database
- `meauxos` - MeauxOS system
- `meauxbility-dashboard-db` - Dashboard data

**Query Format:**
```
"Query [database-name]: [SQL query]"
```

**Example:**
```
"Query meaux-work-db: SELECT name, status FROM projects WHERE status = 'active'"
```

---

**Total Databases**: 12  
**MCP Server**: `cloudflare-d1`  
**Status**: ✅ All configured and accessible
