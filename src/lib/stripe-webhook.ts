import Stripe from "stripe";
import {boutiqueAccountId} from "./stripe-account";

const checkoutEvents=new Set(["checkout.session.completed","checkout.session.async_payment_succeeded","checkout.session.async_payment_failed","checkout.session.expired"]);

export function verifyCheckoutEvent(raw:string,signature:string,secret:string,key:string){
 const client=new Stripe(key);
 const event=client.webhooks.constructEvent(raw,signature,secret);
 if(event.livemode!==true||(event.account&&event.account!==boutiqueAccountId))throw new Error("Wrong event environment or account.");
 if(!checkoutEvents.has(event.type))return null;
 const session=event.data.object as Stripe.Checkout.Session;
 if(session.metadata?.source!=="dionnesboutique.com")return null;
 if(!/^evt_[a-zA-Z0-9]+$/.test(event.id)||!/^cs_live_[a-zA-Z0-9]+$/.test(session.id)||
    !Number.isSafeInteger(event.created)||event.created<=0||session.object!=="checkout.session"||session.livemode!==true)
  throw new Error("Invalid checkout event.");
 if(session.amount_total!=null&&(!Number.isSafeInteger(session.amount_total)||session.amount_total<0))throw new Error("Invalid amount.");
 if(session.currency!=null&&!/^[a-z]{3}$/.test(session.currency))throw new Error("Invalid currency.");
 const paymentState=event.type==="checkout.session.expired"?"EXPIRED":
  event.type==="checkout.session.async_payment_failed"?"FAILED":
  session.payment_status==="paid"?"PAID":"PENDING";
 return {accountId:boutiqueAccountId,eventId:event.id,sessionId:session.id,eventType:event.type,
  eventCreatedAt:new Date(event.created*1000).toISOString(),paymentState,amountTotal:session.amount_total??null,currency:session.currency??null};
}
