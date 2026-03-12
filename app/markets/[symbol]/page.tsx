import React from "react";
import { MarketDetails } from "../../../components/MarketDetails";

interface Props {
  params: {
    symbol: string;
  };
}

export default async function MarketPage({ params }: Props) {
  const { symbol } = await params;
  if (!symbol) {
    return (
      <main className="min-h-screen p-4">
        <p className="text-red-600">Market symbol missing</p>
      </main>
    );
  }
  return <MarketDetails symbol={symbol} />;
}
