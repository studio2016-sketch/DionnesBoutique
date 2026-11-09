import Stripe from "stripe";
export async function checkoutCommerceSettings(key:string){
 const secret=process.env.BOUTIQUE_ORDER_SYNC_SECRET;
 if(!secret)throw new Error("Commerce settings unavailable.");
 const response=await fetch("https://wgos.app/api/retail/commerce-settings",{headers:{authorization:"Bearer "+secret},cache:"no-store",signal:AbortSignal.timeout(10000)});
 if(!response.ok)throw new Error("Commerce settings unavailable.");
 const {settings:s}=await response.json();
 if(!s?.shippingEnabled||s.taxMode!=="AUTOMATIC"||!Number.isSafeInteger(s.shippingCents)||s.shippingCents<0||s.shippingCents>100000||
  !Number.isSafeInteger(s.minDays)||!Number.isSafeInteger(s.maxDays)||s.minDays<1||s.maxDays<s.minDays||s.maxDays>60||
  !/^txcd_[0-9]{8}$/.test(s.taxCode)||s.taxBehavior!=="exclusive")throw new Error("Shipping and tax setup is incomplete.");
 const client=new Stripe(key),tax=await client.tax.settings.retrieve();
 let registered=false;
 for await(const registration of client.tax.registrations.list({status:"active",limit:100})){if(registration.country==="US")registered=true;}
 if(tax.status!=="active"||!registered)throw new Error("Tax registration is not ready.");
 await client.taxCodes.retrieve(s.taxCode);
 return s as {shippingCents:number;minDays:number;maxDays:number;taxCode:string;taxBehavior:"exclusive"};
}
