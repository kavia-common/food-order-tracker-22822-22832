"use client";
import { useEffect, useMemo, useState } from "react";
import { Order, api, OrderEvent } from "@/lib/api";
import { centsToCurrency, formatStatus, theme } from "@/lib/theme";

type Props = {
  initialOrderNumber?: string;
};

export function OrderTracker({ initialOrderNumber = "" }: Props) {
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [order, setOrder] = useState<Order | null>(null);
  const [events, setEvents] = useState<OrderEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function loadAll(num: string) {
    setErr(null);
    setLoading(true);
    try {
      const [o, e] = await Promise.all([
        api.getOrder(num),
        api.getOrderEvents(num),
      ]);
      setOrder(o);
      setEvents(e || []);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load order.";
      setErr(msg);
      setOrder(null);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

  // Auto-poll order status every 6s
  useEffect(() => {
    if (!orderNumber) return;
    let mounted = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const poll = async () => {
      if (!mounted) return;
      try {
        const o = await api.getOrder(orderNumber);
        if (mounted) setOrder(o);
        const ev = await api.getOrderEvents(orderNumber);
        if (mounted) setEvents(ev || []);
      } catch {
        // ignore transient errors while polling
      } finally {
        timer = setTimeout(poll, 6000);
      }
    };
    poll();
    return () => {
      mounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [orderNumber]);

  const totals = useMemo(() => {
    if (!order) return null;
    return {
      subtotal: order.subtotal_cents ?? 0,
      tax: order.tax_cents ?? 0,
      delivery: order.delivery_fee_cents ?? 0,
      total: order.total_cents ?? 0,
    };
  }, [order]);

  return (
    <section
      className="rounded-2xl p-4"
      style={{ backgroundColor: theme.colors.surface, boxShadow: theme.shadows.card }}
    >
      <h2 className="text-lg font-semibold text-gray-900">Track Your Order</h2>
      <div className="mt-3 flex items-center gap-2">
        <input
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="Enter order number"
          className="flex-1 px-3 py-2 rounded-lg border outline-none"
          style={{ borderColor: "rgba(0,0,0,0.1)" }}
          aria-label="Order number"
        />
        <button
          onClick={() => orderNumber && loadAll(orderNumber)}
          className="px-4 py-2 rounded-lg text-white"
          style={{ backgroundColor: theme.colors.primary }}
          aria-label="Search order"
        >
          Search
        </button>
      </div>

      {loading && (
        <p className="mt-3 text-sm text-gray-500">Loading order...</p>
      )}
      {err && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {err}
        </p>
      )}

      {order && (
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: "#ffffff", boxShadow: theme.shadows.soft }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="font-medium text-gray-900">{order.order_number}</p>
              </div>
              <span
                className="px-2 py-1 text-xs rounded-md"
                style={{
                  backgroundColor: theme.colors.secondary + "20",
                  color: theme.colors.secondary,
                }}
              >
                {formatStatus(order.status)}
              </span>
            </div>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Customer</span>
                <span className="text-gray-900">
                  {order.customer_name || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="text-gray-900">
                  {order.customer_email || "-"}
                </span>
              </div>
              {totals && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-gray-900">
                      {centsToCurrency(totals.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tax</span>
                    <span className="text-gray-900">
                      {centsToCurrency(totals.tax)}
                    </span>
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
                </>
              )}
            </div>
          </div>

          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: "#ffffff", boxShadow: theme.shadows.soft }}
          >
            <h4 className="text-sm font-medium text-gray-900">Status Timeline</h4>
            <ol className="mt-3 space-y-3">
              {events.length ? (
                events.map((ev, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div
                      className="h-6 w-6 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: theme.colors.primary,
                        color: "#fff",
                      }}
                      aria-hidden
                    >
                      ✓
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-gray-900">
                        {formatStatus(ev?.status || "UPDATED")}
                      </p>
                      <p className="text-xs text-gray-500">
                        {ev?.timestamp
                          ? new Date(ev.timestamp).toLocaleString()
                          : ""}
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-sm text-gray-500">No events yet.</p>
              )}
            </ol>
          </div>
        </div>
      )}
    </section>
  );
}
