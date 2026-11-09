import {timingSafeEqual} from "node:crypto";
import Stripe from "stripe";
import {NextResponse} from "next/server";
import {verifiedBoutiqueStripeKey} from "@/lib/stripe-account";
export async function GET(req:Request){
 const secret=process.env.BOUTIQUE_ORDER_SYNC_SECRET,supplied=req.headers.get("authorization")||"",expected="Bearer "+secret;
 if(!secret||Buffer.byteLength(supplied)!==Buffer.byteLength(expected)||!timingSafeEqual(Buffer.from(supplied),Buffer.from(expected)))return NextResponse.json({error:"Unauthorized."},{status:401});
 try{
  const client=new Stripe(await verifiedBoutiqueStripeKey());
  const settings=await client.tax.settings.retrieve();
  const registrations=[];
  for await(const registration of client.tax.registrations.list({status:"active",limit:100})){
   if(registration.country==="US")registrations.push({country:registration.country,state:registration.country_options.us?.state??null});
  }
  const taxCode=new URL(req.url).searchParams.get("taxCode");
  let codeValid=false;
  if(taxCode&&/^txcd_[0-9]{8}$/.test(taxCode)){try{await client.taxCodes.retrieve(taxCode);codeValid=true;}catch{}}
  return NextResponse.json({status:settings.status,activeUsRegistrations:registrations,presetTaxCode:settings.defaults.tax_code,presetTaxBehavior:settings.defaults.tax_behavior,codeValid},{headers:{"Cache-Control":"no-store, private"}});
 }catch{return NextResponse.json({error:"Stripe Tax status unavailable."},{status:503});}
}
