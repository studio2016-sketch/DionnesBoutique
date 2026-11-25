import {NextResponse} from "next/server";
import {fetchWgosInventory,checkoutInventoryReady,eligibleLine} from "@/lib/wgos-inventory";

export const runtime="nodejs";
export const dynamic="force-dynamic";
const headers={"Cache-Control":"no-store, private"};
export async function GET(){
 try{
  const inventory=await fetchWgosInventory();
  return NextResponse.json({
   inventoryConnected:true,
   checkoutInventoryReady:checkoutInventoryReady(inventory),
   inventoryMode:inventory.mode,
   products:inventory.products.map(line=>({
    id:line.id,priceCents:line.priceCents,
    approved:line.active&&line.sellable&&["NEW","OPEN_BOX"].includes(line.condition)&&line.countConfirmed&&line.conditionReviewed,
    inStock:eligibleLine(line),
    available:eligibleLine(line)?line.available:0
   }))
  },{headers});
 }catch{
  return NextResponse.json({inventoryConnected:false,checkoutInventoryReady:false,
   products:[],error:"Live inventory is temporarily unavailable."},{status:503,headers});
 }
}
