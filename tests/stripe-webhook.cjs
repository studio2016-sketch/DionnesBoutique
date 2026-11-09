const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const ts=require("typescript");
const Stripe=require("stripe");
const accountId="acct_1UZh0B0yHQiI07GK";
const source=fs.readFileSync("src/lib/stripe-webhook.ts","utf8");
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText;
const context={exports:{},require(name){if(name==="./stripe-account")return {boutiqueAccountId:accountId};return require(name);}};
vm.runInNewContext(compiled,context);
const verify=context.exports.verifyCheckoutEvent;
const secret="fixture-signing-secret",key="fixture-api-key";
const client=new Stripe(key);
const base={id:"evt_fixture1",type:"checkout.session.completed",created:Math.floor(Date.now()/1000),livemode:true,
 data:{object:{id:"cs_live_fixture1",object:"checkout.session",livemode:true,metadata:{source:"dionnesboutique.com"},amount_total:5500,currency:"usd",payment_status:"paid"}}};
function signed(event,timestamp){const raw=JSON.stringify(event);return {raw,signature:client.webhooks.generateTestHeaderString({payload:raw,secret,...(timestamp?{timestamp}:{})})};}
function run(event){const {raw,signature}=signed(event);return verify(raw,signature,secret,key);}
assert.equal(run(base).paymentState,"PAID");
assert.equal(run({...base,data:{object:{...base.data.object,payment_status:"unpaid"}}}).paymentState,"PENDING");
assert.equal(run({...base,type:"checkout.session.async_payment_succeeded"}).paymentState,"PAID");
assert.equal(run({...base,type:"checkout.session.async_payment_failed"}).paymentState,"FAILED");
assert.equal(run({...base,type:"checkout.session.expired"}).paymentState,"EXPIRED");
assert.equal(run({...base,data:{object:{...base.data.object,metadata:{source:"another-site"}}}}),null);
assert.equal(run({...base,type:"customer.created"}),null);
assert.throws(()=>run({...base,livemode:false}));
assert.throws(()=>run({...base,account:"acct_other"}));
assert.throws(()=>run({...base,data:{object:{...base.data.object,amount_total:-1}}}));
assert.throws(()=>run({...base,data:{object:{...base.data.object,id:"cs_test_fixture1"}}}));
const valid=signed(base);
assert.throws(()=>verify(valid.raw+" ",valid.signature,secret,key));
const expired=signed(base,Math.floor(Date.now()/1000)-600);
assert.throws(()=>verify(expired.raw,expired.signature,secret,key));
console.log("13 webhook signature, environment, source, and payment-state checks passed.");
