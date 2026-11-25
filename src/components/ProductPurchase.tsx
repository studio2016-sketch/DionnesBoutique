"use client";
import {useEffect,useState} from "react";
import {merchandisePrice,saleActive} from "@/lib/black-friday";
type Listing={id:number;priceCents:number;available:number;approved:boolean;inStock:boolean};
const currency=(value:number)=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(value);
export default function ProductPurchase({id,regularPrice,openBox}:{id:number;regularPrice:number;openBox:boolean}){
 const [listing,setListing]=useState<Listing|null>(null);
 const [checked,setChecked]=useState(false),[failed,setFailed]=useState(false);
 const [now,setNow]=useState(0);
 useEffect(()=>{
  let cancelled=false;
  const get=async()=>{try{
   const res=await fetch("/api/catalog-status",{cache:"no-store"});
   if(!res.ok)throw Error("Inventory unavailable");
   const data=await res.json();
   const item=data.products?.find((p:Listing)=>p.id===id);
   if(!cancelled){setListing(item||null);setFailed(false);setChecked(true);setNow(Date.now())}
  }catch{if(!cancelled){setListing(null);setFailed(true);setChecked(true)}}
  };
  get();const timer=setInterval(get,60000);return()=>{cancelled=true;clearInterval(timer)}
 },[id]);
 const original=listing?listing.priceCents/100:regularPrice;
 const sale=now>0&&saleActive(now);
 const price=now===0?original:merchandisePrice(original,now);
 const canBuy=checked&&!failed&&Boolean(listing?.approved&&listing.inStock);
 function add(){
  if(!canBuy)return;
  const max=listing?.available||0;
  let bag:number[]=[];
  try{const parsed=JSON.parse(localStorage.getItem("dionnes-shopping-bag")||"[]");if(Array.isArray(parsed))bag=parsed.filter((value:unknown)=>Number.isSafeInteger(value)&&Number(value)>=1&&Number(value)<=69).slice(0,100)}catch{}
  if(bag.filter(item=>item===id).length>=max)return;
  bag.push(id);
  try{localStorage.setItem("dionnes-shopping-bag",JSON.stringify(bag))}catch{}
  window.location.assign("/?bag=1#shop");
 }
 return <div>
  <div className="detail-price">{sale&&<del style={{color:"#806c58",fontSize:"0.6em",marginRight:12}}>{currency(original)}</del>} {currency(price)}</div>{sale&&<p className="detail-small">Displayed sale price is for a single-item order. Your final discount is recalculated from the full merchandise subtotal in your bag: under $75 = 30%, $75–$149.99 = 40%, $150+ = 50%. Shipping and tax extra.</p>}
  {openBox&&<p className="detail-small">Open-box listing; the catalog price already reflects its stated condition. The Black Friday tier applies to this existing price through November 30.</p>}
  <button className="detail-buy-button" type="button" onClick={add} disabled={!canBuy}>
   {!checked?"CHECKING AVAILABILITY…":failed?"AVAILABILITY UNAVAILABLE":canBuy?"ADD TO SHOPPING BAG":listing?.available===0?"SOLD OUT":"CURRENTLY UNAVAILABLE"}
  </button>
  <p className="detail-small">{canBuy?"Available inventory confirmed by WGOS. Secure checkout is accessed through your shopping bag.":"Inventory is checked live before checkout. No payment is taken on this page."}</p>
 </div>;
}
