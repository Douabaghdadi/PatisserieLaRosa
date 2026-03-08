"use client";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <FavoritesProvider>
        {children}
      </FavoritesProvider>
    </CartProvider>
  );
}
