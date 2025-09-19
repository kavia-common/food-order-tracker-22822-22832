"use client";
import { useMemo, useState } from "react";
import { MenuItem, PlaceOrder } from "@/lib/api";
import { centsToCurrency, theme } from "@/lib/theme";

type CartItem = {
  item: MenuItem;
  quantity: number;
};

type Props = {
  items: CartItem[];
  onChangeQty: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
  onPlaceOrder: (payload: PlaceOrder) => Promise<void>;
  busy?: boolean;
};

export function CartSidebar({
  items,
  onChangeQty,
  onRemove,
  onPlaceOrder,
  busy,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [instructions, setInstructions] = useState("");

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (acc, it) => acc + it.item.price_cents * it.quantity,
      0
    );
    const tax = Math.round(subtotal * 0.08);
    const delivery = 0;
    const total = subtotal + tax + delivery;
    return { subtotal, tax, delivery, total };
  }, [items]);

  async function submit() {
    if (!items.length) return;
    const payload: PlaceOrder = {
      customer: {
        name,
        email,
      },
      items: items.map((it) => ({
        menu_item_id: it.item.id,
        quantity: it.quantity,
      })),
      special_instructions: instructions || undefined,
      delivery_fee_cents: totals.delivery,
    };
    await onPlaceOrder(payload);
    setInstructions("");
  }

  return (
    <aside
      className="rounded-2xl p-4 sticky top-24"
      style={{
        backgroundColor: theme.colors.surface,
        boxShadow: theme.shadows.card,
      }}
    >
      <h3 className="text-lg font-semibold text-gray-900">Your Order</h3>
      <div className="mt-3 space-y-3 max-h-[50vh] overflow-auto pr-1">
        {items.length === 0 ? (
          <p className="text-sm text-gray-500">
            Your cart is empty. Add delicious items from the menu.
          </p>
        ) : (
          items.map((ci) => (
            <div
              key={ci.item.id}
              className="flex items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-900">
                  {ci.item.name}
                </p>
                <p className="text-xs text-gray-500">
                  {centsToCurrency(ci.item.price_cents)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="h-7 w-7 rounded-md text-white"
                  onClick={() => onChangeQty(ci.item.id, Math.max(1, ci.quantity - 1))}
                  style={{ backgroundColor: theme.colors.primary }}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="text-sm w-6 text-center">{ci.quantity}</span>
                <button
                  className="h-7 w-7 rounded-md text-white"
                  onClick={() => onChangeQty(ci.item.id, ci.quantity + 1)}
                  style={{ backgroundColor: theme.colors.primary }}
                  aria-label="Increase quantity"
                >
                  +
                </button>
                <button
                  className="text-xs px-2 py-1 rounded-md"
                  onClick={() => onRemove(ci.item.id)}
                  style={{
                    backgroundColor: theme.colors.error + "15",
                    color: theme.colors.error,
                  }}
                  aria-label="Remove item"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 border-t pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Subtotal</span>
          <span className="text-gray-900">
            {centsToCurrency(totals.subtotal)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Tax</span>
          <span className="text-gray-900">{centsToCurrency(totals.tax)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Delivery</span>
          <span className="text-gray-900">
            {centsToCurrency(totals.delivery)}
          </span>
        </div>
        <div className="flex justify-between font-semibold">
          <span className="text-gray-900">Total</span>
          <span className="text-gray-900">
            {centsToCurrency(totals.total)}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div className="grid grid-cols-1 gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full px-3 py-2 rounded-lg border outline-none"
            style={{ borderColor: "rgba(0,0,0,0.1)" }}
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            type="email"
            className="w-full px-3 py-2 rounded-lg border outline-none"
            style={{ borderColor: "rgba(0,0,0,0.1)" }}
          />
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Special instructions (optional)"
            rows={3}
            className="w-full px-3 py-2 rounded-lg border outline-none resize-none"
            style={{ borderColor: "rgba(0,0,0,0.1)" }}
          />
        </div>
        <button
          disabled={busy || items.length === 0 || !name || !email}
          onClick={submit}
          className="w-full py-3 rounded-lg font-medium disabled:opacity-50"
          style={{
            backgroundColor: theme.colors.secondary,
            color: "#111827",
            boxShadow: theme.shadows.soft,
            transition: theme.transition.slow,
          }}
        >
          {busy ? "Placing order..." : "Place Order"}
        </button>
      </div>
    </aside>
  );
}
