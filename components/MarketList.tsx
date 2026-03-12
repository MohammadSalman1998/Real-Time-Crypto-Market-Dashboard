"use client";

import React, { useEffect, useState } from "react";
import { MarketItem } from "./MarketItem";
import { Ticker24h } from "../types/binance";
import { getMultiple24hStats, WS_BASE } from "../lib/binance";
import { useFavorites } from "../hooks/useFavorites";
import { useWebSocket } from "../hooks/useWebSocket";

interface Props {
  symbols: string[];
}

export const MarketList: React.FC<Props> = ({ symbols }) => {
  const { toggle, isFavorite } = useFavorites();
  const [data, setData] = useState<Record<string, Ticker24h>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  // fetch initial REST stats with async helper to avoid sync setState
  useEffect(() => {
    let canceled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const arr = await getMultiple24hStats(symbols);
        if (canceled) return;
        const map: Record<string, Ticker24h> = {};
        arr.forEach((item) => {
          map[item.symbol] = item;
        });
        setData(map);
      } catch (e) {
        console.error("fetch failed", e);
        if (!canceled) setError(String(e));
      } finally {
        if (!canceled) setLoading(false);
      }
    }
    load();
    return () => {
      canceled = true;
    };
  }, [symbols, fetchTrigger]);

  // combined websocket stream for real-time updates
  const streamNames = symbols.map((s) => s.toLowerCase() + "@ticker").join("/");
  const url = `${WS_BASE}/stream?streams=${streamNames}`;

  interface CombinedMsg {
    stream: string;
    data: {
      s: string;
      c: string;
      P: string;
      // other ticker fields omitted
    };
  }

  const { status: wsStatus } = useWebSocket<CombinedMsg>(url, {
    onMessage: (msg) => {
      if (msg && msg.data && msg.data.s) {
        setData((prev) => ({
          ...prev,
          [msg.data.s]: {
            ...prev[msg.data.s],
            lastPrice: msg.data.c,
            priceChangePercent: msg.data.P,
          },
        }));
      }
    },
    onOpen: () => {},
    onClose: () => {},
    onError: () => {},
  });

  if (loading) {
    return <p className="p-4 text-center">Loading markets…</p>;
  }
  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-600">Error: {error}</p>
        <button
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setFetchTrigger((t) => t + 1)}
        >
          Retry
        </button>
      </div>
    );
  }

  // put favorites at top
  const sorted = [...symbols].sort((a, b) => {
    const fa = isFavorite(a) ? 0 : 1;
    const fb = isFavorite(b) ? 0 : 1;
    if (fa !== fb) return fa - fb;
    return a.localeCompare(b);
  });

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="px-4 py-2 mb-2 text-sm text-gray-500 dark:text-gray-400">Socket: {wsStatus}</div>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="w-12"></th>
            <th className="text-left px-4 py-2 font-semibold">Symbol</th>
            <th className="text-right px-4 py-2 font-semibold">Price</th>
            <th className="text-right px-4 py-2 font-semibold">24h%</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {sorted.map((sym) => {
            const stat = data[sym];
            return (
              <MarketItem
                key={sym}
                symbol={sym}
                price={stat?.lastPrice}
                changePercent={stat?.priceChangePercent}
                favorite={isFavorite(sym)}
                onToggleFavorite={() => toggle(sym)}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
