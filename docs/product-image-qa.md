# Product image completion tracker — 2026-10-18

The 69-SKU boutique catalog uses `src/data/product-images.ts` for temporary third-party product-reference imagery. A reference assignment does not guarantee the URL resolves, matches the user's physical merchandise, or has rights clearance. Replace with owner-provided/licensed product photography before enabling checkout.

## Awaiting verified exact-photo assignment

| Product ID | Product | Blocker |
|---|---|---|
| 47 | Tom Ford Shade & Illuminate Soft Radiance SPF 50 — 12.5 Walnut | Brand/formulation confirmed via Neiman Marcus, but no image URL conclusively tied to this shade. https://nmo-ui-to-product-v1-prod.neimanmarcuscloud.com/p/tom-ford-1-oz-shade-and-illuminate-soft-radiance-foundation-spf-50-prod231580171?childItemId=NMC568U_I7&msid=3553784 |
| 49 | Fenty Pro Filt'r **Soft Matte** — 506W | Current Fenty **Fluid Flex Natural Matte** has 506W, but manufacturer explicitly says shade range is **new, not identical** to older Soft Matte. Do not substitute: https://fentybeauty.com/en-nc/products/pro-filtr-fluid-flex-natural-matte-longwear-foundation-506w |
| 50 | Fenty Pro Filt'r **Soft Matte** — 536W | Same formula/shade incompatibility concern. https://fentybeauty.com/en-ht/products/pro-filtr-fluid-flex-natural-matte-longwear-foundation-536w |
| 58 | Unspecified additional setting powder | Product identity absent in catalog; impossible to identify a truthful specific photo. Request brand/product/shade. |
| 62 | Benefit Boi-ing Concealer mini — 3E01 | 3E01 may be internal/lot reference, not identifiable shade; photograph should await packaging/shade. |
| 65 | Tarte Shape Tape Concealer mini — Rich Caramel | Unable to verify current exact shade code/formula/mini. Request package label or additional close-up. |

## Quality controls before launch
1. Verify every remote URL returns a real image in the live browser. Retailers may block image hotlinking.
2. Visually review every thumbnail against exact product, shade, formulation and volume. The current repository has only *reference assignments*, not completed photography.
3. Obtain permission/licensing or replace third-party photography with original unit photographs.
4. Confirm old vs new formulations (especially Fenty and Charlotte Tilbury) and ensure shade names map to the physical stock.
5. Keep these listings labeled PHOTO PENDING until matches are verifiable. Never infer image accuracy from a similar product name.
