#!/usr/bin/env node

/**
 * Cloudflare D1 MCP Server
 * Provides Model Context Protocol access to all Cloudflare D1 databases
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

if (!ACCOUNT_ID || !API_TOKEN) {
  console.error("Error: CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN must be set");
  process.exit(1);
}

// All 12 D1 databases (from BEASTMODE API reference)
const DATABASES = [
  { id: "613e4fe1-94f3-4aa1-8dfc-7f321d3bc46f", name: "meauxbility-dashboard-db", binding: "DB", description: "Main Dashboard" },
  { id: "2a3a763a-92f1-4633-849e-268ddb31998f", name: "meaux-work-db", binding: "DB", description: "Meaux Work (Primary)" },
  { id: "7a8dbae8-9c9c-4872-8824-9dc6fbc62fb2", name: "meauxwork-db", binding: "MEAUXWORK", description: "MeauxWork" },
  { id: "ee3e3adb-da99-457d-8c2c-390ff19f6435", name: "meauxstack-saas-db", binding: "SAAS_DB", description: "SaaS Core" },
  { id: "49b16b7d-ecb9-4cc4-b337-559f94854757", name: "meauxbility-api-db", binding: "API_DB", description: "Meauxbility API" },
  { id: "011d1629-b5c8-49e7-8f6d-ca311ba936fe", name: "meauxbilityorg", binding: "MEAUXBILITYORG", description: "Meauxbility.org Website" },
  { id: "1aaf9981-30f9-49f7-833f-462b523e4abb", name: "meauxaccess-db", binding: "MEAUXACCESS", description: "MeauxAccess" },
  { id: "df192326-00b4-4d68-ad0d-5dd439dc8898", name: "meauxmarkets-dev", binding: "MEAUXMARKETS", description: "MeauxMarkets Dev" },
  { id: "d8261777-9384-44f7-924d-c92247d55b46", name: "meauxos", binding: "MEAUXOS_DB", description: "MeauxOS System" },
  { id: "ff10ed0d-fb18-4f94-8e8a-2d8eb2053bef", name: "inneranimalmedia_app_library", binding: "APP_LIBRARY", description: "Inner Animal Media App Library" },
  { id: "e0ec00b8-4e3c-422e-abba-70b7548c1f87", name: "inneranimalmedia-assets", binding: "ASSETS", description: "Inner Animal Media Assets" },
  { id: "f01e1fbb-01fb-4900-80e9-bbb90db51bbe", name: "southernpetsanimalrescue", binding: "SOUTHERNPETS", description: "Southern Pets Animal Rescue" },
];

const API_BASE = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database`;

async function makeRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Authorization": `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Cloudflare API error: ${response.status} - ${error}`);
  }

  return response.json();
}

async function executeQuery(databaseId, query) {
  const result = await makeRequest(`/${databaseId}/query`, {
    method: "POST",
    body: JSON.stringify({ sql: query }),
  });

  return result;
}

async function listTables(databaseId) {
  const result = await executeQuery(databaseId, "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  return result.results || [];
}

async function getTableSchema(databaseId, tableName) {
  const result = await executeQuery(databaseId, `PRAGMA table_info(${tableName})`);
  return result.results || [];
}

const server = new Server(
  {
    name: "cloudflare-d1",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "d1_list_databases",
        description: "List all available Cloudflare D1 databases",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "d1_list_tables",
        description: "List all tables in a specific D1 database",
        inputSchema: {
          type: "object",
          properties: {
            database: {
              type: "string",
              description: "Database name (e.g., 'meaux-work-db', 'meauxos')",
            },
          },
          required: ["database"],
        },
      },
      {
        name: "d1_table_schema",
        description: "Get the schema (column definitions) for a specific table",
        inputSchema: {
          type: "object",
          properties: {
            database: {
              type: "string",
              description: "Database name",
            },
            table: {
              type: "string",
              description: "Table name",
            },
          },
          required: ["database", "table"],
        },
      },
      {
        name: "d1_query",
        description: "Execute a SQL query against a D1 database",
        inputSchema: {
          type: "object",
          properties: {
            database: {
              type: "string",
              description: "Database name",
            },
            query: {
              type: "string",
              description: "SQL query to execute",
            },
          },
          required: ["database", "query"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "d1_list_databases": {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                DATABASES.map((db) => ({
                  name: db.name,
                  id: db.id,
                  binding: db.binding,
                })),
                null,
                2
              ),
            },
          ],
        };
      }

      case "d1_list_tables": {
        const db = DATABASES.find((d) => d.name === args.database);
        if (!db) {
          throw new Error(`Database '${args.database}' not found. Use d1_list_databases to see available databases.`);
        }

        const tables = await listTables(db.id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                tables.map((t) => t.name),
                null,
                2
              ),
            },
          ],
        };
      }

      case "d1_table_schema": {
        const db = DATABASES.find((d) => d.name === args.database);
        if (!db) {
          throw new Error(`Database '${args.database}' not found.`);
        }

        const schema = await getTableSchema(db.id, args.table);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(schema, null, 2),
            },
          ],
        };
      }

      case "d1_query": {
        const db = DATABASES.find((d) => d.name === args.database);
        if (!db) {
          throw new Error(`Database '${args.database}' not found.`);
        }

        const result = await executeQuery(db.id, args.query);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Cloudflare D1 MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
