import { NextResponse } from "next/server";
import { products } from "@/data/products";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const origin="https://dionnesboutique.com";
type BagLine={id:number;quantity:number};
export async function POST(request:Request){
 if(process.env.CHECKOUT_ENABLED!=="true"||!process.env.STRIPE_SECRET_KEY||!process.env.STRIPE_WEBHOOK_SECRET||process.env.ORDER_FULFILLMENT_READY!=="true"||process.env.SHIPPING_AND_TAX_READY!=="true"){
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
 const items=lines.map(x=>{
  if(!x||!Number.isSafeInteger(x.id)||!Number.isSafeInteger(x.quantity)||x.quantity<1)return null;
  const p=products.find(p=>p.id===x.id);
  if(!p||p.category==="Open Box"||p.condition.includes("verify before launch")||p.condition.includes("pending")||x.quantity>p.stock)return null;
  const cents=Math.round(p.price*100);
  if(!Number.isSafeInteger(cents)||cents<=0)return null;
  return {product:p,quantity:x.quantity,cents};
 });
 if(items.some(x=>x===null)||new Set(lines.map(x=>x.id)).size!==lines.length)return NextResponse.json({error:"One or more products are not approved for sale."},{status:409});
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
 try{
  const response=await fetch("https://api.stripe.com/v1/checkout/sessions",{
   method:"POST",headers:{Authorization:`Bearer ${process.env.STRIPE_SECRET_KEY}`,"Content-Type":"application/x-www-form-urlencoded", "Idempotency-Key":crypto.randomUUID()},body:params.toString(),cache:"no-store"
  });
  const data=await response.json();
  if(!response.ok||typeof data.url!=="string"||!data.url.startsWith("https://checkout.stripe.com/")){
   console.error("Stripe checkout session creation failed",response.status,data?.error?.type);
   return NextResponse.json({error:"Checkout could not be started."},{status:502});
  }
  return NextResponse.json({url:data.url},{headers:{"Cache-Control":"no-store"}});
 }catch{return NextResponse.json({error:"Checkout temporarily unavailable."},{status:502})}
}
