"use client";
import { useEffect, useMemo, useState } from "react";
import { api, Category, MenuItem, PlaceOrder, Order } from "@/lib/api";
import { MenuList } from "@/components/MenuList";
import { CartSidebar } from "@/components/CartSidebar";
import { theme } from "@/lib/theme";
import Link from "next/link";

type CartItem = { item: MenuItem; quantity: number };
type CatTab = { id: "all" | number; name: string };

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCat, setActiveCat] = useState<number | "all">("all");
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  // load categories
  useEffect(() => {
    api
      .categories()
      .then((c) => setCategories(c))
      .catch(() => setCategories([]));
  }, []);

  // load menu per category
  useEffect(() => {
    const category_id = activeCat === "all" ? undefined : Number(activeCat);
    api
      .menuItems({ category_id })
      .then((m) => setMenu(m))
      .catch((e: unknown) => {
        console.error(e);
        setMenu([]);
      });
  }, [activeCat]);

  function addToCart(item: MenuItem) {
    setCart((prev) => {
      const found = prev.find((p) => p.item.id === item.id);
      if (found) {
        return prev.map((p) =>
          p.item.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  }

  function changeQty(id: number, qty: number) {
    setCart((prev) =>
      prev.map((c) => (c.item.id === id ? { ...c, quantity: qty } : c))
    );
  }

  function removeFromCart(id: number) {
    setCart((prev) => prev.filter((c) => c.item.id !== id));
  }

  async function placeOrder(payload: PlaceOrder) {
    setBusy(true);
    setError(null);
    try {
      const created = await api.placeOrder(payload);
      setOrderPlaced(created);
      setCart([]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to place order.";
      setError(msg);
    } finally {
      setBusy(false);
    }
  }

  const catTabs: CatTab[] = useMemo(
    () =>
      ([{ id: "all" as const, name: "All" }] as CatTab[]).concat(
        categories.map((c) => ({ id: c.id, name: c.name }))
      ),
    [categories]
  );

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-6">
      <section className="space-y-5">
        <div
          className="rounded-2xl p-6"
          style={{
            backgroundColor: theme.colors.surface,
            boxShadow: theme.shadows.card,
          }}
        >
          <div className="flex flex-wrap items-center gap-2">
            {catTabs.map((c) => {
              const id = c.id;
              const label = c.name;
              const active = activeCat === id;
              return (
                <button
                  key={`${id}`}
                  onClick={() => setActiveCat(id)}
                  className="px-3 py-1.5 rounded-lg text-sm"
                  style={{
                    backgroundColor: active
                      ? theme.colors.primary
                      : "rgba(0,0,0,0.04)",
                    color: active ? "#fff" : theme.colors.text,
                    boxShadow: active ? theme.shadows.soft : "none",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div
            className="rounded-lg p-3 text-sm"
            style={{ backgroundColor: "#fee2e2", color: "#991b1b" }}
            role="alert"
          >
            {error}
          </div>
        )}

        <MenuList items={menu} onAdd={addToCart} />

        {orderPlaced && (
          <div
            className="rounded-2xl p-5 mt-4"
            style={{
              backgroundColor: theme.colors.surface,
              boxShadow: theme.shadows.card,
            }}
          >
            <p className="text-gray-900 font-medium">
              Thank you! Your order has been placed.
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Order Number:{" "}
              <span className="font-mono">{orderPlaced.order_number}</span>
            </p>
            <Link
              href={`/track?order=${encodeURIComponent(orderPlaced.order_number)}`}
              className="inline-block mt-3 px-4 py-2 rounded-lg text-white"
              style={{ backgroundColor: theme.colors.primary }}
            >
              Track this order
            </Link>
          </div>
        )}
      </section>

      <CartSidebar
        items={cart}
        onChangeQty={changeQty}
        onRemove={removeFromCart}
        onPlaceOrder={placeOrder}
        busy={busy}
      />
    </div>
  );
}
