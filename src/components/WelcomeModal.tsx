"use client";
import {saleActive,SALE_END} from "@/lib/black-friday";
import {useEffect,useRef,useState} from "react";

const KEY="dionnes-bfcm-tiered-sale-2026-dismissed";
export default function WelcomeModal(){
 const [open,setOpen]=useState(false);
 const [paymentsReady,setPaymentsReady]=useState(false);
 const closeRef=useRef<HTMLButtonElement>(null);
 const sale=saleActive();
 useEffect(()=>{
  if(!saleActive())return;
  try{if(sessionStorage.getItem(KEY)==="yes")return}catch{}
  const timer=setTimeout(()=>setOpen(true),380);
  return()=>clearTimeout(timer);
 },[]);
 useEffect(()=>{
  const reopen=()=>{if(saleActive())setOpen(true)};
  window.addEventListener("dionnes:welcome",reopen);
  return()=>window.removeEventListener("dionnes:welcome",reopen);
 },[]);
 useEffect(()=>{
  if(!saleActive())return;
  const timer=setTimeout(()=>setOpen(false),Math.max(0,SALE_END-Date.now()));
  return()=>clearTimeout(timer);
 },[]);
 useEffect(()=>{
  let cancelled=false;
  fetch("/api/checkout",{cache:"no-store"}).then(r=>r.ok?r.json():null).then(data=>{
   if(!cancelled&&data)setPaymentsReady(Boolean(data.stripeConnected&&data.checkoutEnabled&&data.webhookConfigured&&data.fulfillmentConfigured&&data.orderRecordingConfigured&&data.shippingAndTaxConfigured&&data.inventoryReady));
  }).catch(()=>{});
  return()=>{cancelled=true};
 },[]);
 useEffect(()=>{
  if(!open)return;
  const previous=document.body.style.overflow;
  const focusBefore=document.activeElement instanceof HTMLElement?document.activeElement:null;
  document.body.style.overflow="hidden";closeRef.current?.focus();
  const onKey=(e:KeyboardEvent)=>{
   if(e.key==="Escape")close();
   if(e.key!=="Tab")return;
   const nodes=[...document.querySelectorAll<HTMLElement>(".welcome-dialog button,.welcome-dialog a")].filter(n=>!n.hasAttribute("disabled"));
   if(nodes.length===0)return;
   if(e.shiftKey&&document.activeElement===nodes[0]){e.preventDefault();nodes[nodes.length-1].focus()}
   else if(!e.shiftKey&&document.activeElement===nodes[nodes.length-1]){e.preventDefault();nodes[0].focus()}
  };
  document.addEventListener("keydown",onKey);
  return()=>{document.body.style.overflow=previous;document.removeEventListener("keydown",onKey);focusBefore?.focus()};
 },[open]);
 function close(){try{sessionStorage.setItem(KEY,"yes")}catch{}setOpen(false)}
 function shop(){close();document.getElementById("shop")?.scrollIntoView({behavior:"smooth"})}
 if(!open||!sale)return null;
 return <div className="welcome-overlay bfcm-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)close()}}>
  <section className="welcome-dialog bfcm-dialog" role="dialog" aria-modal="true" aria-labelledby="bfcm-title" aria-describedby="bfcm-description">
   <div className="welcome-border bfcm-border">
    <button ref={closeRef} className="welcome-exit bfcm-close" aria-label="Close Black Friday promotion" onClick={close}>×</button>
    <img className="bfcm-brand-art" src="/brand/official-logo" onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src="/brand/official-gold-logo.svg"}} alt="Dionne’s Boutique official gold logo"/>
    <p className="bfcm-kicker">✦ BLACK FRIDAY THROUGH CYBER MONDAY ✦</p>
    <h2 id="bfcm-title" className="bfcm-headline">UP TO <strong>50% OFF</strong></h2>
    <p className="bfcm-subline">SITEWIDE MERCHANDISE SALE</p>
    <div id="bfcm-description" className="bfcm-copy">
     <p><strong>Discount applied in your shopping bag only.</strong> The tier is based on your total merchandise purchase before discounts, shipping and tax:</p>
     <div className="bfcm-tiers" aria-label="Sale discount thresholds">
      <div><b>30% OFF</b><span>Under $75</span></div>
      <div><b>40% OFF</b><span>$75–$149.99</span></div>
      <div><b>50% OFF</b><span>$150+</span></div>
     </div>
     <p className="bfcm-small">Includes already-reduced open-box listings. Valid through November 30, 2026, 11:59 p.m. Central. Regular listed prices return December 1. Shipping and applicable taxes are additional.</p>
     <p className="bfcm-payment">{paymentsReady?"Secure online payments are available and recommended.":"Secure checkout availability is confirmed when you open your shopping bag."}</p>
    </div>
    <button className="welcome-shop bfcm-shop" onClick={shop}>SHOP THE SALE →</button>
    <button className="welcome-later bfcm-later" onClick={close}>Continue browsing</button>
   </div>
  </section>
 </div>;
}
