/**
 * Black Friday through Cyber Monday 2026: discount appears only in the cart.
 * Merchandise subtotal (not tax/shipping) determines the one cart-wide tier.
 * Original list prices are never overwritten; automatic end Dec 1 CST.
 */
export const SALE_START=Date.parse("2026-11-25T00:00:00-06:00");
export const SALE_END=Date.parse("2026-12-01T00:00:00-06:00");
export const saleActive=(now=Date.now())=>now>=SALE_START&&now<SALE_END;
export const salePercent=(originalSubtotalCents:number,now=Date.now()):number=>{
 if(!Number.isSafeInteger(originalSubtotalCents)||originalSubtotalCents<0)throw new Error("Invalid merchandise subtotal");
 if(!saleActive(now))return 0;
 if(originalSubtotalCents>=15000)return 50;
 if(originalSubtotalCents>=7500)return 40;
 return 30;
};
export const saleRate=(originalSubtotalCents:number,now=Date.now())=>salePercent(originalSubtotalCents,now)/100;
export const merchandiseCents=(price:number,now=Date.now(),originalSubtotalCents=Math.round(price*100))=>{
 const originalCents=Math.round(price*100);
 if(!Number.isSafeInteger(originalCents)||originalCents<0)throw new Error("Invalid product price");
 return Math.round(originalCents*(100-salePercent(originalSubtotalCents,now))/100);
};
export const merchandisePrice=(price:number,now=Date.now(),originalSubtotalCents=Math.round(price*100))=>
 merchandiseCents(price,now,originalSubtotalCents)/100;

export type CartLine={id:number;priceCents:number;quantity:number};
export type CheckoutPriceLine={id:number;quantity:number;unitAmountCents:number};

/** Allocate a cart-wide reduction into Stripe's integer-cent unit-price groups.
 * Every price shown in the catalog/bag stays unchanged; this allocation happens
 * only on checkout submission. One source line becomes at most two price groups.
 * The sum of Stripe line items equals the cart total to the penny.
 */
export function priceCart(lines:CartLine[],now=Date.now()){
 if(!Array.isArray(lines)||!lines.length||lines.length>30)throw new Error("Invalid shopping bag");
 const ids=new Set<number>();
 let originalSubtotalCents=0;
 for(const line of lines){
  if(!line||!Number.isSafeInteger(line.id)||line.id<1||ids.has(line.id)||
   !Number.isSafeInteger(line.priceCents)||line.priceCents<1||
   !Number.isSafeInteger(line.quantity)||line.quantity<1||line.quantity>999)
   throw new Error("Invalid shopping bag line");
  ids.add(line.id);
  originalSubtotalCents+=line.priceCents*line.quantity;
 }
 if(!Number.isSafeInteger(originalSubtotalCents)||originalSubtotalCents<=0)throw new Error("Invalid shopping bag subtotal");
 const discountPercent=salePercent(originalSubtotalCents,now);
 const discountedSubtotalCents=Math.round(originalSubtotalCents*(100-discountPercent)/100);
 const targetDiscountCents=originalSubtotalCents-discountedSubtotalCents;
 const calc=lines.map((line,index)=>{
  const numerator=line.priceCents*(100-discountPercent);
  return {...line,index,base:Math.floor(numerator/100),fraction:numerator%100,up:0};
 });
 let residual=discountedSubtotalCents-calc.reduce((sum,line)=>sum+line.base*line.quantity,0);
 for(const line of [...calc].sort((a,b)=>b.fraction-a.fraction||a.index-b.index)){
  if(residual<=0)break;
  const units=Math.min(residual,line.quantity);
  line.up=units;residual-=units;
 }
 if(residual!==0)throw new Error("Invalid cart discount allocation");
 const stripeLines:CheckoutPriceLine[]=[];
 for(const line of calc){
  if(line.quantity>line.up)stripeLines.push({id:line.id,quantity:line.quantity-line.up,unitAmountCents:line.base});
  if(line.up)stripeLines.push({id:line.id,quantity:line.up,unitAmountCents:line.base+1});
 }
 if(stripeLines.some(line=>line.unitAmountCents<1))throw new Error("Discounted merchandise has an invalid unit price");
 return {originalSubtotalCents,discountPercent,discountCents:targetDiscountCents,
  discountedSubtotalCents,stripeLines};
}
