import React from "react";
import { theme } from "@/lib/theme";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container py-12">
      <section
        className="rounded-2xl p-8 text-center"
        style={{ backgroundColor: theme.colors.surface, boxShadow: theme.shadows.card }}
        role="alert"
        aria-live="assertive"
      >
        <h1 className="text-2xl font-semibold text-gray-900">404 – Page Not Found</h1>
        <p className="mt-2 text-gray-600">
          The page you’re looking for doesn’t exist.
        </p>
        <Link
          href="/"
          className="inline-block mt-4 px-4 py-2 rounded-lg text-white"
          style={{ backgroundColor: theme.colors.primary }}
        >
          Go Home
        </Link>
      </section>
    </main>
  );
}
