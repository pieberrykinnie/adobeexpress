# BrandGenie Setup Guide

## Prerequisites
- Node.js 20+
- pnpm 8+
- Adobe Express Developer account
- Cloudflare account (for Worker deployment)

## Environment Variables
Create a `.env.local` file in the project root with the following:

```
# Adobe Firefly API Key (for palette/template generation)
FIREFLY_API_KEY=your-firefly-api-key

# Adobe IO Client ID (if using advanced SDK features)
ADOBE_IO_CLIENT_ID=your-adobe-io-client-id

# Cloudflare KV Namespace ID (for template caching)
KV_ASSETS_ID=your-kv-namespace-id

# Analyzer Service URL (for local dev)
VITE_ANALYZER_URL=http://localhost:8787
```

> See `.env.example` for a template.

## Local Development
1. Install dependencies:
   ```sh
   pnpm install
   ```
2. Start the brand-analyzer Cloudflare Worker:
   ```sh
   pnpm --filter @brandgenie/brand-analyzer dev
   ```
3. Start the add-on UI:
   ```sh
   pnpm --filter @brandgenie/addon-ui dev
   ```
4. Load the add-on in Adobe Express (Developer Mode) using the local manifest and panel URL.

## Deployment
- **Cloudflare Worker:**
  ```sh
  pnpm --filter @brandgenie/brand-analyzer run build
  pnpm --filter @brandgenie/brand-analyzer wrangler deploy
  ```
- **Add-on UI:**
  Deploy the built static files (`dist/`) to your preferred static hosting (e.g., Vercel, Netlify, Cloudflare Pages).

## Additional Notes
- All secrets must be managed via environment variables and never committed to source control.
- For production, ensure HTTPS and CORS settings are correct for the Worker and UI.
- For Adobe Express Add-on SDK integration, see the official [Adobe Express Add-ons documentation](https://developer.adobe.com/express/add-ons/docs/).