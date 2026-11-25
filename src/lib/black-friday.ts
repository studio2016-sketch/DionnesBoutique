/**
 * 2026 Black Friday through Cyber Monday promotion.
 * Early access begins November 25, 2026 at midnight America/Chicago.
 * All percentages are computed from the original catalog price (never mutated).
 * Dec 1, 2026 00:00 CST: regular pricing automatically resumes.
 */
export const SALE_START=Date.parse("2026-11-25T00:00:00-06:00");
export const SALE_END=Date.parse("2026-12-01T00:00:00-06:00");
export const SALE_DISCOUNT=0.5;
export const saleActive=(now=Date.now())=>now>=SALE_START&&now<SALE_END;
export const merchandiseCents=(price:number,now=Date.now())=>{
 const originalCents=Math.round(price*100);
 return saleActive(now)?Math.round(originalCents*(1-SALE_DISCOUNT)):originalCents;
};
export const merchandisePrice=(price:number,now=Date.now())=>merchandiseCents(price,now)/100;
