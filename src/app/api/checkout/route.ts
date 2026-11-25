import { NextResponse } from "next/server";
import {merchandiseCents} from "@/lib/black-friday";
import { products } from "@/data/products";
import {checkoutCommerceSettings} from "@/lib/checkout-settings";
import { verifiedBoutiqueStripeKey } from "@/lib/stripe-account";
import {fetchWgosInventory,eligibleLine,checkoutInventoryReady} from "@/lib/wgos-inventory";
import {wgosReservation,releaseBoutiqueHold} from "@/lib/boutique-reservations";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const origin="https://dionnesboutique.com";
type BagLine={id:number;quantity:number};
export async function POST(request:Request){
 if(process.env.CHECKOUT_ENABLED!=="true"||!process.env.STRIPE_SECRET_KEY||!process.env.STRIPE_WEBHOOK_SECRET||process.env.ORDER_FULFILLMENT_READY!=="true"){
  return NextResponse.json({error:"Checkout is being prepared and is not available yet."},{status:503});
 }
 const contentType=request.headers.get("content-type")||"";
 if(!contentType.includes("application/json"))return NextResponse.json({error:"JSON required."},{status:415});
 if(Number(request.headers.get("content-length")||0)>8192)return NextResponse.json({error:"Basket is too large."},{status:413});
 const referer=request.headers.get("origin");
 if(referer!==origin)return NextResponse.json({error:"Invalid origin."},{status:403});
 let lines:BagLine[];
 try{const payload=await request.json();lines=payload.items;}catch{return NextResponse.json({error:"Invalid request."},{status:400})}
 if(!Array.isArray(lines)||!lines.length||lines.length>30)return NextResponse.json({error:"Please select valid items."},{status:400});
 let inventory;
 try{inventory=await fetchWgosInventory();}catch{return NextResponse.json({error:"Live inventory could not be verified. Please try again later."},{status:503});}
 if(!checkoutInventoryReady(inventory))return NextResponse.json({error:"Store inventory release is still being finalized."},{status:503});
 const inventoryById=new Map(inventory.products.map(item=>[item.id,item]));
 const now=Date.now();
 const items=lines.map(x=>{
  if(!x||!Number.isSafeInteger(x.id)||!Number.isSafeInteger(x.quantity)||x.quantity<1)return null;
  const p=products.find(p=>p.id===x.id),live=inventoryById.get(x.id);
  if(!p||!live||!eligibleLine(live)||x.quantity>live.available)return null;
  const cents=merchandiseCents(live.priceCents/100,now);
  if(!Number.isSafeInteger(cents)||cents<=0)return null;
  return {product:p,quantity:x.quantity,cents};
 });
 if(items.some(x=>x===null)||new Set(lines.map(x=>x.id)).size!==lines.length)return NextResponse.json({error:"One or more products are not approved for sale."},{status:409});
 const subtotalCents=items.reduce((sum,line)=>sum+(line?line.cents*line.quantity:0),0);
 if(!Number.isSafeInteger(subtotalCents)||subtotalCents<=0)return NextResponse.json({error:"Invalid order subtotal."},{status:400});
 const params=new URLSearchParams();
 params.set("mode","payment");
 params.set("success_url",origin+"/checkout/success?session_id={CHECKOUT_SESSION_ID}");
 params.set("cancel_url",origin+"/checkout/cancel");
 params.set("billing_address_collection","required");
 params.set("shipping_address_collection[allowed_countries][0]","US");
 params.set("phone_number_collection[enabled]","true");
 params.set("customer_creation","always");
 params.set("metadata[source]","dionnesboutique.com");
 items.forEach((line,i)=>{
  if(!line)return;
  params.set(`line_items[${i}][price_data][currency]`,"usd");
  params.set(`line_items[${i}][price_data][unit_amount]`,String(line.cents));
  params.set(`line_items[${i}][price_data][product_data][name]`,`${line.product.brand} ${line.product.name} — ${line.product.variant}`);
  params.set(`line_items[${i}][quantity]`,String(line.quantity));
  params.set(`line_items[${i}][price_data][product_data][metadata][product_id]`,String(line.product.id));
 });
 let reservationId:string|null=null, createdSession:string|null=null, verifiedKey:string|null=null;
 try{
  const key=await verifiedBoutiqueStripeKey();verifiedKey=key;
  const settings=await checkoutCommerceSettings(key);
  const requestId=crypto.randomUUID();
  const hold=await wgosReservation({action:"reserve",requestId,lines:lines.map(x=>({id:x.id,quantity:x.quantity}))});
  if(typeof hold?.id!=="string"||!Array.isArray(hold.lines)||hold.lines.length!==lines.length)throw Error("Invalid inventory hold");
  const holdId:string=hold.id;reservationId=holdId;
  const expected=new Map(lines.map(line=>[line.id,{quantity:line.quantity,priceCents:inventoryById.get(line.id)?.priceCents}]));
  for(const line of hold.lines){const record=expected.get(line.id);if(!record||record.quantity!==line.quantity||record.priceCents!==line.priceCents)throw Error("Product data changed during checkout");}
  params.set("metadata[reservation_id]",holdId);
  params.set("expires_at",String(Math.floor(Date.now()/1000)+1805));
  const freeShipping=settings.freeShippingThresholdCents!=null&&subtotalCents>=settings.freeShippingThresholdCents;
  const shippingCents=freeShipping?0:settings.shippingCents;
  params.set("automatic_tax[enabled]","true");
  params.set("shipping_options[0][shipping_rate_data][type]","fixed_amount");
  params.set("shipping_options[0][shipping_rate_data][tax_behavior]","exclusive");
  params.set("shipping_options[0][shipping_rate_data][fixed_amount][amount]",String(shippingCents));
  params.set("shipping_options[0][shipping_rate_data][fixed_amount][currency]","usd");
  params.set("shipping_options[0][shipping_rate_data][display_name]",freeShipping?"Free US delivery":"Standard US delivery");
  params.set("shipping_options[0][shipping_rate_data][delivery_estimate][minimum][unit]","business_day");
  params.set("shipping_options[0][shipping_rate_data][delivery_estimate][minimum][value]",String(settings.minDays));
  params.set("shipping_options[0][shipping_rate_data][delivery_estimate][maximum][unit]","business_day");
  params.set("shipping_options[0][shipping_rate_data][delivery_estimate][maximum][value]",String(settings.maxDays));
  items.forEach((_line,i)=>{
   params.set(`line_items[${i}][price_data][product_data][tax_code]`,settings.taxCode);
   params.set(`line_items[${i}][price_data][tax_behavior]`,settings.taxBehavior);
  });
  const response=await fetch("https://api.stripe.com/v1/checkout/sessions",{
   method:"POST",headers:{Authorization:`Bearer ${key}`,"Content-Type":"application/x-www-form-urlencoded", "Idempotency-Key":requestId},body:params.toString(),cache:"no-store",signal:AbortSignal.timeout(15000)
  });
  const data=await response.json();
  if(!response.ok||typeof data.url!=="string"||!data.url.startsWith("https://checkout.stripe.com/")||typeof data.id!=="string"||!/^cs_live_[A-Za-z0-9]+$/.test(data.id))throw Error("Stripe Checkout session failed");
  createdSession=data.id;
  const attached=await wgosReservation({action:"attach",id:holdId,sessionId:createdSession});
  if(attached?.attached!==true)throw Error("Could not attach checkout reservation");
  return NextResponse.json({url:data.url},{headers:{"Cache-Control":"no-store"}});
 }catch(error){
  console.error("Boutique Checkout session failed",error instanceof Error?error.message:"unknown");
  if(createdSession&&verifiedKey){try{await fetch("https://api.stripe.com/v1/checkout/sessions/"+encodeURIComponent(createdSession)+"/expire",{method:"POST",headers:{Authorization:"Bearer "+verifiedKey},cache:"no-store",signal:AbortSignal.timeout(10000)});}catch{}}
  if(reservationId){try{await releaseBoutiqueHold(reservationId)}catch{console.error("Boutique hold release failed",reservationId)}}
  return NextResponse.json({error:"Checkout temporarily unavailable. Your items were not purchased."},{status:502});
 }
}

export async function GET(){
 try{
  const key=await verifiedBoutiqueStripeKey();
  let shippingAndTaxConfigured=false;
  let shippingSettingsConnected=false;
  let inventoryReady=false,approvedInStock=0;
  try{const inventory=await fetchWgosInventory();inventoryReady=checkoutInventoryReady(inventory);approvedInStock=inventory.products.filter(eligibleLine).length;}catch{}
  try{await checkoutCommerceSettings(key);shippingAndTaxConfigured=true;shippingSettingsConnected=true;}catch(error){shippingSettingsConnected=error instanceof Error&&["Shipping and tax setup is incomplete.","Tax registration is not ready."].includes(error.message);}
  return NextResponse.json({
   stripeConnected:true,
   checkoutEnabled:process.env.CHECKOUT_ENABLED==="true",
   webhookConfigured:Boolean(process.env.STRIPE_WEBHOOK_SECRET),
   orderRecordingConfigured:Boolean(process.env.BOUTIQUE_ORDER_SYNC_SECRET),
   fulfillmentConfigured:process.env.ORDER_FULFILLMENT_READY==="true",
   shippingSettingsConnected,
   shippingAndTaxConfigured,
   inventoryReady,
   approvedInStock
  },{headers:{"Cache-Control":"no-store, private"}});
 }catch{
  return NextResponse.json({stripeConnected:false,error:"Stripe connection could not be verified."},{status:503,headers:{"Cache-Control":"no-store, private"}});
 }
}
