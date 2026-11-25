# Dionne’s Boutique — checkout launch audit (2026-11-25)
Production: https://dionnesboutique.com

## Merchant-approved launch scope
- WGOS is the authoritative inventory source; all 69 products match catalog identity, category, variant and base price.
- 94 units counted and recorded in WGOS; 68 approved SKUs, including 21 discounted open-box listings.
- Five SKUs are sold out (IDs 7, 8, 52, 53, 59). Product 58 remains on hold because its brand and shade are unidentified.
- Catalog image quality and licensing remain separate ongoing QA work.
- 50% Black Friday through Cyber Monday discount applies to listed merchandise prices through November 30, 2026 (America/Chicago). Prices return automatically December 1.
- WGOS shipping is $5.95 per order with 7–10 business-day estimate; Stripe Tax applies where registered.

## Payment controls
- Server-side Stripe account identity verification is required on every checkout.
- Dynamic WGOS availability and unit prices are checked at checkout; stock is reserved atomically before a Stripe Checkout session is created.
- Checkout Session expires after 30 minutes. Failed or expired sessions release reserved inventory.
- Signed paid Stripe webhook finalizes the reservation and records the paid order in WGOS, idempotently.
- Stock and order logic tested on an isolated Neon branch and hold/release tested on production without creating a live charge.
- The original Stripe account remains Dionne’s Boutique's account, not a WGOS shared merchant account.
- Checkout activation uses production-only environment flags CHECKOUT_ENABLED and ORDER_FULFILLMENT_READY.

## Outstanding operations
- Confirm first live end-to-end Stripe payment and webhook/order record on a controlled purchase.
- Verify carrier-compliant shipping methods for perfume shipments and actual fulfillment workflow.
- Replace or identify remaining image/label exceptions before declaring photography complete.
- This operational note contains no credentials.
