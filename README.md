<div align="center">
  <h1><strong>WedPlan - Client</strong></h1>
  <p>
    <strong>Live Website:</strong> <a href="YOUR_LIVE_LINK">YOUR_LIVE_LINK</a><br>
    <strong>Client Repository:</strong> <a href="YOUR_CLIENT_REPO_LINK">YOUR_CLIENT_REPO_LINK</a><br>
    <strong>Server Repository:</strong> <a href="YOUR_SERVER_REPO_LINK">YOUR_SERVER_REPO_LINK</a>
  </p>
</div>

## About 
WedPlan is a wedding planning platform. Customers find wedding services and send booking requests. Vendors publish services and manage requests. Admins review services, manage users and watch transactions.

This is the Next.js client. It also runs Better Auth (sign in, sign up, Google login and JWT issuing).

## Important Features

- Role-based app with three roles: customer, vendor, admin
- Browse, search, filter by category and location, and sort by price
- Service details page with image gallery and booking form (login required)
- Customer dashboard: overview, my bookings, cancel pending bookings
- Vendor dashboard: overview, add/edit/delete services, hide or show a service, accept or reject requests, subscription
- Admin dashboard: overview, block/unblock users, approve/reject/delete services, transactions
- Free vendors: 3 active services. Premium vendors: unlimited
- Stripe Checkout (test mode). Premium turns on only after a verified webhook
- Image upload through ImgBB (the API key stays on the server side of Next.js)
- Server-side route protection, toast messages, loading and empty states, fully responsive

## Technology Stack

Next.js 15 (App Router), JavaScript, Tailwind CSS 4, ShadCN-style components with Radix UI, Framer Motion, Better Auth, MongoDB, Sonner toasts.

## Installation

```bash
npm install
cp .env.example .env
```

Fill in `.env`:

| Variable | What it is |
| --- | --- |
| MONGODB_URI | MongoDB connection string (same database as the server) |
| DB_NAME | Database name (same as the server) |
| BETTER_AUTH_SECRET | Long random string (`openssl rand -base64 32`) |
| BETTER_AUTH_URL | URL of this client, for example http://localhost:3000 |
| NEXT_PUBLIC_API_URL | URL of the Express server, for example http://localhost:5000 |
| GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET | Google OAuth credentials |
| IMGBB_API_KEY | ImgBB API key |

Google OAuth redirect URI: `<BETTER_AUTH_URL>/api/auth/callback/google`

## How to Run Locally

```bash
npm run dev
```

Open http://localhost:3000. Start the server repo too, or API calls will fail.

## Creating the admin account

Admin accounts cannot be created from the public sign-up. Sign up normally, then run this in the server repo:

```bash
npm run make-admin -- your-admin-email@example.com
```

## Deployment notes

- Deploy to Vercel. Add every variable from `.env.example` in the project settings.
- Set `BETTER_AUTH_URL` to the live client URL.
- The Express server verifies JWTs using `<client URL>/api/auth/jwks`, so `CLIENT_URL` on the server must match this site exactly.
- Add the live Google redirect URI in the Google Cloud console.

