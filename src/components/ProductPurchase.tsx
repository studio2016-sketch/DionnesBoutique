"use client";
import {useEffect,useState} from "react";
import {saleActive} from "@/lib/black-friday";
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
  <div className="detail-price">{currency(original)}</div>{sale&&<p className="detail-small">Black Friday–Cyber Monday: your 30%, 40%, or 50% discount is calculated and applied <strong>in your shopping bag</strong>, using the total merchandise purchase amount before shipping and tax.</p>}
  {openBox&&<p className="detail-small">Open-box merchandise is already marked down. Any promotional discount is calculated from your full shopping bag subtotal.</p>}
  <button className="detail-buy-button" type="button" onClick={add} disabled={!canBuy}>
   {!checked?"CHECKING AVAILABILITY…":failed?"AVAILABILITY UNAVAILABLE":canBuy?"ADD TO SHOPPING BAG":listing?.available===0?"SOLD OUT":"CURRENTLY UNAVAILABLE"}
  </button>
  <p className="detail-small">{canBuy?"Available inventory confirmed by WGOS. Secure checkout is accessed through your shopping bag.":"Inventory is checked live before checkout. No payment is taken on this page."}</p>
 </div>;
}
