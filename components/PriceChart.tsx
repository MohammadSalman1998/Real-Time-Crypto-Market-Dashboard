import React from "react";

interface Props {
  prices: number[];
  width?: number;
  height?: number;
  color?: string;
}

export const PriceChart: React.FC<Props> = ({
  prices,
  width = 200,
  height = 50,
  color = "currentColor",
}) => {
  if (prices.length === 0) {
    return <div className="text-gray-400">no data</div>;
  }
  const max = Math.max(...prices);
  const min = Math.min(...prices);
  const range = max - min || 1;
  const points = prices
    .map((p, i) => {
      const x = (i / (prices.length - 1)) * width;
      const y = height - ((p - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        points={points}
      />
    </svg>
  );
};
