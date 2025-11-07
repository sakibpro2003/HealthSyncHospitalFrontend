# HealthSync Hospital – Frontend

A modern Next.js 15 application that delivers the HealthSync Hospital user experience, including appointment management, medicine catalog, blood bank dashboards, and subscription-based health packages. The app communicates with the HealthSync API server and integrates Stripe for payments.

## Tech Stack

- **Framework:** Next.js 15 (App Router) with React 19
- **Styling:** Tailwind CSS and shadcn/ui
- **State:** Redux Toolkit Query (RTK Query)
- **Payments:** Stripe Checkout
- **Icons:** lucide-react
test
## Prerequisites

- **Node.js** ≥ 18.18 (Next.js 15 requirement)
- **npm** (ships with Node) or **pnpm/yarn/bun** if you prefer
- A running instance of the HealthSync backend (see the backend README)
- Stripe account for checkout (publishable key)

## Installation

```bash
# clone the repository (if you have not already)
# git clone <repo-url>

cd health-sync-hospital-frontend
npm install
```

> If you use `pnpm`, `yarn`, or `bun`, install dependencies with your tool of choice. The project ships with an `npm` lockfile.

## Environment Variables

Create a `.env.local` file in the project root with the following keys:

```bash
# Stripe publishable key for the frontend checkout flows
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Secret used by middleware and helpers to validate JWTs
# Must match the backend JWT access secret
JWT_ACCESS_SECRET=super-secret-value
```

Additional notes:

- API requests default to `http://localhost:5000/api/v1` (configured in `src/redux/api/baseApi.ts`). Update the `baseUrl` there if your backend runs elsewhere.
- The `/api/me` route is expected to be proxied through Next.js to the backend; ensure cookies are shared across domains in development.

## Development Workflow

```bash
# start the Next.js dev server on http://localhost:3000
npm run dev
```

Hot reloading is enabled; edits to files under `src` refresh the browser automatically.

### Building & Running for Production

```bash
# create the optimized production build
npm run build

# start the compiled app
npm run start
```

### Linting

```bash
npm run lint
```

The project uses ESLint with the Next.js shareable config.

## Stripe Checkout

Several features (health packages, cart checkout, doctor bookings) redirect visitors to Stripe Checkout. Ensure you configure:

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (frontend)
- `STRIPE_SECRET_KEY` on the backend
- Corresponding webhook handling (implemented server-side)

## Working With Authenticated Routes

- The middleware expects valid JWTs and verifies them using `JWT_ACCESS_SECRET`.
- The frontend fetches the logged-in user via `/api/me` and forwards the session cookie to the backend (`credentials: "include"` in RTK Query).

## Deployment Notes

- Supply the same environment variables (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `JWT_ACCESS_SECRET`, and the backend URL) in your hosting platform.
- If the API URL differs across environments, consider moving `baseUrl` to an environment variable and reading it before creating the RTK Query client.

## Troubleshooting

- **401/403 errors** – verify cookies are forwarded and the backend is running with matching JWT secrets.
- **Stripe redirect fails** – confirm both Stripe keys are set and the backend endpoint `POST /payment/create-checkout-session` responds with a `sessionId`.
- **CORS issues** – update the backend CORS configuration to allow the host where this app runs.

---

For API details and server configuration, see the companion [HealthSync Hospital backend README](../HealthSyncHospitalServer/README.md).
