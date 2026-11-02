# Due × Mugikari — Build Plan

> **Status:** Brainstorm / pre-build. Spec is still evolving — audit this file against the latest `mugikari-storefront-llm-spec.md` before each phase begins.

---

## Overview

Rewrite the Due storefront from a single 2,768-line `index.html` into a React + Vite app fully powered by the Mugikari Headless API. Same look, same interactions, zero hardcoded product data.

The current file runs in two modes: local hardcoded products (USD) and a Mugikari overlay that matches products by name. We are dropping the local-data fallback entirely. The API is the single source of truth for products, prices, inventory, variants, and payment instructions. If the API is unreachable, the app shows a clear error state — it does not silently fall back to stale data.

**What must stay pixel-identical:**
- Every CSS rule (moved to `src/index.css` verbatim, nothing renamed)
- Password gate, home hub, lookbook, contact form, shop stage, preview modal, size guide, bag, checkout form, order confirmation
- Arrow/keyboard navigation and random-shuffle product cycling
- Front/back image flip animation
- Magnifier zoom on hover (desktop) and touch (mobile)
- RWF currency display — whole integers, no decimals
- All responsive breakpoints (`820px`, `640px`, `420px`)

---

## Mugikari API — current endpoints

Based on the spec as of the current version. **Spec is still evolving — re-check before building each phase.**

| Endpoint | Purpose |
| --- | --- |
| `GET /api/public/store?storeName=Due` | Store metadata: shipping fee, payment instructions, theme, customCss |
| `GET /api/public/products?storeName=Due` | Full product catalog (supports `search` and `category` filters) |
| `GET /api/public/products/:id?storeName=Due` | Single product detail |
| `POST /api/public/discounts/validate` | Validate a promo code and preview savings before order submission |
| `POST /api/public/orders?storeName=Due` | Submit checkout order — stock decremented atomically |

**Important behaviours to implement correctly:**
- `paymentInstructions` comes from `GET /api/public/store`, **not** from the order response. Fetch it once on load, display it on the confirmation screen.
- `idempotencyKey` is a UUID v4 generated once per checkout attempt. Reuse the same key on retries — a 200 response with an existing order is not an error.
- `discountCode` and `deliveryNotes` are optional fields on the order body.
- The discount validate endpoint is advisory only — the server re-validates at order creation time.
- Only `active` products are returned. `inventoryCount: 0` products should be shown but marked out-of-stock.

---

## Mugikari API — fields now available

The following fields are confirmed in the current spec and will be used directly:

| Field | Type | Notes |
| --- | --- | --- |
| `description` | `string \| null` | Shown in preview modal. Hidden when null. |
| `materials` | `string \| null` | Fabric/material line. Hidden when null. |
| `careInstructions` | `string \| null` | Care line. Hidden when null. Note: field is `careInstructions`, not `care`. |
| `images` | `{ id, url, position }[]` | Sorted by `position`. Position 0 = front (stage + flip front), position 1 = back (flip back). Preview gallery cycles all. `imageUrl` is always the position-0 URL — use either, prefer `images[]`. |
| `sizeChart` | `string \| null` | **See flag below.** |

**Flag — `sizeChart` is a string, not a structured object.**
The current UI renders a full measurements table (`columns` + `rows`). A raw string can't drive that. Two options:

1. **Store it as a JSON string** — the API stores and returns the chart as a serialised `{ columns, rows }` JSON string; the storefront calls `JSON.parse(product.sizeChart)` to get the structured data.
2. **Change the field type to an object** — the API returns the chart as a native JSON object (cleaner, no parse step needed).

Option 2 is preferred. Until this is resolved the size guide table will be hidden and variant names (S, M, L, XL) will be used as the size selector buttons only.

## Mugikari API — fields still needed (wishlist)

One gap remaining:

| Field | Type | Purpose |
| --- | --- | --- |
| `details` | `string[]` | 2–4 bullet points (fit, construction, origin). Shown as a `— item` list in the preview modal detail section. |

> Once `sizeChart` type is resolved and `details` lands, the preview modal will be fully API-driven with no hardcoded fallbacks.

---

## Formspree + EmailJS — drop both

Mugikari sends both the merchant notification email and the customer confirmation email natively. Neither Formspree nor EmailJS is needed. Both are removed in the rewrite:

- Remove the Formspree `fetch` call from the order submission flow
- Remove the EmailJS CDN `<script>` tag
- Remove `EMAILJS_*` and `FORMSPREE_ENDPOINT` constants

No `.env` variables are needed for either service.

---

## Tech stack

**React 18 + Vite.** The existing file is already a single-page app in everything but name — it manages views, state, modals, and async calls with vanilla JS. React makes that structure explicit without adding complexity.

| Concern | Today | After |
| --- | --- | --- |
| API state (loading, error, data) | Ad-hoc flags scattered in JS | `useState` / `useEffect` in hooks |
| Environment variables | Hardcoded in the file | `.env` with `VITE_` prefix, never committed |
| Code organisation | 2,768 lines in one file | One component per view/modal |
| Build output | Static HTML, no build step | `vite build` → static `dist/` folder |

**What we are NOT adding:**
- No TypeScript
- No CSS-in-JS or CSS modules (global `src/index.css`, unchanged)
- No state management library
- No router library (view switching via `useState`, same as today)
- No UI component library

---

## Environment variables

**`.env` (not committed):**
```
VITE_MUGIKARI_API_KEY=YOUR_API_KEY
VITE_MUGIKARI_STORE=Due
VITE_MUGIKARI_BASE=https://mugikari.xyz
```

**`.env.example` (committed):**
```
VITE_MUGIKARI_API_KEY=
VITE_MUGIKARI_STORE=
VITE_MUGIKARI_BASE=
```

**`.gitignore` entries:**
```
.env
.env.local
.claude/
mugikari-storefront-llm-spec.md
node_modules/
dist/
```

---

## Project structure

```
due/
├── public/
│   └── images/              # product images (same folder, same filenames as today)
├── src/
│   ├── index.css            # all existing CSS, copied verbatim
│   ├── main.jsx             # Vite entry — mounts <App />
│   ├── App.jsx              # top-level view switcher
│   ├── api/
│   │   └── mugikari.js      # fetchProducts(), fetchStore(), validateDiscount(), submitOrder()
│   ├── hooks/
│   │   ├── useProducts.js   # loads products + store metadata on mount
│   │   └── useCheckout.js   # bag state, discount code, order submission
│   └── components/
│       ├── PasswordGate.jsx
│       ├── HomeHub.jsx
│       ├── ShopStage.jsx        # arrow navigation, flip, magnifier, counter, name, price
│       ├── PreviewModal.jsx     # gallery, thumbnails, swipe, size selector, add to bag
│       ├── SizeGuideModal.jsx   # measurements table, row-click to select size
│       ├── LookbookView.jsx
│       ├── ContactView.jsx
│       ├── CheckoutView.jsx     # bag items, totals, discount field, checkout form
│       ├── SearchBar.jsx
│       └── TermsPanel.jsx
├── .env
├── .env.example
├── .gitignore
├── index.html               # Vite HTML shell (<div id="root"> + script tag)
├── package.json
└── vite.config.js
```

`src/api/mugikari.js` is the only place that knows the base URL and API key. Components receive data via props or context — nothing fetches directly from a component.

---

## Build phases

### Phase 1 — Scaffold
1. Run `npm create vite@latest . -- --template react` in the repo root.
2. Delete Vite boilerplate (`src/App.css`, `src/App.jsx`, `src/assets/`).
3. Move existing `images/` into `public/images/` so asset paths survive the build unchanged.
4. Create `.env`, `.env.example`, and `.gitignore`.
5. `npm install`.

### Phase 2 — CSS + static shell
6. Copy all CSS from the existing `index.html` `<style>` block verbatim into `src/index.css`.
7. Import `src/index.css` in `src/main.jsx`.
8. Build a bare `App.jsx` that renders the root `<div>` with correct body classes. Confirm the page is blank but styled correctly.

### Phase 3 — API layer
9. Create `src/api/mugikari.js` with `fetchProducts()`, `fetchStore()`, `validateDiscount()`, and `submitOrder()`. Plain async functions only — no React inside this file.
10. Create `src/hooks/useProducts.js`: calls `fetchProducts()` and `fetchStore()` on mount, returns `{ products, store, loading, error }`.
11. Wire into `App.jsx`, log the response. Confirm live data arrives from the Mugikari API before building any UI.

### Phase 4 — Component build (one at a time, match existing behaviour exactly)
12. `PasswordGate.jsx` — password check and subscribe form.
13. `HomeHub.jsx` — four compass-point navigation buttons.
14. `ShopStage.jsx` — product image display, front/back flip, arrow/keyboard navigation, random shuffle, magnifier, counter, name, price.
15. `PreviewModal.jsx` — gallery, thumbnails, swipe, size selector buttons, add-to-bag.
16. `SizeGuideModal.jsx` — measurements table, row-click to select size. Hidden when product has no `sizeChart`.
17. `CheckoutView.jsx` — bag items, totals, delivery fee from `store.defaultShippingFee`, discount code field (calls `validateDiscount`), checkout form.
18. `useCheckout.js` — bag state (add, remove), discount state, `submitOrder()` calling the Mugikari orders endpoint, confirmation state. Display `store.paymentInstructions` on confirmation screen.
19. `ContactView.jsx`, `LookbookView.jsx`, `SearchBar.jsx`, `TermsPanel.jsx`.

### Phase 5 — Integration QA
20. Full flow: load → browse → preview → select size → add to bag → apply discount code → fill checkout → submit → confirm order appears in Mugikari dashboard.
21. Test `VITE_MUGIKARI_API_KEY` unset — confirm clean error state, no crash.
22. Test idempotency: submit the same order twice, confirm the second attempt gets a 200 with the existing order.
23. Mobile: swipe navigation, full-screen preview sheet, iOS input zoom prevention.
24. All responsive breakpoints (`820px`, `640px`, `420px`).

### Phase 6 — Cleanup
25. Delete the original 2,768-line `index.html` from the repo once the React app is confirmed working.
26. Commit and push. Vercel deployment is a separate step when ready.

---

## Open questions / pending spec changes

- **`sizeChart` type** — should it be a native JSON object or a JSON string? Object preferred (see flag in fields section above).
- **`details` array** — bullet points for the preview modal detail section. Still missing from the spec.
- **`customCss`** — does Due inject this from `GET /api/public/store`? For now, no — Due has its own fixed design. Worth confirming.
- **Search bar** — call `GET /api/public/products?search=` live on input, or filter client-side from the already-loaded catalog? Client-side is simpler and avoids extra round trips if the catalog is small.
