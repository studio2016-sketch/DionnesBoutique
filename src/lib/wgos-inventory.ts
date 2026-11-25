import "server-only";
import {products as catalog} from "@/data/products";

export type StoreInventoryLine={
 id:number;priceCents:number;available:number;active:boolean;sellable:boolean;
 condition:string;countConfirmed:boolean;conditionReviewed:boolean;
};
export type StoreInventory={
 source:"WGOS";brandId:"dionnesBoutique";mode:string;
 cutoverReady:boolean;reconciliationStatus:string;products:StoreInventoryLine[];
};
export function eligibleLine(line:StoreInventoryLine){
 return line.active&&line.sellable&&line.condition==="NEW"&&
  line.countConfirmed&&line.conditionReviewed&&line.available>0;
}
export function checkoutInventoryReady(data:StoreInventory){
 return data.mode==="AUTHORITATIVE"&&data.cutoverReady&&data.reconciliationStatus==="APPROVED";
}
export async function fetchWgosInventory():Promise<StoreInventory>{
 const secret=process.env.BOUTIQUE_ORDER_SYNC_SECRET;
 if(!secret)throw new Error("WGOS inventory connection is not configured.");
 const response=await fetch("https://wgos.app/api/retail/boutique-inventory",{
  headers:{authorization:"Bearer "+secret},cache:"no-store",
  signal:AbortSignal.timeout(10000)
 });
 if(!response.ok)throw new Error("WGOS inventory is unavailable.");
 const data=await response.json();
 if(data.source!=="WGOS"||data.brandId!=="dionnesBoutique"||
  !["SHADOW","READ_ONLY","AUTHORITATIVE"].includes(data.mode)||
  typeof data.cutoverReady!=="boolean"||typeof data.reconciliationStatus!=="string"||
  !Array.isArray(data.products)||data.products.length!==catalog.length)
  throw new Error("WGOS catalog status is invalid.");
 const ids=new Set<number>();
 for(const line of data.products as StoreInventoryLine[]){
  if(!line||!Number.isSafeInteger(line.id)||!Number.isSafeInteger(line.priceCents)||
   !Number.isSafeInteger(line.available)||line.available<0||line.priceCents<0||
   typeof line.active!=="boolean"||typeof line.sellable!=="boolean"||
   typeof line.countConfirmed!=="boolean"||typeof line.conditionReviewed!=="boolean"||
   !["NEW","OPEN_BOX","USED","DAMAGED","HOLD","UNKNOWN"].includes(line.condition)||
   ids.has(line.id)||!catalog.some(p=>p.id===line.id))
    throw new Error("WGOS inventory product data is invalid.");
  ids.add(line.id);
 }
 return data as StoreInventory;
}
