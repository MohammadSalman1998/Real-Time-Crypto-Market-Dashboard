"use client";

import { useEffect, useState } from "react";
import { useWebSocket, ConnectionStatus } from "../hooks/useWebSocket";
import { useFavorites } from "../hooks/useFavorites";
import { get24hStats, WS_BASE } from "../lib/binance";
import { StreamTicker, Ticker24h } from "../types/binance";
import { PriceChart } from "./PriceChart";
import { StarIcon as SolidStar } from "@heroicons/react/24/solid";
import { StarIcon as OutlineStar } from "@heroicons/react/24/outline";

interface Props {
  symbol: string;
}

export const MarketDetails: React.FC<Props> = ({ symbol }) => {
  const upper = symbol.toUpperCase();
  const [initial, setInitial] = useState<Ticker24h | null>(null);
  const [live, setLive] = useState<StreamTicker | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [history, setHistory] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { isFavorite, toggle } = useFavorites();

  useEffect(() => {
    get24hStats(upper)
      .then((d) => setInitial(d))
      .catch((e) => {
        console.error(e);
        setError(String(e));
      });
  }, [upper]);

  useWebSocket<StreamTicker>(`${WS_BASE}/ws/${symbol}@ticker`, {
    onMessage: (data) => {
      if (data && data.e === "24hrTicker") {
        setLive(data);
        setHistory((h) => {
          const price = parseFloat(data.c);
          const next = [...h, price].slice(-100);
          return next;
        });
      }
    },
    onOpen: () => setStatus("connected"),
    onClose: () => setStatus("disconnected"),
    onError: () => setStatus("disconnected"),
  });

  const price = live ? parseFloat(live.c) : initial ? parseFloat(initial.lastPrice) : null;
  const change =
    live ? parseFloat(live.P) : initial ? parseFloat(initial.priceChangePercent) : null;
  const time = live ? new Date(live.E) : initial ? new Date(initial.closeTime) : null;

  if (error) {
    return (
      <main className="min-h-screen p-4">
        <p className="text-red-600">Error loading market data: {error}</p>
      </main>
    );
  }

  return (
    <main className="h-screen p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl text-amber-800 font-bold">{upper}</h1>
          <button
            onClick={() => toggle(upper)}
            aria-label="toggle favorite"
            className="hover:scale-110 transition-transform hover:text-yellow-300"
          >
            {isFavorite(upper) ? (
              <SolidStar className="h-6 w-6 text-yellow-400" />
            ) : (
              <OutlineStar className="h-6 w-6 text-gray-400" />
            )}
          </button>
        </div>
        <div className="mb-4 text-xl">
          <span className="font-mono text-black">{price !== null ? price.toFixed(6) : "—"}</span>
          {change !== null && (
            <span
              className={
                change >= 0 ? "text-green-600 ml-2" : "text-red-600 ml-2"
              }
            >
              ({change.toFixed(2)}%)
            </span>
          )}
        </div>
        {time && (
          <div className="text-sm text-gray-800 mb-4">
            Last update: {time.toLocaleTimeString()}
          </div>
        )}
        <div className="mb-6 text-black">
          <strong>Connection:</strong>{" "}
          <span
            className={
              status === "connected"
                ? "text-green-600"
                : status === "connecting"
                ? "text-yellow-600"
                : "text-red-600"
            }
          >
            {status}
          </span>
        </div>
        <div className="mb-6">
          <PriceChart prices={history} width={320} height={100} color="blue" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          {initial && (
            <div className="bg-gray-100 p-3 rounded">
              <div className="text-sm">24h high</div>
              <div className="font-medium">{parseFloat(initial.highPrice).toFixed(6)}</div>
            </div>
          )}
          {initial && (
            <div className="bg-gray-100 p-3 rounded">
              <div className="text-sm">24h low</div>
              <div className="font-medium">{parseFloat(initial.lowPrice).toFixed(6)}</div>
            </div>
          )}
          {initial && (
            <div className="bg-gray-100 p-3 rounded col-span-full">
              <div className="text-sm">Volume</div>
              <div className="font-medium">{parseFloat(initial.volume).toFixed(2)}</div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
