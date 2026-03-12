import { Ticker24h } from "../types/binance";

// allow overriding targets via environment variables (NEXT_PUBLIC_* because used in client code)
export const REST_BASE = process.env.NEXT_PUBLIC_BINANCE_REST_BASE ;

export const WS_BASE = process.env.NEXT_PUBLIC_BINANCE_WS_BASE ;

export const STREAM_HOST = process.env.NEXT_PUBLIC_BINANCE_STREAM_HOST;

export async function get24hStats(symbol: string): Promise<Ticker24h> {
  const res = await fetch(`${REST_BASE}/v3/ticker/24hr?symbol=${symbol}`);
  if (!res.ok) {
    throw new Error(`failed to fetch 24h stats for ${symbol}`);
  }
  return res.json();
}

export async function getMultiple24hStats(symbols: string[]): Promise<Ticker24h[]> {
  // Binance expects a single `symbols` query parameter containing a JSON array
  const qs = encodeURIComponent(JSON.stringify(symbols));
  const res = await fetch(`${REST_BASE}/v3/ticker/24hr?symbols=${qs}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`failed to fetch multiple 24h stats: ${res.status} ${res.statusText} ${text}`);
  }
  return res.json();
}
