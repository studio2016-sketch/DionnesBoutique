const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),ts=require("typescript");
let config={shippingEnabled:true,shippingCents:700,minDays:3,maxDays:7,taxMode:"AUTOMATIC",taxCode:"txcd_99999999",taxBehavior:"inclusive"};
let registrations=[],status="active",codeValid=true;
class FakeStripe{constructor(){this.tax={settings:{retrieve:async()=>({status})},registrations:{list:async function*(){yield* registrations;}}};this.taxCodes={retrieve:async()=>{if(!codeValid)throw Error("Unknown code");return {};}};}}
const ctx={exports:{},AbortSignal,process:{env:{BOUTIQUE_ORDER_SYNC_SECRET:"fixture"}},require:()=>FakeStripe,fetch:async()=>({ok:true,json:async()=>({settings:config})})};
vm.runInNewContext(ts.transpileModule(fs.readFileSync("src/lib/checkout-settings.ts","utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText,ctx);
const run=ctx.exports.checkoutCommerceSettings;
(async()=>{
 await assert.rejects(()=>run("fixture"),/registration/);
 registrations=[{country:"US"}];assert.equal((await run("fixture")).shippingCents,700);assert.equal((await run("fixture")).taxBehavior,"inclusive");
 status="pending";await assert.rejects(()=>run("fixture"));status="active";
 codeValid=false;await assert.rejects(()=>run("fixture"));codeValid=true;
 config={...config,shippingCents:-1};await assert.rejects(()=>run("fixture"));config={...config,shippingCents:0};
 assert.equal((await run("fixture")).shippingCents,0);
 config={...config,taxMode:"PENDING"};await assert.rejects(()=>run("fixture"));
 console.log("Shipping validation and Stripe Tax prerequisite checks passed.");
})().catch(e=>{console.error(e);process.exit(1)});
