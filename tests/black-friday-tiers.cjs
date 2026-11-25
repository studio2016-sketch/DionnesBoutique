const assert=require("node:assert/strict");
const fs=require("node:fs"),vm=require("node:vm"),ts=require("typescript");
const content=fs.readFileSync("src/lib/black-friday.ts","utf8");
const compiled=ts.transpileModule(content,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const ctx={exports:{}};vm.runInNewContext(compiled,ctx);
const {saleRate,saleActive,merchandiseCents,priceCart,SALE_START,SALE_END}=ctx.exports;
const now=Date.parse("2026-11-26T12:00:00-06:00");
assert.equal(saleActive(now),true);
assert.equal(saleRate(0,now),.30);
assert.equal(saleRate(7499,now),.30);
assert.equal(saleRate(7500,now),.40);
assert.equal(saleRate(14999,now),.40);
assert.equal(saleRate(15000,now),.50);
assert.equal(merchandiseCents(74.99,now,7499),5249);
assert.equal(merchandiseCents(75,now,7500),4500);
assert.equal(merchandiseCents(149.99,now,14999),8999);
assert.equal(merchandiseCents(150,now,15000),7500);
assert.equal(merchandiseCents(75,now,15000),3750); // Two $75 goods cross the 50% order threshold
assert.equal(merchandiseCents(12,now,15000),600); // Rate applied to all products in the qualifying basket
assert.equal(saleActive(SALE_START-1),false);
assert.equal(saleActive(SALE_START),true);
assert.equal(saleActive(SALE_END-1),true);
assert.equal(saleActive(SALE_END),false);
assert.equal(merchandiseCents(75,SALE_END,15000),7500);
assert.throws(()=>saleRate(-1,now),/Invalid (merchandise )?subtotal/);
// Cart totals drive one tier across the entire order, independent of product-page display.
const sale1=priceCart([{id:17,priceCents:6500,quantity:1}],now);
assert.equal(sale1.discountPercent,30);
assert.equal(sale1.originalSubtotalCents,6500);
assert.equal(sale1.discountCents,1950);
assert.equal(sale1.discountedSubtotalCents,4550);
const combined=priceCart([{id:17,priceCents:6500,quantity:1},{id:18,priceCents:7500,quantity:1}],now);
assert.equal(combined.originalSubtotalCents,14000);
assert.equal(combined.discountPercent,40);
assert.equal(combined.discountCents,5600);
assert.equal(combined.discountedSubtotalCents,8400);
const upgrade=priceCart([{id:1,priceCents:7500,quantity:1},{id:2,priceCents:7500,quantity:1}],now);
assert.equal(upgrade.originalSubtotalCents,15000);
assert.equal(upgrade.discountPercent,50);
assert.equal(upgrade.discountedSubtotalCents,7500);
for(const line of [
 {priceCents:7499,expectedPercent:30,expectedTotal:5249},
 {priceCents:7500,expectedPercent:40,expectedTotal:4500},
 {priceCents:14999,expectedPercent:40,expectedTotal:8999},
 {priceCents:15000,expectedPercent:50,expectedTotal:7500}
]){
 const calc=priceCart([{id:1,priceCents:line.priceCents,quantity:1}],now);
 assert.equal(calc.discountPercent,line.expectedPercent);
 assert.equal(calc.discountedSubtotalCents,line.expectedTotal);
}
const centSplit=priceCart([{id:1,priceCents:101,quantity:2}],now);
assert.equal(centSplit.discountedSubtotalCents,141);
assert.equal(centSplit.stripeLines.reduce((s,l)=>s+l.unitAmountCents*l.quantity,0),141);
assert.equal(centSplit.stripeLines.reduce((s,l)=>s+l.quantity,0),2);
assert.equal(centSplit.stripeLines.length,2);
assert.equal(priceCart([{id:1,priceCents:7500,quantity:2}],SALE_END).discountedSubtotalCents,15000);
for(const bundle of [
 [{id:1,priceCents:1299,quantity:3},{id:2,priceCents:4312,quantity:1}],
 [{id:1,priceCents:6500,quantity:1},{id:2,priceCents:7500,quantity:2},{id:3,priceCents:1500,quantity:3}],
 [{id:1,priceCents:1234,quantity:10},{id:2,priceCents:999,quantity:1},{id:3,priceCents:203,quantity:5}]
]){
 const calc=priceCart(bundle,now);
 assert.equal(calc.discountCents,calc.originalSubtotalCents-calc.discountedSubtotalCents);
 assert.equal(calc.stripeLines.reduce((sum,l)=>sum+l.unitAmountCents*l.quantity,0),calc.discountedSubtotalCents);
 for(const item of bundle)assert.equal(calc.stripeLines.filter(l=>l.id===item.id).reduce((sum,l)=>sum+l.quantity,0),item.quantity);
}
console.log("Cart-only tier boundaries, complete-subtotal discounts, exact Stripe cent allocation, and December 1 expiry passed.");
