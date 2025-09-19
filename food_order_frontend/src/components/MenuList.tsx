"use client";
import Image from "next/image";
import { MenuItem } from "@/lib/api";
import { centsToCurrency, theme } from "@/lib/theme";

type Props = {
  items: MenuItem[];
  onAdd: (item: MenuItem) => void;
};

export function MenuList({ items, onAdd }: Props) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-2xl overflow-hidden bg-white transition hover:-translate-y-0.5"
          style={{ boxShadow: theme.shadows.card }}
        >
          <div className="relative h-44 w-full bg-gray-100">
            {item.image_url ? (
              <Image
                src={item.image_url}
                alt={item.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-4xl">
                🍽️
              </div>
            )}
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-lg text-gray-900">
                {item.name}
              </h3>
              <span
                className="px-2 py-1 rounded-md text-xs"
                style={{
                  backgroundColor: theme.colors.primary + "15",
                  color: theme.colors.primary,
                }}
              >
                {centsToCurrency(item.price_cents)}
              </span>
            </div>
            {item.description ? (
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                {item.description}
              </p>
            ) : null}
            <div className="mt-4 flex items-center justify-between">
              <span
                className="text-xs px-2 py-1 rounded-md"
                style={{
                  backgroundColor: item.is_available
                    ? theme.colors.secondary + "20"
                    : theme.colors.error + "15",
                  color: item.is_available
                    ? theme.colors.secondary
                    : theme.colors.error,
                }}
              >
                {item.is_available ? "Available" : "Unavailable"}
              </span>
              <button
                disabled={!item.is_available}
                onClick={() => onAdd(item)}
                className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: "white",
                  boxShadow: theme.shadows.soft,
                  transition: theme.transition.base,
                }}
              >
                Add
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
