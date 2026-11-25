"use client";
import {saleActive,SALE_END} from "@/lib/black-friday";
import {useEffect,useRef,useState} from "react";

const SALE_KEY="dionnes-black-friday-2026-dismissed";
const WELCOME_KEY="dionnes-welcome-dismissed-this-session";
export default function WelcomeModal(){
 const [open,setOpen]=useState(false);
 const [paymentsReady,setPaymentsReady]=useState(false);
 const ref=useRef<HTMLButtonElement>(null);
 const sale=saleActive();
 useEffect(()=>{const reopen=()=>setOpen(true);window.addEventListener("dionnes:welcome",reopen);return()=>window.removeEventListener("dionnes:welcome",reopen)},[]);
 useEffect(()=>{try{if(sessionStorage.getItem(saleActive()?SALE_KEY:WELCOME_KEY)==="yes")return}catch{}const timer=setTimeout(()=>setOpen(true),1100);return()=>clearTimeout(timer)},[]);
 useEffect(()=>{
  let cancelled=false;
  const check=async()=>{try{const response=await fetch("/api/checkout",{cache:"no-store"});if(!response.ok)return;const d=await response.json();if(!cancelled)setPaymentsReady(Boolean(d.stripeConnected&&d.checkoutEnabled&&d.webhookConfigured&&d.fulfillmentConfigured&&d.orderRecordingConfigured&&d.shippingAndTaxConfigured&&d.inventoryReady))}
   catch{if(!cancelled)setPaymentsReady(false)}};
  check();const interval=setInterval(check,60000);return()=>{cancelled=true;clearInterval(interval)}
 },[]);
 useEffect(()=>{if(!saleActive())return;const timer=setTimeout(()=>setOpen(false),Math.max(0,SALE_END-Date.now()));return()=>clearTimeout(timer)},[]);
 useEffect(()=>{
  if(!open)return;
  const prior=document.body.style.overflow;document.body.style.overflow="hidden";ref.current?.focus();
  const key=(e:KeyboardEvent)=>{if(e.key==="Escape")setOpen(false);if(e.key==="Tab"){
   const elements=[...document.querySelectorAll<HTMLElement>(".welcome-dialog button,.welcome-dialog a")];
   if(!elements.length)return;const first=elements[0],last=elements[elements.length-1];
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
   if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
  }};
  document.addEventListener("keydown",key);
  return()=>{document.body.style.overflow=prior;document.removeEventListener("keydown",key)}
 },[open]);
 function close(){try{sessionStorage.setItem(saleActive()?SALE_KEY:WELCOME_KEY,"yes")}catch{}setOpen(false)}
 if(!open)return null;
 return <div className="welcome-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)close()}}>
  <section className="welcome-dialog" role="dialog" aria-modal="true" aria-labelledby="welcome-title" aria-describedby="welcome-description">
   <button ref={ref} className="welcome-exit" aria-label="Close boutique announcement" onClick={close}>×</button>
   <div className="welcome-border">
    <img className="welcome-official-logo" src="/brand/Dionnes_Boutique_Approved_Logo.png" onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src="/brand/official-gold-logo.svg"}} alt="Dionne’s Boutique official gold logo"/>
    {sale?<><div className="welcome-kicker" style={{letterSpacing:".13em",color:"#a87824"}}>✦ BLACK FRIDAY THROUGH CYBER MONDAY ✦</div>
     <h2 id="welcome-title" style={{fontSize:"clamp(2rem,7vw,3.25rem)"}}>Black Friday–Cyber Monday <span>✦</span></h2>
     <div style={{background:"#14110d",color:"#f5d58b",padding:"18px 8px",border:"2px solid #c5a05b",margin:"12px 0",boxShadow:"0 0 24px #c5a05b66"}}>
      <div style={{fontSize:"clamp(3.5rem,13vw,6rem)",fontWeight:800,lineHeight:1}}>50% OFF</div>
      <div style={{letterSpacing:".14em",marginTop:7}}>ALL MERCHANDISE</div>
     </div>
     <div id="welcome-description" className="welcome-copy">
      <p>50% off current listed prices, including already-discounted open-box merchandise, through November 30 at 11:59 p.m. Central. Original prices return automatically December 1.</p>
      <p><strong>{paymentsReady?"Secure online payments are now available and recommended.":"Secure checkout is being verified; purchase buttons activate when payment and inventory checks pass."}</strong> Shipping and applicable taxes are added at checkout.</p>
     </div>
     <button className="welcome-shop" onClick={()=>{close();document.getElementById("shop")?.scrollIntoView({behavior:"smooth"})}}>SHOP THE SALE →</button>
    </>:<><div className="welcome-kicker">✧ A NOTE FROM DIONNE’S BOUTIQUE ✧</div>
     <h2 id="welcome-title">Bonjour, Family! <span>✦</span></h2>
     <div id="welcome-description" className="welcome-copy"><p>Welcome to Dionne’s Boutique — a curated collection of fragrance, beauty and wonderful finds, selected with style and boutique charm.</p><p>Discover unique selections from our sister store, Thrifted Creations by Dionne’s Boutique.</p><p><strong>{paymentsReady?"Secure online checkout is available and recommended.":"Explore our selection and check the shopping bag for current checkout availability."}</strong></p><p>Shipping and applicable taxes are calculated at checkout.</p></div>
     <button className="welcome-shop" onClick={()=>{close();document.getElementById("shop")?.scrollIntoView({behavior:"smooth"})}}>EXPLORE THE COLLECTION →</button>
    </>}
    <div className="welcome-tagline">Timeless Style. Elevated You. ✨</div>
    <button className="welcome-later" onClick={close}>Continue browsing</button>
   </div>
  </section>
 </div>;
}
