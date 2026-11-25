/**
 * Black Friday through Cyber Monday 2026.
 * Discount tiers are based on the merchandise subtotal BEFORE discounts,
 * shipping and tax. Per-item prices are rounded to cents to match Stripe.
 * From 2026-12-01 00:00 America/Chicago all base prices resume automatically.
 */
export const SALE_START=Date.parse("2026-11-25T00:00:00-06:00");
export const SALE_END=Date.parse("2026-12-01T00:00:00-06:00");
export const saleActive=(now=Date.now())=>now>=SALE_START&&now<SALE_END;
export const saleRate=(originalSubtotalCents:number,now=Date.now()):number=>{
 if(!saleActive(now))return 0;
 if(!Number.isSafeInteger(originalSubtotalCents)||originalSubtotalCents<0)throw new Error("Invalid subtotal for promotion");
 if(originalSubtotalCents>=15000)return 0.50;
 if(originalSubtotalCents>=7500)return 0.40;
 return 0.30;
};
export const merchandiseCents=(price:number,now=Date.now(),originalSubtotalCents=Math.round(price*100))=>{
 const originalCents=Math.round(price*100);
 if(!Number.isSafeInteger(originalCents)||originalCents<0)throw new Error("Invalid product price");
 return Math.round(originalCents*(1-saleRate(originalSubtotalCents,now)));
};
export const merchandisePrice=(price:number,now=Date.now(),originalSubtotalCents=Math.round(price*100))=>
 merchandiseCents(price,now,originalSubtotalCents)/100;
