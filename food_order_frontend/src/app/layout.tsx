import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Ocean Eats - Order Fresh Food",
  description:
    "Browse menu, place orders, and track status in real time with Ocean Professional design.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Header />
        <main className="container py-6">{children}</main>
        <footer className="py-8">
          <div className="container text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Ocean Eats. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
