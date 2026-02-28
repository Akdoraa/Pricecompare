
## Product Listing Application

This project is now implemented as a Next.js App Router application.

### Run locally

1. Install dependencies:
   - `npm install`
2. Copy environment variables:
   - `copy .env.example .env.local` (Windows)
3. Set API credentials in `.env.local`:
   - `BRIGHTDATA_MCP_URL` (recommended for OpenAI MCP, e.g. `https://mcp.brightdata.com/mcp?...`)
   - `BRIGHTDATA_MCP_SSE_URL` (legacy/direct SSE fallback)
   - `BRIGHTDATA_API_KEY` (optional if token is embedded in MCP URL)
   - `API_TOKEN` (supported alias for Bright Data key, matches MCP config)
   - `GROUPS` / `TOOLS` (optional source tool filter, matches MCP config)
   - `OPENAI_API_KEY` (required for OpenAI MCP integration path)
   - `OPENAI_MODEL` (optional, default `gpt-4.1-mini`)
   - `ACONTEXT_API_KEY`
   - `ACTIONBOOK_API_KEY`
4. Optional MCP stdio config (same values used by this app when it launches `npx @brightdata/mcp`):
```json
{
  "mcpServers": {
    "Bright Data": {
      "command": "npx",
      "args": ["@brightdata/mcp"],
      "env": {
        "API_TOKEN": "YOUR_TOKEN",
        "GROUPS": "advanced_scraping",
        "TOOLS": "web_data_amazon_product,web_data_walmart_product,web_data_ebay_product,web_data_etsy_products,web_data_bestbuy_products,web_data_google_shopping"
      }
    }
  }
}
```
5. Start dev server:
   - `npm run dev`

### Swagger Testing

1. Open Swagger UI:
   - `/api/docs`
2. Open raw OpenAPI spec:
   - `/api/openapi`
3. Use `Try it out` in Swagger UI to test:
   - `POST /api/compare/start`
   - `GET /api/compare/{requestId}`
   - `GET /api/saved?sessionId=...`
   - `POST /api/saved/toggle`
   - `POST /api/saved/alert`

### Main capabilities

1. Responsive dashboard and product pages with mobile sidebar behavior.
2. Saved deals with shared bookmark state and price alerts.
3. Compare API + polling endpoints.
4. Bright Data integration via OpenAI Responses MCP first (`type: "mcp"` to Bright Data), then direct MCP (`SSE`/`stdio`) and `@brightdata/sdk` fallback, with source normalization and ranking.
5. Acontext + Actionbook adapter hooks for context and playbook usage.
  
