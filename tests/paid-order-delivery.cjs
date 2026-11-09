// In-process contract test: real routes and processor, synthetic Stripe/DB adapters.
// No network, Stripe calls, production credentials, or inventory writes.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript');
const headers={authorization:'Bearer fixture-sync'};
const env={BOUTIQUE_ORDER_SYNC_SECRET:'fixture-sync',STRIPE_WEBHOOK_SECRET:'fixture-signing',STRIPE_SECRET_KEY:'fixture-key',DATABASE_URL:'fixture-db'};
const response={json:(body,options={})=>({status:options.status||200,ok:(options.status||200)<400,json:async()=>body,body})};
function load(file,require,extra={}){
 const ctx={exports:{},require,process:{env},Buffer,AbortSignal,...extra};
 vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText,ctx);
 return ctx.exports;
}
let dbCalls=0,failDb=false,lastPayload,ack={id:'fixture-order',status:'REVIEW',stockApplied:false,duplicate:false};
const sql=async(_strings,...values)=>{
 dbCalls++;if(failDb)throw Error('Synthetic outage');
 lastPayload=JSON.parse(values[0]);return [{result:ack}];
};
const receiving=load((process.env.WGOS_SOURCE||'../WGOS')+'/app/api/retail/stripe-order/route.ts',name=>{
 if(name==='node:crypto')return require(name);
 if(name==='next/server')return {NextResponse:response};
 if(name.endsWith('/lib/db'))return {db:()=>sql};
 throw Error(name);
});
function request(body,auth=headers.authorization){return {headers:new Headers({authorization:auth}),text:async()=>body};}
const session={id:'cs_live_FixtureContract',livemode:true,metadata:{source:'dionnesboutique.com'},payment_status:'paid',currency:'usd',amount_total:5500,customer_details:{email:'fixture@example.invalid'},collected_information:{shipping_details:{name:'Fixture',address:{line1:'1 Fixture St',city:'Fixture',state:'TX',postal_code:'77001',country:'US'}}}};
class FakeStripe{constructor(){this.checkout={sessions:{retrieve:async()=>session,listLineItems:async function*(){yield {id:'li_fixture',quantity:1,description:'Fixture',price:{product:{metadata:{product_id:'900000001'}}}};}}};}}
let loseAck=false;
const processor=load('src/lib/stripe-orders.ts',name=>{
 if(name==='stripe')return FakeStripe;
 if(name==='./stripe-account')return {boutiqueAccountId:'acct_1UZh0B0yHQiI07GK',verifiedBoutiqueStripeKey:async()=>env.STRIPE_SECRET_KEY};
 throw Error(name);
},{fetch:async(url,options)=>{
 assert.equal(url,'https://wgos.app/api/retail/stripe-order');
 const result=await receiving.POST(request(options.body,options.headers.authorization));
 if(loseAck){loseAck=false;throw Error('Synthetic lost acknowledgement');}
 return result;
}});
let receiptState=null,processCalls=0;
const receipts=async(strings)=>{
 const query=strings.join('?');
 if(query.includes('INSERT'))receiptState??='PENDING';
 if(query.includes('SELECT'))return [{processing_status:receiptState}];
 if(query.includes('UPDATE'))receiptState='PROCESSED';
 return [];
};
const webhook=load('src/app/api/stripe/webhook/route.ts',name=>{
 if(name==='next/server')return {NextResponse:response};
 if(name==='@neondatabase/serverless')return {neon:()=>receipts};
 if(name==='@/lib/stripe-orders')return {recordPaidBoutiqueOrder:async id=>{processCalls++;return processor.recordPaidBoutiqueOrder(id);}};
 // Cryptographic signature verification is exercised separately in stripe-webhook.cjs.
 if(name==='@/lib/stripe-webhook')return {verifyCheckoutEvent:()=>({accountId:'acct_1UZh0B0yHQiI07GK',eventId:'evt_fixture',sessionId:session.id,eventType:'checkout.session.completed',eventCreatedAt:new Date(0).toISOString(),paymentState:'PAID',amountTotal:5500,currency:'usd'})};
 throw Error(name);
});
const delivery=()=>webhook.POST({headers:new Headers({'stripe-signature':'fixture'}),text:async()=>'{}'});
(async()=>{
 let result=await receiving.POST(request('{}','Bearer wrong'));assert.equal(result.status,401);assert.equal(dbCalls,0);
 failDb=true;result=await delivery();assert.equal(result.status,500);assert.equal(receiptState,'PENDING');failDb=false;
 loseAck=true;result=await delivery();assert.equal(result.status,500);assert.equal(receiptState,'PENDING');
 ack={...ack,duplicate:true};result=await delivery();assert.equal(result.status,200);assert.equal(receiptState,'PROCESSED');
 assert.equal(lastPayload.sessionId,session.id);assert.equal(lastPayload.accountId,'acct_1UZh0B0yHQiI07GK');
 assert.equal(lastPayload.items[0].sourceId,'900000001');assert.equal(lastPayload.shippingDetails.address.state,'TX');
 const calls=processCalls;await delivery();assert.equal(processCalls,calls);
 receiptState='PENDING';ack={...ack,status:'SHIPPED',stockApplied:true};result=await delivery();assert.equal(result.status,200);assert.equal(receiptState,'PROCESSED');
 receiptState='PENDING';ack={...ack,status:'READY',stockApplied:false};result=await delivery();assert.equal(result.status,500);assert.equal(receiptState,'PENDING');
 console.log('Contract checks passed: auth, payload mapping, DB failure, lost acknowledgment, retry, processed replay, shipped replay, contradictory acknowledgment.');
})().catch(error=>{console.error(error);process.exit(1)});
