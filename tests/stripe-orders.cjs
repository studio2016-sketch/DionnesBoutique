const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),ts=require("typescript");
let session={id:"cs_live_fixture",livemode:true,metadata:{source:"dionnesboutique.com"},payment_status:"paid",currency:"usd",amount_total:5500};
let lines=[{id:"li_1",quantity:1,description:"Fixture",price:{product:{metadata:{product_id:"1"}}}}];
let posted,requests=0,ok=true;
class FakeStripe{constructor(){this.checkout={sessions:{retrieve:async()=>session,listLineItems:async function*(){yield* lines;}}};}}
const context={exports:{},process:{env:{BOUTIQUE_ORDER_SYNC_SECRET:"fixture"}},AbortSignal,require(name){
 if(name==="stripe")return FakeStripe;
 if(name==="./stripe-account")return {boutiqueAccountId:"acct_fixture",verifiedBoutiqueStripeKey:async()=>"fixture"};
 throw Error(name);
},fetch:async(_url,options)=>{requests++;posted=JSON.parse(options.body);return {ok,json:async()=>({id:"order_fixture",status:"REVIEW"})};}};
vm.runInNewContext(ts.transpileModule(fs.readFileSync("src/lib/stripe-orders.ts","utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText,context);
const run=context.exports.recordPaidBoutiqueOrder;
(async()=>{
 await run(session.id);assert.equal(posted.items[0].sourceId,"1");
 session={...session,payment_status:"unpaid"};requests=0;await assert.rejects(()=>run(session.id));assert.equal(requests,0);
 session={...session,payment_status:"paid",metadata:{source:"another-site"}};await assert.rejects(()=>run(session.id));
 session={...session,metadata:{source:"dionnesboutique.com"}};
 lines=[...lines,...lines];await run(session.id);assert.equal(posted.items.length,1);assert.equal(posted.items[0].quantity,2);
 lines=[{id:"li_unknown",quantity:1,price:{product:{metadata:{}}}}];await run(session.id);assert.equal(posted.items[0].sourceId,"unmatched:li_unknown");
 ok=false;await assert.rejects(()=>run(session.id));ok=true;
 delete context.process.env.BOUTIQUE_ORDER_SYNC_SECRET;await assert.rejects(()=>run(session.id));
 console.log("Order payment, mapping, aggregation, acknowledgement, and configuration checks passed.");
})().catch(error=>{console.error(error);process.exit(1)});
