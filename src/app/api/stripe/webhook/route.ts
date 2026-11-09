import {NextResponse} from "next/server";
import {neon} from "@neondatabase/serverless";
import {recordPaidBoutiqueOrder} from "@/lib/stripe-orders";
import {verifyCheckoutEvent} from "@/lib/stripe-webhook";

export const runtime="nodejs";
export const dynamic="force-dynamic";
const headers={"Cache-Control":"no-store, private"};
export async function POST(req:Request){
 const signature=req.headers.get("stripe-signature");
 if(!signature)return NextResponse.json({error:"Signature required."},{status:400,headers});
 const secret=process.env.STRIPE_WEBHOOK_SECRET,key=process.env.STRIPE_SECRET_KEY,url=process.env.DATABASE_URL;
 if(!secret||!key||!url)return NextResponse.json({error:"Webhook is not configured."},{status:503,headers});
 let receipt;
 try{
  const raw=await req.text();
  if(Buffer.byteLength(raw)>1048576)return NextResponse.json({error:"Event too large."},{status:413,headers});
  receipt=verifyCheckoutEvent(raw,signature,secret,key);
 }catch{
  return NextResponse.json({error:"Invalid webhook."},{status:400,headers});
 }
 if(!receipt)return NextResponse.json({received:true,ignored:true},{headers});
 try{
  const sql=neon(url);
  await sql`INSERT INTO public.stripe_checkout_events(account_id,event_id,session_id,event_type,event_created_at,payment_state,amount_total,currency)
   VALUES(${receipt.accountId},${receipt.eventId},${receipt.sessionId},${receipt.eventType},${receipt.eventCreatedAt}::timestamptz,${receipt.paymentState},${receipt.amountTotal},${receipt.currency})
   ON CONFLICT(account_id,event_id) DO NOTHING`;
  const current=await sql`SELECT processing_status FROM public.stripe_checkout_events WHERE account_id=${receipt.accountId} AND event_id=${receipt.eventId}`;
  if(current[0]?.processing_status==="PROCESSED")return NextResponse.json({received:true},{headers});
  if(receipt.paymentState==="PAID")await recordPaidBoutiqueOrder(receipt.sessionId);
  await sql`UPDATE public.stripe_checkout_events SET processing_status='PROCESSED' WHERE account_id=${receipt.accountId} AND event_id=${receipt.eventId}`;
  return NextResponse.json({received:true},{headers});
 }catch{
  return NextResponse.json({error:"Event storage unavailable. Retry delivery."},{status:500,headers});
 }
}
