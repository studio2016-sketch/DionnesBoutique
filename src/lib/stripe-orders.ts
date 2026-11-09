import Stripe from "stripe";
import {boutiqueAccountId,verifiedBoutiqueStripeKey} from "./stripe-account";

export async function recordPaidBoutiqueOrder(sessionId:string){
 const syncSecret=process.env.BOUTIQUE_ORDER_SYNC_SECRET;
 if(!syncSecret)throw new Error("Order recording is not configured.");
 const client=new Stripe(await verifiedBoutiqueStripeKey());
 const session=await client.checkout.sessions.retrieve(sessionId);
 if(session.livemode!==true||session.metadata?.source!=="dionnesboutique.com"||session.payment_status!=="paid"||session.currency!=="usd")
  throw new Error("Paid boutique checkout required.");
 const items:{sourceId:string;quantity:number;description:string}[]=[];
 for await(const line of client.checkout.sessions.listLineItems(sessionId,{limit:100,expand:["data.price.product"]})){
  const product=line.price?.product;
  const mappedId=typeof product==="object"&&product&&!product.deleted?product.metadata?.product_id:undefined;
  const sourceId=mappedId&&/^\d{1,9}$/.test(mappedId)?mappedId:"unmatched:"+line.id;
  if(!Number.isSafeInteger(line.quantity)||!line.quantity||line.quantity<1)
   throw new Error("An order line could not be matched.");
  const existing=items.find(item=>item.sourceId===sourceId);
  if(existing)existing.quantity+=line.quantity;
  else items.push({sourceId,quantity:line.quantity,description:line.description||"Product details unavailable"});
 }
 if(!items.length||items.length>100)throw new Error("Invalid order items.");
 items.sort((a,b)=>a.sourceId.localeCompare(b.sourceId));
 const response=await fetch("https://wgos.app/api/retail/stripe-order",{
  method:"POST",headers:{"content-type":"application/json",authorization:"Bearer "+syncSecret},cache:"no-store",signal:AbortSignal.timeout(20000),
  body:JSON.stringify({accountId:boutiqueAccountId,sessionId:session.id,source:session.metadata.source,paymentStatus:session.payment_status,
   currency:session.currency,amountTotal:session.amount_total,customerEmail:session.customer_details?.email??null,
   shippingDetails:session.collected_information?.shipping_details??null,items})
 });
 if(!response.ok)throw new Error("Order recording failed.");
 const order=await response.json();
 if(!order.id||!["READY","REVIEW"].includes(order.status))throw new Error("Invalid order acknowledgement.");
 return order;
}
