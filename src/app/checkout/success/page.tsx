import Link from "next/link";
import {verifiedBoutiqueStripeKey} from "@/lib/stripe-account";

export const dynamic="force-dynamic";
export const metadata={title:"Payment status | Dionne’s Boutique",robots:{index:false,follow:false}};
export default async function CheckoutStatus({searchParams}:{searchParams:Promise<{session_id?:string}>}){
 const {session_id:id}=await searchParams;
 let paid=false;
 let confirmed=false;
 if(id&&/^cs_(test|live)_[a-zA-Z0-9]+$/.test(id)){
  try{
   const key=await verifiedBoutiqueStripeKey();
   const response=await fetch("https://api.stripe.com/v1/checkout/sessions/"+encodeURIComponent(id),{
    headers:{Authorization:"Bearer "+key},cache:"no-store",signal:AbortSignal.timeout(10000)
   });
   if(response.ok){
    const session=await response.json();
    if(session.metadata?.source==="dionnesboutique.com"){
     confirmed=true;paid=session.payment_status==="paid";
    }
   }
  }catch{ /* The page offers receipt guidance when payment status is unavailable. */ }
 }
 return <main style={{maxWidth:680,margin:"80px auto",padding:24}}>
  <p>Dionne’s Boutique</p>
  <h1>{paid?"Payment received":confirmed?"Payment confirmation pending":"Check your payment status"}</h1>
  <p>{paid?"Stripe confirms your payment. Keep your Stripe receipt for reference and contact the boutique for delivery information.":confirmed?"Your payment is still awaiting confirmation. Check your Stripe receipt before attempting another payment.":"We could not confirm payment status here. Check your Stripe receipt before attempting another payment."}</p>
  <Link href="/">Return to the boutique</Link>
 </main>;
}
