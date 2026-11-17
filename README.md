# SakhiKart — Women Empowerment & Rural Handmade Marketplace (Phase 1)

**"Her Skills. Her Products. Her Independence."**

SakhiKart is a managed multi-vendor e-commerce platform designed to help rural women artisans and Self-Help Groups (SHGs) in Odisha sell homemade foods, Sambalpuri handlooms, bamboo crafts, terracotta pottery, Pattachitra art, handmade jewellery, and embroidered home textiles without digital or logistics barriers.

---

## Installation & Development Commands

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables template
cp .env.example .env.local

# 3. Start development server on port 3000
npm run dev

# 4. Type-check and lint
npm run lint

# 5. Production build
npm run build
```

---

## Folder Structure

```text
src/
├── assets/images/            # Generated studio & editorial demo imagery
├── components/
│   ├── layout/               # StoreHeader, StoreFooter, CartDrawer, DashboardShell, Portal Layouts
│   ├── marketplace/          # ProductCard
│   └── ui/                   # Button, SafeImage, DataStateView, ToastContainer
├── context/                  # StoreContext (localStorage cart, wishlist, seller language, toasts)
├── hooks/                    # useLocalStorageState
├── lib/
│   ├── api/                  # Repository interfaces & DemoRepository implementations + config
│   ├── i18n/                 # English (en), Hindi (hi), and Odia (or) seller translations
│   ├── mock-data/            # Isolated demo seed datasets (products, sellers, orders, operations)
│   └── validation/           # Zod form schemas
├── pages/
│   ├── store/                # Customer marketplace, shop, PDP, cart, checkout, makers, tracking, info
│   ├── seller/               # Mobile-first Seller & SHG portal (EN/HI/OR + voice UI preview)
│   ├── admin/                # Admin moderation, orders, finance, inventory, Recharts analytics
│   └── operations/           # Village collections, QC grading, warehouse expiry, dispatch
├── services/                 # ProductsService, SellersService, OrdersService, InventoryService
└── types/                    # Strongly typed domain interfaces
```

---

## Demo Mode vs. Production Mode

In Phase 1, `VITE_DATA_MODE` defaults to `"demo"` in `src/lib/api/config.ts`.

- All pages consume async services (`src/services/*.service.ts`) backed by `Demo*Repository` classes (`src/lib/api/*.repository.ts`).
- Mutations (cart, wishlist, seller onboarding, product submission, admin approval, collection scheduling, QC updates, checkout order creation) persist in browser `localStorage` so workflows behave realistically across page reloads.
- Demo photography in `src/lib/mock-data/images.ts` is marked with `isDemoAsset: true`, kept separate from seller-uploaded product photos (`uploadedPhotoDataUrl`).

---

## Backend Integration Plan (Phase 2)

1. **Supabase Auth & PostgreSQL + RLS**: Implement `SupabaseProductRepository`, `SupabaseSellerRepository`, `SupabaseOrderRepository`, and `SupabaseInventoryRepository` implementing the exact interfaces in `src/lib/api/*.repository.ts` without rewriting UI components.
2. **Supabase Storage**: Upload seller camera photos and hub studio imagery to dedicated buckets (`seller-submissions/` vs `catalog-verified/`).
3. **Google Gemini API (Server-Side)**: Connect the Seller Voice Assistant button in `SellerNewProductPage` to a server route that transcribes Odia/Hindi/English audio and extracts structured product metadata.
4. **Razorpay & Shipping API**: Replace the Phase 1 demo payment/tracking steps in `CheckoutPage` and `OperationsDispatchPage` with server-verified Razorpay orders and Delhivery/India Post AWB webhooks.
