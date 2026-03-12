"use client";

import { MarketList } from "../components/MarketList";

// a small set of popular spot pairs; could be changed or loaded from config
const SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "SOLUSDT",
  "ADAUSDT",
  "XRPUSDT",
  "DOGEUSDT",
  "MATICUSDT",
  "LTCUSDT",
  "DOTUSDT",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* hero */}
      <section className="hero-gradient text-white section">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Real‑Time Crypto Dashboard
          </h1>
          <p className="text-lg sm:text-xl mb-6">
            Track live prices and market stats for top trading pairs powered by Binance stream.
          </p>
          <a href="#markets" className="button-cta">
            View Markets
          </a>
        </div>
      </section>

      {/* markets list */}
      <section id="markets" className="section">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold mb-6">Popular Pairs</h2>
          <MarketList symbols={SYMBOLS} />
        </div>
      </section>
    </main>
  );
}
