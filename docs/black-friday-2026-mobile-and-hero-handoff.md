# Dionne’s Boutique — Black Friday through Cyber Monday, 2026

## Approved opening promotion
Display only one popup, only during the promotion. No former welcome message flashes before/after it. A visitor can dismiss the popup or reopen it through the mobile menu during the sale.

**Exact heading:** Black Friday through Cyber Monday
**Offer:** UP TO 50% OFF
**Subtitle:** SITEWIDE MERCHANDISE SALE

**Discounts are based on the merchandise basket subtotal at existing catalog prices before promotional discounts, shipping or tax:**
- Less than $75.00: 30%
- $75.00–$149.99: 40%
- $150.00 and up: 50%

Discounts apply to all basket merchandise, including already-reduced open-box listings. Do not double-count discounts from altered source prices. Show the customer pre-discount subtotal, promotional savings, and subtotal after discount in the bag. Server-side Stripe Checkout must apply the identical tier and amount, rounded to cents per unit. The cart subtotal tier must come from WGOS-approved price and quantity, not browser-provided amounts.

**Sale dates:** November 25, 2026, through November 30, 2026 at 11:59 p.m. America/Chicago; original listed prices automatically return at midnight December 1, 2026. Shipping and applicable taxes are additional.

**Payment text:** Secure online payments are available and recommended, but only when the server verifies all Stripe, tax, inventory, webhook and fulfillment readiness flags.

**Button:** SHOP THE SALE →
**Close:** Continue browsing

## Mobile layout
- Use a compact mobile popup that fits a 375×667 viewport, centered within the dynamic visible viewport, with a close button at top-right and the shop button visible.
- One crisp typographic brand heading in the modal, not a stretched 220px logo preview.
- Use a large UP TO 50% OFF headline and 3 adjacent tier labels with concise fine print.
- Compact vertical spacing; allow controlled scrolling only on unusually short windows.
- Maintain focus trapping, Escape-to-dismiss and a distinct per-session dismissal key.
- No legacy welcome modal and no second delayed mount.

## Hero image still requires publication — NOT DONE
User-approved original artwork: `Dionnes_Boutique_Approved_Logo.png`, 1254×1254 RGBA transparent PNG. The uploaded original must be copied **unchanged** into `public/brand/Dionnes_Boutique_Approved_Logo.png` on the main branch. Do not recreate, recolor, regenerate, stretch, or use a resized 220px preview.

The current hero, header and footer still reference `/brand/official-gold-logo.svg`, a small embedded raster inside SVG, visibly soft on Retina phones. Once the approved PNG exists in the repository, replace all logo references (header, hero, footer, metadata/app icon where appropriate) with the published asset. Preserve a well-scaled object-fit:contain and ensure the original logo remains the dominant homepage visual. Verify the asset returns HTTP 200 and naturalWidth≥1200, and inspect screenshots on Retina-sized mobile and desktop. Do not label image clarity complete until this check passes.

## Verification
- `tests/black-friday-tiers.cjs`: boundary arithmetic, sale start/end, per-item cents rounding
- `scripts/check-promo-modal.mjs`: single popup, three tiers, one-screen fit and visible CTA
- Existing checkout and responsive QA tests remain required.
- The image replacement is a separate outstanding task; retain it on the launch checklist.
