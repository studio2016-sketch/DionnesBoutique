const boutiqueAccountId="acct_1UZh0B0yHQiI07GK";

export async function verifiedBoutiqueStripeKey(){
 const key=process.env.STRIPE_SECRET_KEY;
 if(!key)throw new Error("Stripe is not configured.");
 const response=await fetch("https://api.stripe.com/v1/account",{
  headers:{Authorization:"Bearer "+key},cache:"no-store",signal:AbortSignal.timeout(10000)
 });
 if(!response.ok)throw new Error("Unable to verify Stripe account.");
 const account=await response.json();
 if(account.id!==boutiqueAccountId)throw new Error("Stripe account mismatch.");
 if(!account.charges_enabled)throw new Error("Stripe payments are unavailable.");
 return key;
}
