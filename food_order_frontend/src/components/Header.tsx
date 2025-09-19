"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx, theme } from "@/lib/theme";

export function Header() {
  const pathname = usePathname();

  const nav = [
    { href: "/", label: "Menu" },
    { href: "/track", label: "Track Order" },
  ];

  return (
    <header
      className="sticky top-0 z-30 backdrop-blur"
      style={{
        background:
          "linear-gradient(to right, " +
          theme.colors.gradientFrom +
          ", " +
          theme.colors.gradientTo +
          ")",
        borderBottom: `1px solid rgba(37, 99, 235, 0.12)`,
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="Go to menu"
        >
          <div
            className="h-9 w-9 rounded-xl flex items-center justify-center"
            style={{
              background: theme.colors.primary,
              color: "white",
              boxShadow: theme.shadows.soft,
              transition: theme.transition.base,
            }}
          >
            🐟
          </div>
          <div className="flex flex-col">
            <span
              className="text-lg font-semibold"
              style={{ color: theme.colors.text }}
            >
              Ocean Eats
            </span>
            <span
              className="text-xs"
              style={{ color: "rgba(17,24,39,0.6)" }}
            >
              Fresh. Fast. Professional.
            </span>
          </div>
        </Link>
        <nav className="flex items-center gap-1">
          {nav.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={clsx(
                  "px-4 py-2 rounded-lg text-sm transition",
                  active
                    ? "font-semibold"
                    : "hover:-translate-y-0.5 hover:shadow"
                )}
                style={{
                  color: active ? theme.colors.primary : theme.colors.text,
                  backgroundColor: active ? "#ffffff" : "transparent",
                }}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
