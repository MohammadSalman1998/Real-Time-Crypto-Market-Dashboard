import Link from "next/link";
import React from "react";
import { StarIcon as SolidStar } from "@heroicons/react/24/solid";
import { StarIcon as OutlineStar } from "@heroicons/react/24/outline";

interface Props {
  symbol: string;
  price?: string;
  changePercent?: string;
  favorite: boolean;
  onToggleFavorite: () => void;
}

export const MarketItem: React.FC<Props> = ({
  symbol,
  price,
  changePercent,
  favorite,
  onToggleFavorite,
}) => {
  return (
    <tr className="hover:bg-gray-100 hover:text-gray-900 dark:hover:text-gray-100">
      <td className="px-4 py-2">
        <button onClick={onToggleFavorite} aria-label="toggle favorite">
          {favorite ? (
            <SolidStar className="h-5 w-5 text-yellow-400" />
          ) : (
            <OutlineStar className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </td>
      <td className="px-4 py-2 font-medium dark:text-gray-200">
        <Link href={`/markets/${symbol.toLowerCase()}`} className="text-blue-600 hover:underline">
          {symbol}
        </Link>
      </td>
      <td className="px-4 py-2 text-right font-mono dark:text-gray-200 hover:text-gray-900">
        {price ? price : <span className="text-gray-800">—</span>}
      </td>
      <td className="px-4 py-2 text-right">
        {changePercent ? (
          <span
            className={`${
              parseFloat(changePercent) >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {parseFloat(changePercent).toFixed(2)}%
          </span>
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </td>
    </tr>
  );
};
