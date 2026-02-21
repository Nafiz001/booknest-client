# BookNest Client

BookNest is a production-focused React client for a library-to-home book delivery platform.  
It includes public browsing, authentication, role-based dashboards (user, librarian, admin), wishlist/reviews, and Stripe checkout.

## Live
- Production: `https://booknest-client-jet.vercel.app`
- Local dev: `http://localhost:5173`

## Recent Update
UI/UX was fully refreshed to a professional, client-ready standard based on generated design directions from Stitch, while preserving:
- Existing server API endpoints
- Auth flow and user roles
- Payment/order/review/wishlist data contracts
- Route paths and backend connectivity

Implemented in recent passes:
- Stitch-aligned Home page with editorial hero, value cards, latest catalog preview, metro coverage section, and CTA
- Stitch-aligned All Books catalog with left filter rail, premium cards, and hover interactions
- Stitch-aligned Dashboard shell and overview panels (KPIs, habits chart, timeline)
- Functional navbar quick-search modal that fetches matching books and routes directly to `/books/:id`
- Dashboard route now renders without the public navbar/footer wrapper for layout fidelity
- Stitch-aligned Book Details editorial page with preserved review/wishlist/order flows
- Stitch-aligned Authentication screens (Login/Register) with immersive full-screen layout
- Stitch-aligned Profile Settings overview (`/dashboard/profile`) while preserving existing profile update API connection
- Stitch-aligned Secure Checkout and Payment Success experiences using existing Stripe session endpoints
- Stitch-aligned 404 page with recovery actions and trending section

## Core Features
- Premium responsive UI with dark/light theme
- Home with editorial hero, latest books, value sections, and coverage map
- All Books catalog with search, category filters, sorting, hover actions, and skeleton loading
- Book Details with reviews, wishlist, order modal, and editorial layout
- Full-screen auth experience (email/password + Google)
- Dashboard overview with KPI cards, reading habits chart, and recent activity timeline
- User dashboard:
  - My Orders
  - My Profile (settings-style UI)
  - Invoices
  - Wishlist
- Librarian dashboard:
  - Add Book
  - My Books
  - Orders management
- Admin dashboard:
  - All Users (role management)
  - Manage Books
- Stripe checkout flow:
  - Secure payment page
  - Payment success confirmation
- Custom 404 discovery page

## Tech Stack
- React `19`
- Vite `7`
- React Router DOM `7`
- Tailwind CSS `3`
- TanStack Query `5`
- Firebase Auth
- Axios
- Stripe (`@stripe/react-stripe-js`, `@stripe/stripe-js`)
- React Leaflet + Leaflet
- Lucide React
- React Hot Toast

## Routes
- Public:
  - `/`
  - `/all-books`
  - `/books/:id`
  - `/login`
  - `/register`
- Protected:
  - `/payment/:orderId`
  - `/payment-success`
  - `/dashboard`
  - `/dashboard/my-orders`
  - `/dashboard/profile`
  - `/dashboard/invoices`
  - `/dashboard/wishlist`
- Librarian:
  - `/dashboard/add-book`
  - `/dashboard/my-books`
  - `/dashboard/orders`
- Admin:
  - `/dashboard/all-users`
  - `/dashboard/manage-books`

## Setup
### 1) Install
```bash
npm install
```

### 2) Configure environment
Create `.env.local` (or `.env`) with:
```env
VITE_API_URL=http://localhost:5000/api

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

VITE_IMGBB_API_KEY=
VITE_STRIPE_PUBLISHABLE_KEY=
```

### 3) Run
```bash
npm run dev
```

### 4) Build
```bash
npm run build
```

### 5) Preview production build
```bash
npm run preview
```

### 6) Lint
```bash
npm run lint
```

## Notes
- Build is passing.
- Lint has no errors; only a few existing React hook dependency warnings in dashboard pages.
