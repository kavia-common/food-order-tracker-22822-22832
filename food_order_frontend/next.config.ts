import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static HTML export for the App Router
  output: "export",
  // Ensure Next.js doesn't expect a custom _document (not used in App Router)
  trailingSlash: true,
  // Allow remote images used in menu items
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "**" },
      { protocol: "https", hostname: "**" },
    ],
    unoptimized: true, // needed for next export when using next/image
  },
};

export default nextConfig;
