# Flyer image implementation tracker

Prepared: 66 provisional, SKU-matched flyer crops for the storefront (downloadable ZIP assembled in this conversation).

Do not enable these paths until the `public/products/*.webp` image files have actually been committed to GitHub, because doing so would produce broken thumbnails.

The bundle contains `public/products/01.webp` through `69.webp`, excluding the unresolved IDs **15 (Carolina Herrera La Bomba), 16 (Miss Dior Absolutely Blooming), 58 (unidentified loose setting powder)**. The quantities are handled by existing catalog data; do not duplicate image files by unit count.

Source: the three promotional flyers supplied by the boutique. They contain promotional composites, **not confirmed photographs of the seller's actual bottles**; inspect each crop against its listing prior to releasing checkout.

## Implementation
1. Extract ZIP to repo root so paths resolve under `public/products/`.
2. Inspect `contact-sheet.jpg`. Reject/retake crops that include typography, price bubbles, or wrong shade.
3. After committing image assets, update `src/data/product-images.ts` to prioritize `flyerImagePaths[id]` over third-party URLs. Do not publish the paths before images exist.
4. Verify all images in both product grid and `/product/[id]` pages, desktop and mobile.
5. Replace flyer crops with permission-cleared manufacturer photography or actual-stock photos wherever possible.
