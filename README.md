# Crypto Market Dashboard

A small Next.js (App Router) application that displays real‑time cryptocurrency market data using Binance public APIs.

## Setup & Run

```bash
npm install
npm run dev      # start development server on http://localhost:3000
npm run build     # build for production
npm start         # run production build locally
```

No environment variables are required; all data is fetched from public Binance endpoints.  
However, you can override the base URLs via environment variables (use `NEXT_PUBLIC_` prefix so they're available on the client):

```env
# .env.local or .env.example
NEXT_PUBLIC_BINANCE_REST_BASE=https://data-api.binance.vision/api
NEXT_PUBLIC_BINANCE_WS_BASE=wss://stream.binance.com:9443
NEXT_PUBLIC_BINANCE_STREAM_HOST=stream.binance.com:9443
```

These are useful when pointing at a proxy, a mock server or switching networks without touching code.

## Key Features

- **Markets List**: shows 10 popular trading pairs with latest price and 24h change.
- **Market Details**: dedicated page per symbol with live updates via WebSocket, price chart, high/low/volume.
- **Real-time**: WebSocket combined streams for list and individual streams for details.
- **Connection Status**: UI displays socket state and auto-reconnects.
- **Favorites**: users can mark pairs as favorites; persisted in `localStorage`.
- **UX quality**: loading, error and empty states; header and navigation.

## Architecture Notes

- **Folder structure**: `app/` holds pages; `components/` reusable UI; `hooks/` custom hooks; `lib/` API helpers; `types/` shared TypeScript interfaces.
- **Data flow**: REST calls (via `lib/binance.ts`) provide initial state; live updates merge through WebSocket hooks (`useWebSocket`). List page additionally merges combined stream updates.
- **State management**: local component state plus custom hooks (`useFavorites`) and standard React patterns; no external state library.
- **Resilience**: WebSocket hook handles automatic retries with exponential backoff; error handling for REST fetches; UI shows status.

## Technical choices & trade-offs

- Used TypeScript and Tailwind CSS for type safety and rapid styling.
- Implemented a simple SVG sparkline chart to keep bundle size small rather than a full charting library.
- Combined stream for list keeps network usage efficient and reduces number of sockets.
- Did not cache data beyond component state; could add SWR or dedicated cache later.

## What could be improved

- Add UI tests and end-to-end tests.
- Support selectable chart ranges or candlestick charts using a library.
- Memoize WebSocket subscriptions per symbol to avoid reconnects when navigating.
- Move REST calls to server components and leverage Next.js caching.
- Add offline handling and more graceful fallback when both REST and WS fail.

## License

MIT (for demonstration purposes)

