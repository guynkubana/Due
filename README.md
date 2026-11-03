# DUE

Custom storefront for DUE — an independent fashion brand based in Kigali, Rwanda. Built with React + Vite, powered entirely by the [Mugikari](https://mugikari.xyz) Headless API for products, orders, and newsletter subscriptions.

---

## Stack

| Layer | Technology |
|---|---|
| UI | React 19 + Vite 8 |
| Styling | Single global CSS file (`src/index.css`) — no CSS-in-JS, no modules |
| API | Mugikari Headless API |
| Image CDN | Cloudinary (URLs served by Mugikari) |
| Contact form | Formspree |
| Linter | oxlint |

No TypeScript. No router library. No state management library. View switching is done via `document.body.className = 'view-{name}'` — all views are always in the DOM, CSS controls visibility.

---

## Getting started

### Prerequisites

- Node.js 18+
- A Mugikari API key for the Due store

### Install

```bash
npm install
```

### Environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```env
VITE_MUGIKARI_API_KEY=your_api_key_here
VITE_MUGIKARI_STORE=Due
VITE_MUGIKARI_BASE=https://api.mugikari.xyz
```

`.env` is gitignored and must never be committed. `.env.example` has all keys with defaults as a template.

### Dev server

```bash
npm run dev
```

The dev server runs on `http://localhost:5173` (or the next available port). Both `.env` and `.env.development` point `VITE_MUGIKARI_BASE` directly to `https://api.mugikari.xyz`, so requests go straight to the API — no proxy needed. A Vite proxy for `/api` is still configured in `vite.config.js` as a fallback but is not used in normal development.

### Build

```bash
npm run build
```

Output goes to `dist/`. Preview the production build locally:

```bash
npm run preview
```

---

## Project structure

```
due/
├── public/
│   ├── images/
│   │   ├── logo.png          # Static wordmark + favicon
│   │   └── logo-anim.gif     # Animated logo (home hub + password screen)
│   └── icons.svg
├── src/
│   ├── api/
│   │   └── mugikari.js       # All API calls — the only file that knows the base URL and key
│   ├── components/
│   │   ├── CheckoutView.jsx  # Bag, totals, delivery form, order submission, confirmation
│   │   ├── ContactView.jsx   # Contact form → Formspree
│   │   ├── EmailModal.jsx    # Footer newsletter modal → Mugikari newsletter API
│   │   ├── HomeHub.jsx       # Compass-point home navigation
│   │   ├── LookbookView.jsx  # Lookbook image grid
│   │   ├── PasswordGate.jsx  # Password gate + newsletter subscribe → Mugikari newsletter API
│   │   ├── PreviewModal.jsx  # Product gallery, size selector, add to bag
│   │   ├── SearchBar.jsx     # Client-side product search
│   │   ├── ShopStage.jsx     # Product stage — flip, shuffle, magnifier, navigation
│   │   ├── SizeGuideModal.jsx# Size chart table (hidden when product has no chart)
│   │   └── TermsPanel.jsx    # Full terms & conditions slide-up panel
│   ├── hooks/
│   │   ├── useCheckout.js    # Bag state, discount validation, order submission
│   │   ├── useMagnifier.js   # Pointer-event magnifier (hover zoom + touch lift)
│   │   └── useProducts.js    # Fetches product catalog + store metadata on mount
│   ├── utils/
│   │   ├── fmt.js            # RWF price formatter: 5000 → "5,000 RWF"
│   │   └── img.js            # Cloudinary URL optimizer: injects f_auto,q_auto,w_{n}
│   ├── App.jsx               # Root component — view state, navigation, modal orchestration
│   ├── index.css             # All styles (verbatim from original design)
│   └── main.jsx              # Vite entry point
├── _legacy.html              # Original single-file storefront (kept as reference)
├── .env.example
├── .gitignore
├── vite.config.js
└── package.json
```

---

## API integration

All Mugikari API calls go through `src/api/mugikari.js`. Components never fetch directly.

| Function | Endpoint | Used by |
|---|---|---|
| `fetchStore()` | `GET /api/public/store` | `useProducts` on mount |
| `fetchProducts()` | `GET /api/public/products` | `useProducts` on mount |
| `fetchProductById()` | `GET /api/public/products/:id` | Available, not used in current UI |
| `validateDiscount()` | `POST /api/public/discounts/validate` | `useCheckout.checkDiscount()` |
| `subscribeNewsletter()` | `POST /api/public/newsletter` | `PasswordGate`, `EmailModal` |
| `submitOrder()` | `POST /api/public/orders` | `useCheckout.placeOrder()` |

### Image optimisation

`imgUrl(url, width)` in `src/utils/img.js` injects Cloudinary transforms (`f_auto,q_auto,w_{width}`) into any Cloudinary URL before it's rendered. This serves WebP on supported browsers and right-sizes images to avoid loading full-resolution files. Non-Cloudinary URLs pass through unchanged.

### Idempotency

Each checkout attempt generates a UUID v4 via `crypto.randomUUID()`. The same key is reused on retries so a duplicate submission returns the existing order rather than creating a new one. The key is reset only on confirmed success.

---

## Views

The app has one URL and no router. `App.jsx` maintains a `view` string in state and sets `document.body.className = 'view-' + view` on every change. CSS rules like `body.view-shop main { display: flex }` control which view is visible. All views are always mounted.

| View name | What the user sees |
|---|---|
| `password` | Password gate with newsletter subscribe |
| `home` | Compass-point home hub |
| `shop` | Product stage with navigation and magnifier |
| `lookbook` | Lookbook image grid |
| `contact` | Contact form |
| `checkout` | Bag, checkout form, and order confirmation |

Modals (`PreviewModal`, `SizeGuideModal`, `SearchBar`, `TermsPanel`, `EmailModal`) layer on top of the current view via `open` props.

---

## Checkout flow

1. User browses the shop stage → clicks **Discover** → `PreviewModal` opens
2. User selects a size (if variants exist) → clicks **Add to bag** → navigates to checkout
3. In `CheckoutView`: reviews bag, optionally applies a discount code (advisory pre-validation via Mugikari), fills delivery details
4. Submits → `useCheckout.placeOrder()` posts to `POST /api/public/orders`
5. On success: bag clears, confirmation screen shows the order number and `store.paymentInstructions` from the store metadata fetched on load
6. Mugikari sends confirmation emails to both the merchant and the customer automatically

Card payments show a "not available yet" message. Only Mobile Money is active.

---

## Environment notes

| File | Committed | Purpose |
|---|---|---|
| `.env` | No | Live API key and config |
| `.env.development` | Yes | Sets `VITE_MUGIKARI_BASE=https://api.mugikari.xyz` for local dev |
| `.env.example` | Yes | Template with all keys empty |

---

## Deployment

The app builds to a static `dist/` folder and can be deployed to any static host (Vercel, Netlify, etc.).

For Vercel: import the GitHub repo, set the three `VITE_*` environment variables in the Vercel project settings, and deploy. No additional configuration needed — Vite's output is a standard static site.

> Set `VITE_MUGIKARI_BASE=https://api.mugikari.xyz` in Vercel's environment variables. Using `https://mugikari.xyz` (without the `api.` subdomain) will cause CORS failures in production due to a server-side redirect that browsers block during preflight.
