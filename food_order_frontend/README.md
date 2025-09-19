# Ocean Eats Frontend (Next.js)

Modern Ocean Professional-themed UI for browsing menu, placing orders, and real-time status tracking.

## Getting Started

1) Install dependencies and run the dev server:
```bash
npm install
npm run dev
```

2) Configure backend API base URL via environment variable (optional if using default):
- Create `.env` in this folder and set:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

3) Open http://localhost:3000

## Features
- Menu browsing by category
- Cart with quantities and totals
- Order placement (POST /orders/)
- Order tracking page with polling of status and events
- Basic auth page to login/logout (session cookie based)

## Notes
- This UI expects backend at `NEXT_PUBLIC_API_BASE_URL` (defaults to http://localhost:3001/api).
- Uses TailwindCSS v4 utilities and custom theme tokens for Ocean Professional style.
