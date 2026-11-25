const assert=require("node:assert/strict");
const fs=require("node:fs"),vm=require("node:vm"),ts=require("typescript");
const content=fs.readFileSync("src/lib/black-friday.ts","utf8");
const compiled=ts.transpileModule(content,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const ctx={exports:{}};vm.runInNewContext(compiled,ctx);
const {saleRate,saleActive,merchandiseCents,SALE_START,SALE_END}=ctx.exports;
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
assert.throws(()=>saleRate(-1,now),/Invalid subtotal/);
console.log("Tier boundaries, cross-item subtotal discounts and December 1 expiration passed.");
