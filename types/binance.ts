export interface Ticker24h {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

// WebSocket ticker stream payload
export interface StreamTicker {
  e: string; // event type
  E: number; // event time
  s: string; // symbol
  p: string; // price change
  P: string; // price change percent
  w: string; // weighted average price
  x: string; // first trade price
  c: string; // last price
  Q: string; // last quantity
  b: string; // best bid price
  B: string; // best bid quantity
  a: string; // best ask price
  A: string; // best ask quantity
  o: string; // open price
  h: string; // high price
  l: string; // low price
  v: string; // total traded base asset volume
  q: string; // total traded quote asset volume
  O: number; // statistics open time
  C: number; // statistics close time
  F: number; // first trade ID
  L: number; // last trade ID
  n: number; // total number of trades
}
