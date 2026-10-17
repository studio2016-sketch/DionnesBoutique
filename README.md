# Dionne's Boutique

Official GitHub repository for [Dionne's Boutique](https://dionnesboutique.com).

**Brand:** Timeless Style. Elevated You.

## Project brief

Build a premium, mobile-first luxury e-commerce experience inspired by Dionne's Boutique's approved ivory/champagne/gold brand references, with an accompanying private retail management dashboard.

### Storefront
- Fragrances, makeup, fashion, accessories, Thrifted Creations, new arrivals and weekly beauty lists
- Authentic product imagery and accurate product variants, quantities, condition disclosures and prices
- Fast discovery, accessible product pages, shopping cart and secure checkout
- Clear shipping, returns, authenticity, privacy and customer-service policies

### Business dashboard
- Owner-only sales, acquisition costs, gross profit, inventory, orders and customer-management views
- Accurate inventory decrement on paid orders, stock reservations during checkout, audit trail and role-based access
- Spreadsheet inventory import with validation and reconciliation, not blind replacement
- No private costs or supplier information exposed to storefront or client bundles

### Infrastructure
- GitHub source control and Vercel deployment
- Next.js / TypeScript
- Production database and commerce integration to be provisioned before building transaction flows
- Stripe for payment processing, subject to final checkout/provider integration selection

## Launch gates
1. Validate the official inventory workbook against promotional images and item conditions.
2. Verify data, checkout, Stripe webhooks, inventory concurrency, secure authentication and shipping.
3. Keep payments in test mode until approved and verified; never publish placeholder inventory as real stock.
4. Confirm rights to product photos and verify cosmetics hygiene and pricing claims.

No live purchases should be accepted until those checks pass.
