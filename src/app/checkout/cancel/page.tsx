import Link from "next/link";
export const metadata={title:"Return to your shopping | Dionne’s Boutique",robots:{index:false,follow:false}};
export default function CheckoutCancel(){
 return <main style={{maxWidth:680,margin:"80px auto",padding:24}}>
  <p>Dionne’s Boutique</p><h1>Continue browsing</h1>
  <p>You can return to the boutique to review your items. If you already submitted a payment, check your Stripe receipt before trying again.</p>
  <Link href="/">Return to the boutique</Link>
 </main>;
}
