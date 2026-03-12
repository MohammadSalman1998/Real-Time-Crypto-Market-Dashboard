import { useCallback, useState } from "react";

const STORAGE_KEY = "favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const toggle = useCallback((symbol: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(symbol);
      const next = exists ? prev.filter((s) => s !== symbol) : [...prev, symbol];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error("failed to save favorites", e);
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (symbol: string) => favorites.includes(symbol),
    [favorites]
  );

  return { favorites, toggle, isFavorite };
}
