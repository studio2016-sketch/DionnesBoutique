import "server-only";

type HoldAction=
 | {action:"reserve";requestId:string;lines:{id:number;quantity:number}[]}
 | {action:"attach";id:string;sessionId:string}
 | {action:"release";id:string};

export async function wgosReservation(action:HoldAction):Promise<any>{
 const secret=process.env.BOUTIQUE_ORDER_SYNC_SECRET;
 if(!secret)throw new Error("WGOS order service is not configured.");
 const response=await fetch("https://wgos.app/api/retail/checkout-reservation",{
  method:"POST",headers:{"content-type":"application/json",authorization:"Bearer "+secret},
  body:JSON.stringify(action),cache:"no-store",signal:AbortSignal.timeout(14000)
 });
 if(!response.ok)throw new Error("WGOS stock reservation is unavailable.");
 return response.json();
}
export async function releaseBoutiqueHold(id:string){
 if(!/^[0-9a-f-]{36}$/i.test(id))throw new Error("Invalid stock hold");
 return wgosReservation({action:"release",id});
}
